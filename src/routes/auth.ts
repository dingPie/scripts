import { NextFunction, Request, Response, Router } from "express";

import { login, logout, refresh } from "../controllers/auth";
import { verifyAccess } from "../middleware/verify-token";

const authRouter = Router();

authRouter.post("/login", login);

authRouter.post("/refresh", refresh);

authRouter.post("/logout", verifyAccess, logout);

export default authRouter;
