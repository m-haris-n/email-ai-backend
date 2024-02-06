const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
   destination: (req, file, callback) => {
      callback(null, "./tmp");
   },
   filename: (req, file, callback) => {
      const filename =
         file.fieldname + "-" + Date.now() + path.extname(file.originalname);

      callback(null, filename);
   },
});
const upload_csv = multer({ storage: storage });

module.exports = { upload_csv };
