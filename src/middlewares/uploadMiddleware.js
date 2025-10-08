import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import createHttpError from 'http-errors';

const tempDir = path.join(process.cwd(), 'temp');

const multerConfig = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir);
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      createHttpError(
        400,
        'Invalid file type. Only JPEG, PNG and GIF are allowed.'
      )
    );
  }
};

export const upload = multer({
  storage: multerConfig,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
