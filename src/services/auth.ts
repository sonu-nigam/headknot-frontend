import axios from "./http";

type RegisterUserProps = {
    fullName: string;
    email: string;
    password: string;
};
export async function registerUser({
    fullName,
    email,
    password,
}: RegisterUserProps) {
    return axios.post("/auth/register", { fullName, email, password });
}

type LoginUserProps = {
    email: string;
    password: string;
};
export async function loginUser({ email, password }: LoginUserProps) {
    return axios.post("/auth/login", { email, password });
}
