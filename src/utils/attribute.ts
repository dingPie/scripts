import { CreationOptional, DataTypes, Model, fn } from "sequelize";

export const idAttribute = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
};

export const timestampAttribute = {
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: fn("now"),
    field: "created_at",
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: fn("now"),
    field: "updated_at",
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "deleted_at",
  },
};
