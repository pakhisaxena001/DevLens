import { prisma } from '../config/prisma.js'

export const createBookmark = async (
  userId,
  repositoryId,
  metadata = {}
) => {
  const repository = await prisma.repository.findUnique({
    where: {
      id: repositoryId,
    },
  })

  if (!repository) {
    throw new Error('Repository not found')
  }

  const bookmark = await prisma.bookmark.create({
    data: {
      userId,
      repositoryId,
      notes: metadata.notes || null,
    },
    include: {
      repository: true,
    },
  })

  return bookmark
}

export const getBookmarks = async (userId) => {
  return prisma.bookmark.findMany({
    where: { userId },
    include: {
      repository: {
        include: {
          analyses: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const deleteBookmark = async (
  userId,
  bookmarkId
) => {
  const bookmark = await prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId,
    },
  })

  if (!bookmark) {
    throw new Error('Bookmark not found')
  }

  await prisma.bookmark.delete({
    where: {
      id: bookmarkId,
    },
  })

  return {
    success: true,
  }
}

export const updateBookmark = async (
  userId,
  bookmarkId,
  updates
) => {
  const bookmark = await prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId,
    },
  })

  if (!bookmark) {
    throw new Error('Bookmark not found')
  }

  return prisma.bookmark.update({
    where: {
      id: bookmarkId,
    },
    data: {
      notes: updates.notes,
    },
    include: {
      repository: true,
    },
  })
}

export const getBookmarkById = async (
  userId,
  bookmarkId
) => {
  const bookmark = await prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId,
    },
    include: {
      repository: true,
    },
  })

  if (!bookmark) {
    throw new Error('Bookmark not found')
  }

  return bookmark
}

export const searchBookmarks = async (
  userId,
  query
) => {
  return prisma.bookmark.findMany({
    where: {
      userId,
      repository: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            owner: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    },
    include: {
      repository: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}