export async function getBetCount(marketId: string): Promise<number> {
  // Simple mock: deterministic pseudo-count based on marketId hash
  let hash = 0;
  for (let i = 0; i < marketId.length; i++) {
    hash = (hash * 31 + marketId.charCodeAt(i)) >>> 0;
  }
  const base = (hash % 42) + 3; // 3..44
  return base;
}
