import { instance } from "./api";
import type { Author } from "./posts";

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

export async function getComments(postId: string): Promise<Comment[]> {
  const response = await instance.get(`/posts/${postId}/comments`);
  return response.data.data;
}

export async function createComment(
  postId: string,
  text: string
): Promise<Comment> {
  const response = await instance.post(`/posts/${postId}/comments`, { text });
  return response.data;
}
    
