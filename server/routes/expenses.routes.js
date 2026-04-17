import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  listExpenses,
  createExpense,
  getSummary,
} from '../controllers/expenses.controller.js';

export const expensesRouter = Router();

expensesRouter.use(requireAuth);

expensesRouter.get(
  '/summary',
  asyncHandler(async (req, res) => getSummary(req, res))
);

expensesRouter.get(
  '/',
  asyncHandler(async (req, res) => listExpenses(req, res))
);

expensesRouter.post(
  '/',
  asyncHandler(async (req, res) => createExpense(req, res))
);
