import multer from "multer";

const MIME_TYPES = {
  "image/jpg": "jpg",
  // tslint:disable-next-line:object-literal-sort-keys
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({

// @ts-ignore
  destination: (req, file, callback) => {
    callback(null, "ressources/model_ressources/images/post");
  },

// @ts-ignore
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_").replace(/[^a-z0-9]/gi, "_").toLowerCase();

// @ts-ignore
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name + Date.now()}.${extension}`);
  },
});

// module.exports = multer({ storage }).single('image')
export const postMulter = multer({ storage }).single("post_image");
