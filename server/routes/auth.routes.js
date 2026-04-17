import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getMe } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.get('/me', requireAuth, asyncHandler(async (req, res) => getMe(req, res)));
