const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  enrollmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Enrollments',
      key: 'id'
    }
  },
  moduleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Modules',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
    defaultValue: 'not_started'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  timeSpent: {
    type: DataTypes.INTEGER, // Time spent in minutes
    defaultValue: 0
  },
  lastAccessDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    afterUpdate: async (progress) => {
      if (progress.changed('status') && progress.status === 'completed') {
        // Update enrollment progress
        const enrollment = await sequelize.models.Enrollment.findByPk(progress.enrollmentId);
        if (enrollment) {
          await enrollment.updateProgress();
        }
      }
    }
  }
});

// Define associations
Progress.associate = (models) => {
  Progress.belongsTo(models.Enrollment, {
    foreignKey: 'enrollmentId',
    as: 'enrollment'
  });
  Progress.belongsTo(models.Module, {
    foreignKey: 'moduleId',
    as: 'module'
  });
};

// Instance methods
Progress.prototype.startModule = async function() {
  if (this.status === 'not_started') {
    this.status = 'in_progress';
    this.startDate = new Date();
    await this.save();
  }
};

Progress.prototype.completeModule = async function(score = null) {
  this.status = 'completed';
  this.completionDate = new Date();
  if (score !== null) {
    this.score = score;
  }
  this.attempts += 1;
  await this.save();
};

Progress.prototype.updateTimeSpent = async function(minutes) {
  this.timeSpent += minutes;
  this.lastAccessDate = new Date();
  await this.save();
};

module.exports = Progress;