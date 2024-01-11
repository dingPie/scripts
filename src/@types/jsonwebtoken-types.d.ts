import * as jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    userLoginId: string;
  }
}

export interface AccessTokenPayloadType {
  userId: number;
  userLoginId: string;
}
