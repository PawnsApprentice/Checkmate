import path from "path";
import express from "express";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(
        file.originalname
      )}`.replace(/\\/g, "/") // Replace backslashes with forward slashes
    );
  },
});

function checkFileType(file, cb) {
  console.log(file);
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file received");
    }
    const filePath = req.file.path.replace(/\\/g, "/");
    console.log(filePath);
    res.send(`/${filePath}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
