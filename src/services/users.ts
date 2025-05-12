import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import axios from "./http";

export type GetUser = {
    userId: string;
};

export async function getUser({ userId }: GetUser) {
    const { data } = await axios.get("/users/" + userId);
    return data;
}

export const useGetUserSuspenseQueryOptions = ({ userId }: GetUser) => ({
    queryKey: ["user", userId],
    queryFn: () => getUser({ userId }),
});

export function useGetUserSuspenseQuery({ userId }: GetUser) {
    const options = useGetUserSuspenseQueryOptions({ userId });
    return useSuspenseQuery(options);
}
