export interface Author {
    id: string
    name: string
    username: string
    avatar?: string
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
}

