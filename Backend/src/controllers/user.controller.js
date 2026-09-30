import { prisma } from '../config/prisma.js';
import { sendResponse, sendError } from '../utils/response.js';

const userSelect = {
  id: true,
  name: true,
  email: true,
  bio: true,
  avatar: true,
  githubUsername: true,
  role: true,
  verified: true,
  createdAt: true,
  updatedAt: true,
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: userSelect,
    });

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendResponse(res, 200, {
      user,
    });
  } catch (error) {
    console.error('Get profile error:', error);

    return sendError(res, 500, 'Unable to fetch profile');
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      select: userSelect,
    });

    return sendResponse(res, 200, {
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update profile error:', error);

    return sendError(res, 500, 'Unable to update profile');
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: userSelect,
    });

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendResponse(res, 200, {
      user,
    });
  } catch (error) {
    console.error('Get user error:', error);

    return sendError(res, 500, 'Unable to fetch user');
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.user.id,
      },
    });

    return sendResponse(res, 200, {
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);

    return sendError(res, 500, 'Unable to delete account');
  }
};