import { useState, useEffect } from 'react'
import type { BetActivity } from '@/lib/supabase'
import { getUserActivities } from '@/lib/mock/activity'
import { toast } from 'sonner'

export const useUserBets = (userAddress?: string) => {
    const [userBets, setUserBets] = useState<BetActivity[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch user's bet activities
    const fetchUserBets = async () => {
        if (!userAddress) {
            setUserBets([])
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            const data = await getUserActivities(userAddress)
            setUserBets((data as any) || [])
        } catch (err: any) {
            console.error('Error fetching user bets:', err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Get user bets for specific market
    const getUserBetsForMarket = (marketId: string) => {
        return userBets.filter(bet => bet.market_id === marketId)
    }

    // Get user's total stats
    const getUserStats = () => {
        const totalBets = userBets.length
        const totalAmount = userBets.reduce((sum, bet) => sum + parseFloat(bet.amount), 0)
        const totalShares = userBets.reduce((sum, bet) => sum + parseFloat(bet.shares), 0)
        const uniqueMarkets = new Set(userBets.map(bet => bet.market_id)).size

        return {
            totalBets,
            totalAmount,
            totalShares,
            uniqueMarkets
        }
    }

    useEffect(() => {
        fetchUserBets()
    }, [userAddress])

    return {
        userBets,
        isLoading,
        error,
        refetch: fetchUserBets,
        getUserBetsForMarket,
        getUserStats
    }
}