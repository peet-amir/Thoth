const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in minutes
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  thumbnail: {
    type: DataTypes.STRING, // URL to course thumbnail
    allowNull: true
  },
  enrollmentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  prerequisites: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  objectives: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (course) => {
      // Any pre-save operations can go here
    }
  }
});

// Define associations
Course.associate = (models) => {
  Course.belongsTo(models.User, {
    foreignKey: 'instructorId',
    as: 'instructor'
  });
  Course.hasMany(models.Module, {
    foreignKey: 'courseId',
    as: 'modules'
  });
  Course.hasMany(models.Enrollment, {
    foreignKey: 'courseId',
    as: 'enrollments'
  });
  Course.hasMany(models.Review, {
    foreignKey: 'courseId',
    as: 'reviews'
  });
};

module.exports = Course;