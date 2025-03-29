import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import axios from "./http";

export async function getDocumentList() {
    const { data } = await axios.get("/document");
    return data;
}

export const useGetDocumentListSuspenseQueryOptions = () => ({
    queryKey: ["document"],
    queryFn: getDocumentList,
});

export function useGetDocumentListSuspenseQuery() {
    const options = useGetDocumentListSuspenseQueryOptions();
    return useSuspenseQuery(options);
}

export type GetDocument = {
    id: string;
};

export async function getDocument({ id }: GetDocument) {
    const { data } = await axios.get("/document/" + id);
    return data;
}

export const useGetDocumentSuspenseQueryOptions = ({ id }: GetDocument) => ({
    queryKey: ["document", id],
    queryFn: () => getDocument({ id }),
});

export function useGetDocumentSuspenseQuery({ id }: GetDocument) {
    const options = useGetDocumentSuspenseQueryOptions({ id });
    return useSuspenseQuery(options);
}

type CreateDocumentProps = {
    parent?: null | string;
};

export async function createDocument({ parent = null }: CreateDocumentProps) {
    return axios.post("/document", { parent });
}

export function useAddDocumentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["document"] });
        },
    });
}

type UpdateDocumentProps = {
    id: string;
    title: string | null;
    description: string | null;
};

export async function updateDocument({
    id,
    title,
    description,
}: UpdateDocumentProps) {
    return axios.patch("/document/" + id, { title, description });
}

export function useUpdateDocumentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["document"] });
        },
    });
}

type DeleteDocumentProps = {
    id: string;
};

export async function deleteDocument({ id }: DeleteDocumentProps) {
    return axios.delete("/document/" + id);
}

export function useDeleteDocumentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["document"] });
        },
    });
}
