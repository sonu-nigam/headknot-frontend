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

export const getDocumentListSuspenseQueryOptions = () => ({
    queryKey: ["document"],
    queryFn: getDocumentList,
});

export function useGetDocumentListSuspenseQuery() {
    const options = getDocumentListSuspenseQueryOptions();
    return useSuspenseQuery(options);
}

export async function getDocumentTree() {
    const { data } = await axios.get("/document/tree");
    return data;
}

export const getDocumentTreeSuspenseQueryOptions = () => ({
    queryKey: ["document-tree"],
    queryFn: getDocumentTree,
});

export function useGetDocumentTreeSuspenseQuery() {
    const options = getDocumentTreeSuspenseQueryOptions();
    return useSuspenseQuery(options);
}

export type GetDocument = {
    id: string;
};

export async function getDocument({ id }: GetDocument) {
    const { data } = await axios.get("/document/" + id);
    return data;
}

export const getDocumentSuspenseQueryOptions = ({ id }: GetDocument) => ({
    queryKey: ["document", id],
    queryFn: () => getDocument({ id }),
});

export function useGetDocumentSuspenseQuery({ id }: GetDocument) {
    const options = getDocumentSuspenseQueryOptions({ id });
    return useSuspenseQuery(options);
}

type CreateDocumentProps = {
    parent?: null | string;
    title?: null | string;
};

export async function createDocument({
    parent = null,
    title,
}: CreateDocumentProps) {
    return axios.post("/document", { parent, title });
}

export function useAddDocumentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["document-tree"] });
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
