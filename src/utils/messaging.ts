import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import dotenv from "dotenv";

import { messaging } from "firebase-admin";

import RefrigeratorUser from "../models/refrigerator-user";
import ItemInfo from "../models/item-info";
import { Op } from "sequelize";

import { getExpireCriteria } from "../utils/get-expire-criteria";

dotenv.config();

/**
 * P_TODO
 FCM 대량 발송은 한번에 500개만 가능.
 유저 늘어나면 추후에 구조 변경해야 함.
 P_TODO
 */

/**
 * 지정한 점심시간에 먹었는지 메세지 발송
 * @param hour
 */
export const messagingAtLunch = async (hour: number) => {
  const userList = await RefrigeratorUser.findAll({
    where: {
      lunchAlertTime: hour,
    },
    attributes: ["id", "userName", "refrigeratorId"],
    include: {
      model: User,
      as: "user",
      attributes: ["fcmToken"],
    },
  });

  const messageList = userList.map((v) => {
    return {
      notification: {
        title: "점심시간 알림",
        body: "오늘 드신 상품이 있다면 사용을 체크해주세요!",
      },
      data: { refrigeratorId: v.refrigeratorId.toString() },
      token: v.user?.fcmToken || "",
    };
  });

  try {
    const fcmMessaging = await messaging().sendEach(messageList);
    console.log("FCM Send Success: ", fcmMessaging);
  } catch (err) {
    console.log("FCM Error: ", err);
  }
};

/**
 * 매 9시 만료 N일 전 상품 알림 함수
 */
export const beforeDate = async () => {
  const userList = await RefrigeratorUser.findAll({
    where: {
      beforeExpireAlertDate: {
        [Op.not]: null,
      },
    },
    attributes: ["id", "userName", "refrigeratorId", "beforeExpireAlertDate"],
    include: {
      model: User,
      as: "user",
      attributes: ["fcmToken"],
      where: {
        fcmToken: {
          [Op.not]: null,
        },
      },
    },
  });

  const targetUserList = userList.filter(async (user) => {
    const result = await ItemInfo.findOne({
      where: {
        expireDate: {
          [Op.lte]: getExpireCriteria(user?.beforeExpireAlertDate),
        },
      },
      attributes: ["id", "expireDate"],
    });
    return !!result;
  });

  const messageList = targetUserList.map((v) => {
    return {
      notification: {
        title: "만료일 전 알림",
        body: `만료일이 ${v?.beforeExpireAlertDate}일 이내인 상품이 있어요! 확인 후 사용해주세요.`,
      },
      data: { refrigeratorId: v.refrigeratorId.toString() },
      token: v.user?.fcmToken || "",
    };
  });

  try {
    const fcmMessaging = await messaging().sendEach(messageList);
    console.log(`${messageList.length} 명의 유저에게 메세지 보내기 성공`);
  } catch (err) {
    console.log("FCM Error: ", err);
  }
};
