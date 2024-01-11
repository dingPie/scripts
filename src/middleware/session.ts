import session from "express-session";

const defaultSession = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET_KEY || "", // 보통 cookie parser의 시크릿 키와 동일하게 씁니다.
  cookie: {
    httpOnly: true,
  },
  // name: "connect.sid", // default, 그러나 secret 때문에 값은 해시화 되어있을 것
  // store: // 세션 정보를 저장할 저장소를 설정합니다. 여러 라이브러리를 쓰는 듯 .
});

export { defaultSession };
