import type { QueryClient } from '@tanstack/react-query';

/**
 * Invalidate all queries matching a given HTTP method and path prefix.
 * Useful for broad invalidation after mutations (e.g. invalidate all GET /integrations/...).
 */
export function invalidateByPath(
    qc: QueryClient,
    method: string,
    pathPrefix: string,
) {
    return qc.invalidateQueries({
        predicate: (q) =>
            q.queryKey[0] === method &&
            typeof q.queryKey[1] === 'string' &&
            q.queryKey[1].startsWith(pathPrefix),
    });
}
