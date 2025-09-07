import { z } from "zod";

export const ClientEnv = z.object({
    NEXT_PUBLIC_BFF_BASE: z.string().default("/bff"),
});
export const ServerEnv = z.object({
    SPRING_URL: z.string().url(),
});

export function loadClientEnv() {
    return ClientEnv.parse(process.env);
}
export function loadServerEnv() {
    return ServerEnv.parse(process.env);
}
