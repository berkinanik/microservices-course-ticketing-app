import express from 'express';
import { body, validationResult } from 'express-validator';

import { DatabaseConnectionError, RequestValidationError } from '../errors';

const router = express.Router();

router.post(
  '/api/users/signup',
  body('email').trim().isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body as { email: string; password: string };

    // TODO: Create a new user in the database
    console.log('Creating a user:', email);

    return res.send({});
  },
);

export { router as signUpRouter };
