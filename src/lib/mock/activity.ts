export interface MockBetActivity {
  id: string;
  market_id: string;
  user_address: string;
  option: number;
  amount: string;
  shares: string;
  tx_hash?: string;
  created_at: string;
  market_title?: string;
  option_a?: string;
  option_b?: string;
}

let activities: MockBetActivity[] = [];

export async function getActivities(marketId?: string): Promise<MockBetActivity[]> {
  const list = marketId ? activities.filter(a => a.market_id === marketId) : activities;
  return list.slice().sort((a, b) => (a.created_at < b.created_at ? 1 : -1)).slice(0, 50);
}

export async function addActivity(activity: Omit<MockBetActivity, 'id' | 'created_at'>): Promise<MockBetActivity> {
  const item: MockBetActivity = {
    id: Math.random().toString(36).slice(2),
    created_at: new Date().toISOString(),
    ...activity,
  };
  activities = [item, ...activities];
  return item;
}

export async function getUserActivities(userAddress?: string): Promise<MockBetActivity[]> {
  if (!userAddress) return [];
  return activities.filter(a => a.user_address === userAddress).sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}
