import axios from "./http";

type RegisterUserProps = {
    name: string;
    email: string;
    password: string;
};
export async function registerUser({
    name,
    email,
    password,
}: RegisterUserProps) {
    return axios.post("/auth/register", { name, email, password });
}

type LoginUserProps = {
    email: string;
    password: string;
};
export async function loginUser({ email, password }: LoginUserProps) {
    return axios.post("/auth/login", { email, password });
}
