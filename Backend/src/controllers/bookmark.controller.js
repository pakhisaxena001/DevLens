import {
  createBookmark as createBookmarkService,
  getBookmarks,
  deleteBookmark as deleteBookmarkService,
  getBookmarkById as getBookmarkByIdService,
} from '../services/bookmark.service.js'

import {
  sendResponse,
  sendError,
} from '../utils/response.js'

export const getUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id
    const bookmarks = await getBookmarks(userId)

    const formattedBookmarks = bookmarks.map((bookmark) => {
      const repository = bookmark.repository
      const latestAnalysis = repository?.analyses?.[0]

      const owner = repository?.owner || ''
      const repositoryName = repository?.name || ''

      const cleanName =
        repositoryName.startsWith(`${owner}/`)
          ? repositoryName.slice(owner.length + 1)
          : repositoryName

      return {
        id: bookmark.id,
        repositoryId: bookmark.repositoryId,

        name: cleanName,
        owner,

        url: repository?.url || '',
        description: repository?.description || '',

        language: repository?.language || 'Unknown',

        healthScore:
          typeof latestAnalysis?.healthScore === 'number'
            ? latestAnalysis.healthScore
            : 0,

        stars: repository?.stars || 0,
        forks: repository?.forks || 0,
        watchers: repository?.watchers || 0,
        openIssues: repository?.openIssues || 0,

        notes: bookmark.notes,
        date: bookmark.createdAt,
        createdAt: bookmark.createdAt,
      }
    })

    sendResponse(res, 200, {
      bookmarks: formattedBookmarks,
    })
  } catch (error) {
    console.error('Failed to get bookmarks:', error)
    sendError(res, 500, error.message)
  }
}

export const createBookmark = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.id

    const repositoryId =
      req.body.repositoryId ||
      req.body.id

    if (!repositoryId) {
      return sendError(
        res,
        400,
        'Repository ID is required'
      )
    }

    const bookmark =
      await createBookmarkService(
        userId,
        repositoryId,
        {
          notes: req.body.notes,
        }
      )

    sendResponse(res, 201, {
      message:
        'Bookmark created successfully',
      bookmark: {
        id: bookmark.id,
        repositoryId:
          bookmark.repositoryId,
        name: `${bookmark.repository.owner}/${bookmark.repository.name}`,
        url: bookmark.repository.url,
        description:
          bookmark.repository.description,
        language:
          bookmark.repository.language,
        notes: bookmark.notes,
        date: bookmark.createdAt,
        createdAt: bookmark.createdAt,
      },
    })
  } catch (error) {
    console.error(
      'Failed to create bookmark:',
      error
    )

    if (error.code === 'P2002') {
      return sendError(
        res,
        409,
        'Repository is already bookmarked'
      )
    }

    sendError(res, 500, error.message)
  }
}

export const deleteBookmark = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.id
    const bookmarkId = req.params.id

    await deleteBookmarkService(
      userId,
      bookmarkId
    )

    sendResponse(res, 200, {
      message:
        'Bookmark deleted successfully',
    })
  } catch (error) {
    console.error(
      'Failed to delete bookmark:',
      error
    )

    if (
      error.message ===
      'Bookmark not found'
    ) {
      return sendError(
        res,
        404,
        error.message
      )
    }

    sendError(res, 500, error.message)
  }
}

export const getBookmarkById = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.id
    const bookmarkId = req.params.id

    const bookmark =
      await getBookmarkByIdService(
        userId,
        bookmarkId
      )

    sendResponse(res, 200, {
      bookmark: {
        id: bookmark.id,
        repositoryId:
          bookmark.repositoryId,
        name: `${bookmark.repository.owner}/${bookmark.repository.name}`,
        url: bookmark.repository.url,
        description:
          bookmark.repository.description,
        language:
          bookmark.repository.language,
        notes: bookmark.notes,
        date: bookmark.createdAt,
        createdAt: bookmark.createdAt,
      },
    })
  } catch (error) {
    console.error(
      'Failed to get bookmark:',
      error
    )

    if (
      error.message ===
      'Bookmark not found'
    ) {
      return sendError(
        res,
        404,
        error.message
      )
    }

    sendError(res, 500, error.message)
  }
}