import { sign } from "jsonwebtoken";

export const getAccessToken = (
  value: Record<string, any>,
  expiresIn = "1h"
) => {
  const accessToken = sign(value, process.env.JWT_SECRET || "NONE", {
    expiresIn,
    issuer: process.env.MEMONT,
  });

  return accessToken;
};

export const getRefreshToken = (
  value: Record<string, any>,
  expiresIn = "14d"
) => {
  const refreshToken = sign(value, process.env.JWT_SECRET || "NONE", {
    expiresIn,
    issuer: process.env.MEMONT,
  });

  return refreshToken;
};
