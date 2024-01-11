import dotenv from "dotenv";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

dotenv.config();

export const verifyAccess = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers?.authorization?.split("Bearer ")[1];
  if (!accessToken) {
    // 토큰이 없거나 유효하지 않을 때
    return res.status(401).json({
      code: 401,
      message: "토큰 없음.",
    });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      code: 500,
      message: "secret 없음. 설정오류.",
    });
  }

  try {
    if (accessToken && process.env.JWT_SECRET) {
      req.decoded = verify(accessToken, process.env.JWT_SECRET);
      next();
    }
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다.",
      });
    }
    // 토큰이 없거나 유효하지 않을 때
    return res.status(401).json({
      code: 401,
      message: "유효하지 않은 토큰입니다.",
    });
  }
};
