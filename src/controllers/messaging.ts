import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import dotenv from "dotenv";

import { messaging } from "firebase-admin";

import { Op } from "sequelize";

import { getExpireCriteria } from "../utils/get-expire-criteria";

dotenv.config();

/**
 * P_TODO
 FCM 대량 발송은 한번에 500개만 가능.
 유저 늘어나면 추후에 구조 변경해야 함.
 P_TODO
 */

// P_MEMO: 여러 사람에게 동일한 메세지를 보낼 때
// P_TODO: 이벤트는 이걸로 만들어야 함 .
export const testMessagingMulticast = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const registrationTokens = ["test"];

  const multicastMessage = {
    tokens: registrationTokens,
    condition: "test",
    notification: {
      title: "FCM Notification",
      body: "이 메세지는 API 테스트입니다.",
    },
    apns: {
      payload: {
        aps: {
          "mutable-content": 1,
        },
      },
      fcm_options: {
        image: "image-url",
      },
    },
  };

  try {
    const fcmMessaging = await messaging().sendEachForMulticast(
      multicastMessage
    );
    return res.json({
      message: "메세지 보내기 성공",
    });
  } catch (err) {
    next(err);
  }
};

export const testMessaging = async () => {
  const messageList = [].map((v) => {
    return {
      notification: {
        title: "FCM Notification",
        body: "이 메세지는 API 테스트입니다.",
      },
      data: { testData: "테스트데이터 입니다." },
      token: "토큰값이 들어가야 합니다.",
    };
  });

  try {
    const fcmMessaging = await messaging().sendEach(messageList);
    console.log("FCM 발송 성공", fcmMessaging);
  } catch (err) {
    console.log("FCM 발송 실패", err);
  }
};
