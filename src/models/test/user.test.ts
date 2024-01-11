import * as configJson from "../../config/config.json";
import { Dialect, Sequelize } from "sequelize";
import User, { initUser } from "../user";

describe("User Model Test", () => {
  const config = configJson.test;

  const { username, password, dialect, database } = config;

  const sequelize = new Sequelize({
    database,
    dialect: dialect as Dialect,
    username,
    password,
  });

  const mockUser = initUser(sequelize);

  test("static init 메서드 호출", () => {
    expect(mockUser).toBe(User);
  });

  // 여기는... associate 부분이 없어서 제대로 호출 테스트가 안됨..
  //   test("static associate 메서드 호출", () => {
  //     const mockDb = {
  //       User: {
  //         hasMany: jest.fn(),
  //         belongsToMany: jest.fn(),
  //       },
  //       Post: {},
  //     };
  //     expect(mockDb.User.hasMany).toBeCalledWith(mockDb.Post);
  //     expect(mockDb.User.hasMany).toBeCalledTimes(2);
  //   });
});
