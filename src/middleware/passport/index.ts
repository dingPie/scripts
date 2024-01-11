import passport from "passport";
import localStrategy from "./local-strategy";

import User from "../../models/user";
import { InferAttributes } from "sequelize";

// 이게 될까.. 원래는 module.exports =
const passportConfig = () => {
  passport.serializeUser((user, done) => {
    done(null, user); // id만 넘기면 버그남
  });

  // session에 저장된 userId로 DB조회
  passport.deserializeUser(async (user: InferAttributes<User>, done) => {
    const id = user ? user.id : "-1"; // 결국 다 넘긴 후 여기서 찾아줌
    try {
      const result = await User.findOne({ where: { id } });
      done(null, result);
    } catch (err) {
      done(err);
    }
  });

  passport.use(localStrategy);
};

export default passportConfig;
