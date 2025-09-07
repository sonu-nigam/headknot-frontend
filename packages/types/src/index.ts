export type User = {
    id: string;
    email: string;
    orgId: string;
    role: "owner" | "admin" | "member";
};

export type Memory = {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
};
