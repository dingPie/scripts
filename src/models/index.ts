import * as configJson from "../config/config.json";
import { Dialect, Sequelize } from "sequelize";
import User, { initUser } from "./user";

import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_NEV || "development";
const config =
  env === "development" ? configJson.development : configJson.production;
// const config = configJson.production;
const { username, password, dialect, database, logging, host } = config;

interface DBType {
  sequelize: Sequelize;
  User: typeof User;
}

export const sequelize = new Sequelize({
  database,
  dialect: dialect as Dialect,
  username,
  password,
  logging,
  host,
  timezone: "+09:00",
});

export const DB: DBType = {
  sequelize,
  User: initUser(sequelize),
};

// P_MEMO: DB 관계 설정은 init이 다 끝난 후 해야함. 때문에 따로 분리
// DB.User.hasMany(DB.RefrigeratorUser, { foreignKey: "user_id" });
// DB.RefrigeratorUser.belongsTo(DB.User, { foreignKey: "user_id", as: "user" });
