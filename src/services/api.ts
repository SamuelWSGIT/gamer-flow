import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface Author {
    id: string
    name: string
    username: string
    avatarUrl?: string
}

export interface Post {
    id: string
    imageUrl?: string
    durationSeconds: number
    type: "walking" | "running"
    distanceMeters: number
    calories: number
    heartRateBpm: number
    description: string
    likesCount: number
    likedByMe: boolean
    commentsCount: number
    createdAt: string
    author: Author
}

export async function fetchPosts(): Promise<Post[]> {
    const response = await instance.get<{
        data: Post[]
    }>('/posts')

    return response.data.data
}

