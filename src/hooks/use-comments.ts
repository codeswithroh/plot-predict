import { useState, useEffect } from 'react'
import type { Comment } from '@/lib/supabase'
import { listComments, addComment as mockAddComment, deleteComment as mockDeleteComment } from '@/lib/mock/comments'
import { toast } from 'sonner'

export const useComments = (marketId: string) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch comments
  const fetchComments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await listComments(marketId)
      setComments((data as any) || [])
    } catch (err: any) {
      console.error('Error fetching comments:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Add new comment
  const addComment = async (content: string, userAddress: string) => {
    try {
      const data = await mockAddComment(marketId, content, userAddress)
      setComments(prev => [...prev, data as any])
      toast.success('Comment added successfully!')
      return data as any
    } catch (err: any) {
      console.error('Error adding comment:', err)
      toast.error('Failed to add comment')
      throw err
    }
  }

  // Delete comment (only by author)
  const deleteComment = async (commentId: string, userAddress: string) => {
    try {
      const ok = await mockDeleteComment(commentId, userAddress)
      if (ok) {
        setComments(prev => prev.filter(c => c.id !== commentId))
      }
      toast.success('Comment deleted successfully!')
    } catch (err: any) {
      console.error('Error deleting comment:', err)
      toast.error('Failed to delete comment')
      throw err
    }
  }

  useEffect(() => {
    if (marketId) {
      fetchComments()
    }
  }, [marketId])

  return {
    comments,
    isLoading,
    error,
    refetch: fetchComments,
    addComment,
    deleteComment
  }
}