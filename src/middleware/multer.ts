import multer from "multer";
import path from "path";

/**
 * multer 업로드 방식
 */
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const extname = path.extname(file.originalname); // 파일 형식
      done(
        null,
        path.basename(file.originalname, extname) + "_" + Date.now() + extname
      );
    },
  }),
});

export { upload };
