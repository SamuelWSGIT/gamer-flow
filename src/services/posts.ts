import { instance } from "./api"

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

export interface NewPost {
    durationSeconds: number
    type : "walking" | "running"
    distanceMeters: number
    calories: number
    heartRateBpm: number
    description: string
    image?: File
}

export async function fetchPosts(): Promise<Post[]> {
    const response = await instance.get<{
        data: Post[]
    }>('/posts')

    return response.data.data
}

export async function createPost(post: NewPost): Promise<Post> {

    const body = new FormData()

    body.append('durationSeconds', post.durationSeconds.toString())
    body.append('type', post.type)
    body.append('distanceMeters', post.distanceMeters.toString())
    body.append('calories', post.calories.toString())
    body.append('heartRateBpm', post.heartRateBpm.toString())
    body.append('description', post.description)

    if (post.image) {
        body.append('image', post.image)
    }

    const response = await instance.post<Post>('/posts', body)

    return response.data
}