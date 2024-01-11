import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { idAttribute, timestampAttribute } from "../utils/attribute";
import { COL_MAX_LENGTH } from "../constants/col-max-length";

const { USER_LOGIN_ID, PROVIDER, TOKEN } = COL_MAX_LENGTH.USER;

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare provider: string;
  declare userLoginId: string; // 유저 로그인 아이디. email 로 대체될 수 있음.
  declare fcmToken: CreationOptional<string | null>;
  declare refreshToken: CreationOptional<string | null>; // P_TODO: 임시 추가 값. redis 등으로 분리될 수 있음

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

export const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      ...idAttribute,
      provider: {
        type: DataTypes.STRING(PROVIDER), // 해시화 된 비밀번호
        allowNull: false,
      },
      userLoginId: {
        type: DataTypes.STRING(USER_LOGIN_ID),
        allowNull: false, // 빈 값들은 중복이 가능
        field: "user_login_id",
      },
      // P_TODO: 임시 추가 값. redis 등으로 분리될 수 있음
      refreshToken: {
        type: DataTypes.STRING(TOKEN),
        allowNull: true,
        field: "fcm_token",
      },
      // FCM 발송을 위해 저장
      fcmToken: {
        type: DataTypes.STRING(TOKEN),
        allowNull: true,
        field: "fcm_token",
      },
      ...timestampAttribute,
    },
    //   모델에 대한 설정
    {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: "User",
      tableName: "user",
      paranoid: true, // ?
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );

  return User;
};

export default User;
