const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Courses',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'dropped', 'expired'),
    defaultValue: 'active'
  },
  enrollmentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  progress: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  lastAccessDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  certificateIssued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  certificateUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  paymentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (enrollment) => {
      // Any pre-save operations
    },
    afterCreate: async (enrollment) => {
      // Update course enrollment count
      await sequelize.models.Course.increment('enrollmentCount', {
        where: { id: enrollment.courseId }
      });
    }
  }
});

// Define associations
Enrollment.associate = (models) => {
  Enrollment.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'student'
  });
  Enrollment.belongsTo(models.Course, {
    foreignKey: 'courseId',
    as: 'course'
  });
  Enrollment.hasMany(models.Progress, {
    foreignKey: 'enrollmentId',
    as: 'moduleProgress'
  });
};

// Instance methods
Enrollment.prototype.updateProgress = async function() {
  const totalModules = await sequelize.models.Module.count({
    where: { courseId: this.courseId }
  });
  
  const completedModules = await sequelize.models.Progress.count({
    where: {
      enrollmentId: this.id,
      status: 'completed'
    }
  });

  this.progress = (completedModules / totalModules) * 100;
  
  if (this.progress === 100 && this.status !== 'completed') {
    this.status = 'completed';
    this.completionDate = new Date();
  }
  
  await this.save();
};

module.exports = Enrollment;