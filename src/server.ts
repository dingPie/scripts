import { app } from "./app";

export const server = app.listen(app.get("port"), () => {
  console.log("연결된 포트: ", process.env.PORT);
});
