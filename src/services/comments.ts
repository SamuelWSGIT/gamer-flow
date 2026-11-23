import {
  STORAGE_KEYS,
  createId,
  readStorage,
  writeStorage,
} from "./storage";
import { getCurrentUser, type User } from "./user";
import type { Author } from "./posts";

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

const seedComments: Comment[] = [
  {
    id: "comment-elden-1",
    postId: "game-elden-ring",
    author: {
      id: "user-rafa",
      name: "Saalrin",
      username: "Saalrin",
      avatarUrl: "/images/avatar-saalrin.png",
    },
    text: "58 horas é uma ótima rota. Qual final você escolheu?",
    createdAt: "2026-11-21T10:00:00.000Z",
  },
  {
    id: "comment-hades-1",
    postId: "game-hades",
    author: {
      id: "user-lina",
      name: "Lina Kuro",
      username: "lina_kuro",
      avatarUrl: "",
    },
    text: "A luta contra Hades continua sendo uma das melhores do gênero.",
    createdAt: "2026-11-20T08:20:00.000Z",
  },
];

function getStoredComments(): Comment[] {
  const comments = readStorage<Comment[] | null>(STORAGE_KEYS.comments, null);

  if (comments) {
    const migratedComments = comments.map((comment) => {
      if (comment.author.id === "user-demo") {
        return {
          ...comment,
          author: {
            ...comment.author,
            name: "Francyptc",
            username: "Francyptc",
            avatarUrl: "/images/avatar-francyptc.png",
          },
        };
      }

      if (comment.author.id === "user-rafa") {
        return {
          ...comment,
          author: {
            ...comment.author,
            name: "Saalrin",
            username: "Saalrin",
            avatarUrl: "/images/avatar-saalrin.png",
          },
        };
      }

      return comment;
    });

    if (JSON.stringify(migratedComments) !== JSON.stringify(comments)) {
      writeStorage(STORAGE_KEYS.comments, migratedComments);
    }

    return migratedComments;
  }

  writeStorage(STORAGE_KEYS.comments, seedComments);
  return seedComments;
}

function saveComments(comments: Comment[]): void {
  writeStorage(STORAGE_KEYS.comments, comments);
}

export async function getComments(postId: string): Promise<Comment[]> {
  return getStoredComments().filter((comment) => comment.postId === postId);
}

export async function createComment(
  postId: string,
  text: string,
): Promise<Comment> {
  const user = getCurrentUser();

  if (!user) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  const comment: Comment = {
    id: createId("comment"),
    postId,
    author: userToAuthor(user),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  saveComments([...getStoredComments(), comment]);
  const posts = readStorage<Array<{ id: string; commentsCount: number }>>(
    STORAGE_KEYS.posts,
    [],
  );
  writeStorage(
    STORAGE_KEYS.posts,
    posts.map((post) => post.id === postId
      ? { ...post, commentsCount: post.commentsCount + 1 }
      : post),
  );
  return comment;
}

function userToAuthor(user: User): Author {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatarUrl: user.avatarUrl,
  };
}
