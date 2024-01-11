import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { decode, verify } from "jsonwebtoken";
import { getAccessToken, getRefreshToken } from "../utils/token";

import { AccessTokenPayloadType } from "../@types/jsonwebtoken-types";
import dotenv from "dotenv";

dotenv.config();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 로그인 로직
  // P_TODO: client에서 뭘 보낼지는 로직이 변경될 수 있음.
  const { userLoginId, provider, fcmToken } = req.body;
  if (!(userLoginId && provider)) {
    return res.status(404).json({
      code: 404,
      message: "필수 값이 없습니다.", // 재로그인 해야함.
    });
  }
  let user = await User.findOne({
    where: { userLoginId, provider },
  });
  const refreshToken = getRefreshToken({});
  if (!user) {
    user = await User.create({
      provider,
      userLoginId,
      refreshToken, // 리프레시 토큰도 DB에 저장.
      fcmToken,
    });
  } else {
    // P_TODO findOne과 update를 동시에 칠 수 있는 방법이 없나.
    await User.update({ refreshToken, fcmToken }, { where: { id: user.id } });
  }

  const accessToken = getAccessToken({
    userId: user.id,
    userLoginId,
  });
  return res.json({
    user: {
      id: user.id,
      provider: user.provider,
      userLoginId: user.userLoginId,
    },
    accessToken,
    refreshToken,
  });
};

// P_MEMO: 보통 비용이나 속도 문제 때문에 token을 db에 저장하지 않는게 일반적.
// 근데 현재 규모가 작다보니 굳이 Redis같은거 안배우고 일단 하기로 함. 나중에 바꾸지 뭐.
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const accessToken = req.headers?.authorization?.split("Bearer ")[1] as string;
  const { refreshToken } = req.body;

  if (!refreshToken) {
    // 토큰이 없거나 유효하지 않을 때
    return res.status(401).json({
      code: 402,
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
    // const decodedAccess = decode(accessToken) as AccessTokenPayloadType;

    // const user = await User.findOne({
    //   where: { id: decodedAccess?.userId },
    // });
    const user = await User.findOne({
      where: { refreshToken },
    });

    // refresh토큰 검증. 만료되지 않았다면 accessToken 재발급
    if (!user) {
      return res.status(419).json({
        code: 404,
        message: "잘못된 토큰입니다.", // 재로그인 해야함.
      });
    }

    verify(user?.refreshToken as string, process.env.JWT_SECRET);
    const newAccessToken = getAccessToken({
      userId: user?.id,
      userLoginId: user?.userLoginId,
    });

    return res.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        provider: user.provider,
        userLoginId: user.userLoginId,
      },
    });
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      return res.status(429).json({
        code: 429,
        message: "리프레시 토큰이 만료되었습니다.", // 재로그인 해야함.
      });
    }
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers?.authorization?.split("Bearer ")[1] as string;
  const decodedAccess = decode(accessToken) as AccessTokenPayloadType;
  const user = await User.findOne({
    where: { userLoginId: decodedAccess?.userLoginId },
  });

  await User.update(
    { refreshToken: null, fcmToken: null },
    { where: { id: user?.id } }
  );

  return res.json({
    message: "로그아웃 성공.",
  });
};
