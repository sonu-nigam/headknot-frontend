import createClient from "openapi-fetch";
// import type { paths } from "./schema"; // generated d.ts

export const api = createClient<unknown>({ // replace unknown with generated `paths`
  baseUrl: process.env.NEXT_PUBLIC_BFF_BASE ?? "/bff"
});
