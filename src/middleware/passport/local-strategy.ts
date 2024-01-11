import passport from "passport";
import { Strategy } from "passport-local";
import User from "../../models/user";
import { compare } from "bcrypt";

const localStrategy = new Strategy(
  {
    usernameField: "email", // req.body.email
    passwordField: "password", // req.body.password
  },
  async (email, password, done) => {
    // P_TODO: Passport 쓸 지 말지 확인해야 함.
    // try {
    //   const user = await User.findOne({ where: { email } }); // {email: email}
    //   if (!user) {
    //     done(null, false, { message: "가입되지 않은 회원입니다." });
    //     return;
    //   }
    //   //  이미 존재하는 유저일 때, 비밀번호 검증
    //   const result = await compare(password, user.password);
    //   if (result) {
    //     done(null, user);
    //   } else {
    //     done(null, false, { message: "비밀번호가 일치하지 않습니다." });
    //   }
    // } catch (error) {
    //   console.error(error);
    //   done(error);
    // }
  }
);

export default localStrategy;
