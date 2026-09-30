import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as bookmarkService from '@/services/bookmarkService'

export const useBookmarkStore = defineStore('bookmark', () => {
  const bookmarks = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchBookmarks = async () => {
    isLoading.value = true
    try {
      bookmarks.value = (await bookmarkService.getBookmarks()).bookmarks || []
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const addBookmark = async (repository) => {
    try {
      const data = await bookmarkService.createBookmark(repository)
      const bookmark = data.bookmark || data
      if (bookmark.id) bookmarks.value.push(bookmark)
      return bookmark
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const removeBookmark = async (id) => {
    await bookmarkService.deleteBookmark(id)
    bookmarks.value = bookmarks.value.filter((bookmark) => bookmark.id !== id)
  }
  return { bookmarks, isLoading, error, fetchBookmarks, addBookmark, removeBookmark }
})
