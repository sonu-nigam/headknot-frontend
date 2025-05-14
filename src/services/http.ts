import { auth } from "@/auth";
import { getSession, signOut } from "next-auth/react";
import axios, { AxiosError } from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
    async function (config) {
        let session = null;
        if (typeof window === "undefined") {
            session = await auth();
        } else {
            session = await getSession();
        }
        if (session) {
            config.headers["Authorization"] =
                `Bearer ${(session.user as any).accessToken}`;
        }
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
instance.interceptors.response.use(
    async function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    async function (error: AxiosError) {
        if (error.status === 401) {
            // Trigger sign out
            await signOut({ callbackUrl: "/auth/signin" });
        }
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    },
);

export default instance;
