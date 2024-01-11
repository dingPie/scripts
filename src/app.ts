import morgan from "morgan";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { defaultSession } from "./middleware/session";
import { sequelize } from "./models";

import passport from "passport";
import authRouter from "./routes/auth";

import { firebaseApp } from "./firebase";
import { lunchSchedule } from "./schedule";

dotenv.config();

export const app = express();
// passportConfig();

app.set("port", process.env.PORT || 8080);

firebaseApp; // firebase init
lunchSchedule;

sequelize
  // alter:true 의 경우 바꾼 부분만 변경함.
  .sync({ force: false, alter: false }) // force: true 일 경우, 항상 BD를 재생성함
  .then(() => console.log("DB 연결성공"))
  .catch((err) => {
    console.log("DB 연결 에러: ", err);
  });

/**
 * middleware
 */
// margon
const margonMode = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(margonMode));

// cookie-parser
app.use(cookieParser(process.env.SECRET_KEY || ""));

// express-session
app.use(defaultSession);

// passport 초기화. session 설정 아래에 들어가야 한다.
app.use(passport.initialize());
app.use(passport.session());

// static (요청경로, 실제경로)
app.use("/public", express.static(path.join(__dirname, "public"))); // 이건 next가 실행되지 않음. 때문에 다른 미들웨어보다 보통 위에 있어야 함.
app.use(
  "/img",
  express.static(path.join(__dirname.split("/src")[0], "uploads"))
); // 이미지 파일을 받는 경로 변경.

// body-parser
app.use(express.json()); // json 데이터 파싱
app.use(express.urlencoded({ extended: true })); // form 데이터 파싱, extends: true는 qs 모듈을 쓰는데 이게 더 좋다. 걍 true 쓰자.

/**
 * endpoint
 */
app.use("/v1/auth", authRouter);

/**
 * 404 처리
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

/**
 * error 처리
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.json({
    code: err.status || 500,
    message: res.locals.error.message,
  });
  // res.send(
  //   `${res.locals.error.status}\n
  //   ${res.locals.error.message}\n
  //   ${res.locals.error.stack}`
  // );
});
