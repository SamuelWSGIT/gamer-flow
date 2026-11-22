import { instance } from "./api";

export interface NewUser {
    name: string;
    login: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    bio?: string;
    workoutsCount?: number;
}

export interface LoggedUser{
    token: string;
    user: User;
}

export interface Credentials {
    login: string;
    password: string;
}

export interface UpdateUser {
    name: string;
    username: string;
    bio: string;
    avatar?: File;
}

export async function createUser(user: NewUser): Promise<User> {
    const response = await instance.post<User>("/users", user);
    return response.data;
}

export async function signIn(credentials: Credentials): Promise<LoggedUser> {
    const response = await instance.post<LoggedUser>("/auth/login", credentials);

    if (!response.data.token) {
        throw new Error("A API não retornou um token de autenticação.");
    }

    sessionStorage.setItem("token", response.data.token);

    return response.data;
}

export async function fetchLoggedUser(): Promise<User> {
    const token = sessionStorage.getItem("token");

    if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
    }

    const response = await instance.get<User>("/users/me");
    return response.data;
}

export async function updateUser(user: UpdateUser): Promise<User> {
    const body = new FormData();

    body.append("name", user.name);
    body.append("username", user.username);
    body.append("bio", user.bio);

    if (user.avatar) {
        body.append("avatar", user.avatar);
    }

    const response = await instance.put<User>("/users/me", body);
    return response.data;
}
