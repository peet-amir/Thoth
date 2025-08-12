const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Module = sequelize.define('Module', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Courses',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in minutes
    allowNull: true
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  contentType: {
    type: DataTypes.ENUM('video', 'document', 'quiz', 'assignment'),
    allowNull: false
  },
  contentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  requiredTimeToComplete: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true
  },
  objectives: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (module) => {
      // Get the highest order number for the course and increment by 1
      const highestOrder = await Module.findOne({
        where: { courseId: module.courseId },
        order: [['order', 'DESC']]
      });
      module.order = highestOrder ? highestOrder.order + 1 : 1;
    }
  }
});

// Define associations
Module.associate = (models) => {
  Module.belongsTo(models.Course, {
    foreignKey: 'courseId',
    as: 'course'
  });
  Module.hasMany(models.Content, {
    foreignKey: 'moduleId',
    as: 'contents'
  });
  Module.hasMany(models.Progress, {
    foreignKey: 'moduleId',
    as: 'progress'
  });
};

// Instance methods
Module.prototype.updateOrder = async function(newOrder) {
  const oldOrder = this.order;
  if (newOrder === oldOrder) return;

  await sequelize.transaction(async (t) => {
    if (newOrder > oldOrder) {
      await Module.update(
        { order: sequelize.literal('order - 1') },
        {
          where: {
            courseId: this.courseId,
            order: { [Op.between]: [oldOrder + 1, newOrder] }
          },
          transaction: t
        }
      );
    } else {
      await Module.update(
        { order: sequelize.literal('order + 1') },
        {
          where: {
            courseId: this.courseId,
            order: { [Op.between]: [newOrder, oldOrder - 1] }
          },
          transaction: t
        }
      );
    }
    this.order = newOrder;
    await this.save({ transaction: t });
  });
};

module.exports = Module;