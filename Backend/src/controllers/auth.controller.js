import bcrypt from 'bcryptjs';

import { prisma } from '../config/prisma.js';
import { sendResponse, sendError } from '../utils/response.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check whether the email is already registered
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return sendError(
        res,
        409,
        'An account with this email already exists'
      );
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in PostgreSQL through Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Never send password/hash to the frontend
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      githubUsername: user.githubUsername,
      role: user.role,
      verified: user.verified,
      createdAt: user.createdAt,
    };

    return sendResponse(res, 201, {
      message: 'User registered successfully',
      user: safeUser,
    });
  } catch (error) {
    console.error('Registration error:', error);

    return sendError(
      res,
      500,
      'Unable to register user'
    );
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Don't reveal whether the email exists
    if (!user) {
      return sendError(
        res,
        401,
        'Invalid email or password'
      );
    }

    // Compare entered password with stored bcrypt hash
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return sendError(
        res,
        401,
        'Invalid email or password'
      );
    }

    // Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Never send password/hash to frontend
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      githubUsername: user.githubUsername,
      role: user.role,
      verified: user.verified,
      createdAt: user.createdAt,
    };

    return sendResponse(res, 200, {
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error:', error);

    return sendError(
      res,
      500,
      'Unable to login'
    );
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    // Refresh-token implementation will be added later.
    return sendResponse(res, 501, {
      message: 'Refresh token functionality not implemented yet',
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const logout = async (req, res, next) => {
  try {
    // JWTs are currently stateless.
    return sendResponse(res, 200, {
      message: 'Logout successful',
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    return sendResponse(res, 501, {
      message: 'Forgot password functionality not implemented yet',
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    return sendResponse(res, 501, {
      message: 'Reset password functionality not implemented yet',
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};