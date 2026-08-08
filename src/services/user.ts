import { instance } from "./api"

export interface NewUser {
    name: string
    login: string
    password: string
}

export interface User {
    id: string
    name: string
    username: string
}

export async function createUser(user: NewUser): Promise<User> {
    const response = await instance.post<User>('/users', user)
    return response.data
}