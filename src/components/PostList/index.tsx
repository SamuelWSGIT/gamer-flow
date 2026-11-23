import { useEffect, useRef, useState } from "react";
import PostCard from "../../components/PostCard";
import PostsGrid from "../../components/PostsGrid";
import { fetchPosts, type Post } from "../../services/posts";
import { formatDuration } from "../../util";

function PostList() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  const postsRequest = useRef<ReturnType<typeof fetchPosts> | null>(null);

  useEffect(() => {
    let isMounted = true;
    const request = (postsRequest.current ??= fetchPosts());

    request
      .then((fetchedPosts) => {
        if (isMounted) {
          setPosts(fetchedPosts);
        }
      })
      .catch((requestError: unknown) => {
        if (isMounted) {
          setError(requestError);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    throw error;
  }

  if (!posts) {
    return <div>Sincronizando biblioteca...</div>;
  }

  return (
    <PostsGrid>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          title={post.title}
          imageUrl={post.imageUrl}
          time={formatDuration(post.durationSeconds)}
          activity={post.type}
          platform={post.platform}
          completionPercent={post.completionPercent}
          achievements={post.achievements}
          rating={post.rating}
          author={post.author.name}
          avatarSrc={post.author.avatarUrl}
          comments={post.commentsCount}
          description={post.description}
          likes={post.likesCount} 
          liked={post.likedByMe}
          id={post.id}
        />
      ))}
    </PostsGrid>
  );
}

export default PostList;
