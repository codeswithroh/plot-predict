import { useState, useEffect } from 'react'
import type { BetActivity } from '@/lib/supabase'
import { getActivities, addActivity as mockAddActivity } from '@/lib/mock/activity'
import { toast } from 'sonner'

export const useBetActivity = (marketId?: string) => {
  const [activities, setActivities] = useState<BetActivity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch bet activities
  const fetchActivities = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getActivities(marketId)
      setActivities((data as any) || [])
    } catch (err: any) {
      console.error('Error fetching bet activities:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Add new bet activity
  const addBetActivity = async (activity: Omit<BetActivity, 'id' | 'created_at'>) => {
    try {
      const data = await mockAddActivity(activity as any)
      setActivities(prev => [data as any, ...prev])
      return data as any
    } catch (err: any) {
      console.error('Error adding bet activity:', err)
      toast.error('Failed to record bet activity')
      throw err
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [marketId])

  return {
    activities,
    isLoading,
    error,
    refetch: fetchActivities,
    addBetActivity
  }
}