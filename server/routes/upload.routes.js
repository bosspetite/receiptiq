import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { extractReceipt } from '../controllers/upload.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadRouter = Router();

function withMulter(middleware) {
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (!err) return next();
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          const e = new Error('Receipt file exceeds 10MB limit');
          e.statusCode = 413;
          return next(e);
        }
        const e = new Error(err.message);
        e.statusCode = 400;
        return next(e);
      }
      return next(err);
    });
  };
}

uploadRouter.post(
  '/extract',
  requireAuth,
  withMulter(upload.single('receipt')),
  asyncHandler(async (req, res) => extractReceipt(req, res))
);
