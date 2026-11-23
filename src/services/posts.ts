import {
  STORAGE_KEYS,
  createId,
  fileToDataUrl,
  readStorage,
  writeStorage,
} from "./storage";
import { getCurrentUser, incrementWorkoutsCount } from "./user";

export interface Author {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
}

export type GameMode = "solo" | "co-op";

export interface Post {
  id: string;
  title: string;
  imageUrl?: string | null;
  durationSeconds: number;
  type: GameMode;
  platform: string;
  completionPercent: number;
  achievements: number;
  rating: number;
  description: string;
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
  createdAt: string;
  author: Author;
}

export interface NewPost {
  title: string;
  imageUrl?: string;
  image?: File;
  durationSeconds: number;
  type: GameMode;
  platform: string;
  completionPercent: number;
  achievements: number;
  rating: number;
  description: string;
}

type StoredPost = Omit<Post, "likedByMe"> & {
  likedBy: string[];
};

const profileOverrides: Record<string, Pick<Author, "name" | "username" | "avatarUrl">> = {
  "user-demo": {
    name: "Francyptc",
    username: "Francyptc",
    avatarUrl: "/images/avatar-francyptc.png",
  },
  "user-rafa": {
    name: "Saalrin",
    username: "Saalrin",
    avatarUrl: "/images/avatar-saalrin.png",
  },
};

const seedPosts: StoredPost[] = [
  {
    id: "game-elden-ring",
    title: "Elden Ring",
    imageUrl: "/images/cyberpunk-banner-login.png",
    durationSeconds: 58 * 3600 + 20 * 60,
    type: "solo",
    platform: "PC",
    completionPercent: 100,
    achievements: 42,
    rating: 9.5,
    description: "A jornada pelas Terras Intermédias levou 58 horas. Ainda faltam alguns chefes opcionais no NG+.",
    likesCount: 184,
    likedBy: [],
    commentsCount: 12,
    createdAt: "2026-11-20T21:10:00.000Z",
    author: {
      id: "user-demo",
      name: "Francyptc",
      username: "Francyptc",
      avatarUrl: "/images/avatar-francyptc.png",
    },
  },
  {
    id: "game-hades",
    title: "Hades",
    imageUrl: "/images/cyberpunk-banner-register.png",
    durationSeconds: 24 * 3600 + 40 * 60,
    type: "solo",
    platform: "Nintendo Switch",
    completionPercent: 100,
    achievements: 49,
    rating: 9.2,
    description: "A primeira fuga aconteceu cedo, mas o pós-jogo roubou mais algumas noites. A trilha sonora é absurda.",
    likesCount: 126,
    likedBy: [],
    commentsCount: 8,
    createdAt: "2026-11-19T18:35:00.000Z",
    author: {
      id: "user-rafa",
      name: "Saalrin",
      username: "Saalrin",
      avatarUrl: "/images/avatar-saalrin.png",
    },
  },
  {
    id: "game-cyberpunk-2077",
    title: "Cyberpunk 2077",
    imageUrl: "/images/pattern.png",
    durationSeconds: 63 * 3600 + 15 * 60,
    type: "solo",
    platform: "PS5",
    completionPercent: 96,
    achievements: 38,
    rating: 9.0,
    description: "Campanha principal e quase todos os contratos concluídos. A cidade ainda tem muito segredo escondido.",
    likesCount: 209,
    likedBy: [],
    commentsCount: 21,
    createdAt: "2026-11-17T23:45:00.000Z",
    author: {
      id: "user-demo",
      name: "Francyptc",
      username: "Francyptc",
      avatarUrl: "/images/avatar-francyptc.png",
    },
  },
  {
    id: "game-it-takes-two",
    title: "It Takes Two",
    imageUrl: "/images/logo.png",
    durationSeconds: 13 * 3600 + 25 * 60,
    type: "co-op",
    platform: "Xbox Series X",
    completionPercent: 100,
    achievements: 25,
    rating: 9.7,
    description: "Zerado em dupla no fim de semana. O capítulo do relógio quase acabou com a nossa parceria.",
    likesCount: 97,
    likedBy: [],
    commentsCount: 6,
    createdAt: "2026-11-15T16:20:00.000Z",
    author: {
      id: "user-rafa",
      name: "Saalrin",
      username: "Saalrin",
      avatarUrl: "/images/avatar-saalrin.png",
    },
  },
];

function getStoredPosts(): StoredPost[] {
  const posts = readStorage<StoredPost[] | null>(STORAGE_KEYS.posts, null);
  const eligibleSeedPosts = seedPosts.filter((post) => profileOverrides[post.author.id]);

  if (posts) {
    const migratedPosts = posts.flatMap((post) => {
      const matchingProfile = Object.entries(profileOverrides).find(([profileId, profile]) =>
        profileId === post.author.id
        || profile.name === post.author.name
        || profile.username === post.author.username,
      );

      if (!matchingProfile) {
        return [];
      }

      const [profileId, profile] = matchingProfile;
      return [{
        ...post,
        author: { ...post.author, id: profileId, ...profile },
      }];
    });

    const storedPostIds = new Set(migratedPosts.map((post) => post.id));
    const completePosts = [
      ...migratedPosts,
      ...eligibleSeedPosts.filter((post) => !storedPostIds.has(post.id)),
    ];

    if (JSON.stringify(completePosts) !== JSON.stringify(posts)) {
      writeStorage(STORAGE_KEYS.posts, completePosts);
    }

    return completePosts;
  }

  writeStorage(STORAGE_KEYS.posts, eligibleSeedPosts);
  return eligibleSeedPosts;
}

function savePosts(posts: StoredPost[]): void {
  writeStorage(STORAGE_KEYS.posts, posts);
}

function toPost(post: StoredPost, userId?: string): Post {
  return {
    ...post,
    likedByMe: userId ? post.likedBy.includes(userId) : false,
  };
}

export async function fetchPosts(): Promise<Post[]> {
  const user = getCurrentUser();
  return getStoredPosts().map((post) => toPost(post, user?.id));
}

export async function fetchPostsLikedByLoggedUser(): Promise<Post[]> {
  const user = getCurrentUser();

  if (!user) {
    return [];
  }

  return getStoredPosts()
    .filter((post) => post.likedBy.includes(user.id))
    .map((post) => toPost(post, user.id));
}

export async function createPost(post: NewPost): Promise<Post> {
  const user = getCurrentUser();

  if (!user) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  const imageUrl = post.image
    ? await fileToDataUrl(post.image)
    : post.imageUrl;
  const newPost: StoredPost = {
    id: createId("game"),
    title: post.title,
    imageUrl,
    durationSeconds: post.durationSeconds,
    type: post.type,
    platform: post.platform,
    completionPercent: post.completionPercent,
    achievements: post.achievements,
    rating: post.rating,
    description: post.description,
    likesCount: 0,
    likedBy: [],
    commentsCount: 0,
    createdAt: new Date().toISOString(),
    author: {
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
    },
  };

  savePosts([newPost, ...getStoredPosts()]);
  incrementWorkoutsCount(user.id);
  return toPost(newPost, user.id);
}

export async function likePost(postId: string): Promise<void> {
  const user = getCurrentUser();

  if (!user) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  const posts = getStoredPosts();
  savePosts(posts.map((post) => {
    if (post.id !== postId || post.likedBy.includes(user.id)) {
      return post;
    }

    return {
      ...post,
      likedBy: [...post.likedBy, user.id],
      likesCount: post.likesCount + 1,
    };
  }));
}

export async function unLikePost(postId: string): Promise<void> {
  const user = getCurrentUser();

  if (!user) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  const posts = getStoredPosts();
  savePosts(posts.map((post) => {
    if (post.id !== postId || !post.likedBy.includes(user.id)) {
      return post;
    }

    return {
      ...post,
      likedBy: post.likedBy.filter((userId) => userId !== user.id),
      likesCount: Math.max(0, post.likesCount - 1),
    };
  }));
}
