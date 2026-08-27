import { getSessionId } from './session';
import { getAuthUser } from './supabase/authServer';

export type AuthContext = { sessionId: string; userId: string | null };

export async function getAuthContext(): Promise<AuthContext> {
  const [sessionId, user] = await Promise.all([getSessionId(), getAuthUser()]);
  return { sessionId, userId: user?.id ?? null };
}

/** Filters a query by user_id when logged in, or by session_id when anonymous. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withOwner(query: any, ctx: AuthContext) {
  return ctx.userId ? query.eq('user_id', ctx.userId) : query.eq('session_id', ctx.sessionId);
}
