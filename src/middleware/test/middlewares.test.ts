import { Request } from "express";
import { isLoggedIn, isNotLoggedIn } from "../is-login";

test("1 + 1 = 2", () => {
  expect(1 + 1).toEqual(2);
});

describe("isLoggedIn Test", () => {
  // MOCK 함수, 상태
  const res: any = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("로그인 되어 있으면 next 호출", () => {
    const req: any = {
      isAuthenticated: jest.fn(() => true),
    };
    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });

  test("로그인 되어 있지 않으면 에러를 응답해야 함.", () => {
    const req: any = {
      isAuthenticated: jest.fn(() => false),
    };
    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith("로그인 필요");
  });
});

describe("isNotLoggedIn Test", () => {
  const res: any = {
    redirect: jest.fn(),
  };
  const next = jest.fn();

  test("로그인 되어 있으면 에러를 응답", () => {
    const req: any = {
      isAuthenticated: jest.fn(() => true),
    };
    isNotLoggedIn(req, res, next);
    const message = encodeURIComponent("로그인한 상태입니다.");
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });

  test("로그인 되어 있지 않으면 next 호출", () => {
    const req: any = {
      isAuthenticated: jest.fn(() => false),
    };
    isNotLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});
