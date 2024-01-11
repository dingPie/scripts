import UserModel from "../models/user";

declare global {
  namespace Express {
    interface User extends UserModel {
      id: number;
    }
    interface Request {
      decoded?: any; // P_MEMO 임시 any타입 지정
    }
  }
  namespace Sse {}
}
