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

export interface LoggedUser {
    token: string
    user: User
}

export interface Credentials {
    login: string
    password: string
}

export async function createUser(user: NewUser): Promise<User> {
    const response = await instance.post<User>('/users', user)
    return response.data
}

export async function signIn(credentials: Credentials): Promise<LoggedUser> {
    const response = await instance.post<LoggedUser>('/auth/login', credentials)
    console.log('user data =>', response.data)
    return response.data
}