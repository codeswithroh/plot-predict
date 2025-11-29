export interface MockComment {
  id: string;
  market_id: string;
  user_address: string;
  content: string;
  created_at: string;
  updated_at: string;
}

let comments: MockComment[] = [];

export async function listComments(marketId: string): Promise<MockComment[]> {
  return comments
    .filter(c => c.market_id === marketId)
    .sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
}

export async function addComment(marketId: string, content: string, userAddress: string): Promise<MockComment> {
  const now = new Date().toISOString();
  const c: MockComment = {
    id: Math.random().toString(36).slice(2),
    market_id: marketId,
    user_address: userAddress,
    content: content.trim(),
    created_at: now,
    updated_at: now,
  };
  comments = [...comments, c];
  return c;
}

export async function deleteComment(commentId: string, userAddress: string): Promise<boolean> {
  const before = comments.length;
  comments = comments.filter(c => !(c.id === commentId && c.user_address === userAddress));
  return comments.length < before;
}
