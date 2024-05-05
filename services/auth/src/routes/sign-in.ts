import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError, validateRequestMiddleware } from '@b.anik/common';

import { User } from '../models';
import { Password } from '../services';

const router = express.Router();

router.post(
  '/api/users/sign-in',
  body('email').trim().isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('Password must be provided'),
  validateRequestMiddleware,
  async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(user.password, password);

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
    );

    req.session = {
      jwt: userJwt,
    };

    return res.send({});
  },
);

export { router as signInRouter };
