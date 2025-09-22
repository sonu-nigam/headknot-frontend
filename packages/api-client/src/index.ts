import createClient from 'openapi-fetch';
import type { paths } from '../schema/schema'; // generated d.ts

export const api = createClient<paths>({
    // replace unknown with generated `paths`
    baseUrl: process.env.NEXT_PUBLIC_BFF_BASE ?? '/api',
});
