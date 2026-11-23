import { useEffect, useRef, useState } from "react";
import PostCard from "../../components/PostCard";
import PostsGrid from "../../components/PostsGrid";
import ProfileHeader from "../../components/ProfileHeader";
import Tab from "../../components/Tab";
import Tabs from "../../components/Tabs";
import Text from "../../components/Text";
import {
  fetchPosts,
  fetchPostsLikedByLoggedUser,
  type Post,
} from "../../services/posts";
import { fetchLoggedUser } from "../../services/user";
import { formatDuration, getApiErrorMessage } from "../../util";

type ProfileTab = "posts" | "likes";

function Profile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [loggedUser, setLoggedUser] = useState<Awaited<ReturnType<typeof fetchLoggedUser>> | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[] | null>(null);
  const [likesLoading, setLikesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userRequest = useRef<ReturnType<typeof fetchLoggedUser> | null>(null);
  const postsRequest = useRef<ReturnType<typeof fetchPosts> | null>(null);
  const likedPostsRequest = useRef<ReturnType<typeof fetchPostsLikedByLoggedUser> | null>(null);

  useEffect(() => {
    let isMounted = true;
    const userPromise = userRequest.current ??= fetchLoggedUser();
    const postsPromise = postsRequest.current ??= fetchPosts();

    Promise.all([userPromise, postsPromise])
      .then(([user, allPosts]) => {
        if (isMounted) {
          setLoggedUser(user);
          setPosts(allPosts.filter((post) => post.author.id === user.id));
        }
      })
      .catch((requestError: unknown) => {
        if (isMounted) {
          setError(`Não foi possível carregar o perfil: ${getApiErrorMessage(requestError)}`);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleLikesTab() {
    setActiveTab("likes");

    if (likedPosts !== null || likedPostsRequest.current) {
      return;
    }

    setLikesLoading(true);
    const request = likedPostsRequest.current ??= fetchPostsLikedByLoggedUser();

    request
      .then((fetchedPosts) => {
        setLikedPosts(fetchedPosts);
      })
      .catch((requestError: unknown) => {
        setError(`Não foi possível carregar as curtidas: ${getApiErrorMessage(requestError)}`);
        likedPostsRequest.current = null;
      })
      .finally(() => {
        setLikesLoading(false);
      });
  }

  function handlePostLikeChange(post: Post, liked: boolean) {
    setLikedPosts((previousPosts) => {
      if (previousPosts === null) {
        return previousPosts;
      }

      if (!liked) {
        return previousPosts.filter((previousPost) => previousPost.id !== post.id);
      }

      if (previousPosts.some((previousPost) => previousPost.id === post.id)) {
        return previousPosts;
      }

      return [
        ...previousPosts,
        { ...post, likedByMe: true, likesCount: post.likesCount + 1 },
      ];
    });
  }

  if (error) {
    return <Text role="alert">{error}</Text>;
  }

  if (!loggedUser) {
    return <Text>Carregando perfil...</Text>;
  }

  const visiblePosts = activeTab === "posts" ? posts : likedPosts || [];

  return (
    <>
      <ProfileHeader
        avatarSrc={loggedUser.avatarUrl}
        username={loggedUser.username}
        name={loggedUser.name}
        bio={loggedUser.bio || ""}
        workouts={loggedUser.workoutsCount || 0}
      />
      <Tabs>
        <Tab active={activeTab === "posts"} onClick={() => setActiveTab("posts")}>
          Posts
        </Tab>
        <Tab active={activeTab === "likes"} onClick={handleLikesTab}>
          Curtidas
        </Tab>
      </Tabs>
      {activeTab === "likes" && likesLoading ? (
        <Text>Carregando curtidas...</Text>
      ) : (
        <PostsGrid>
          {visiblePosts.length === 0 && (
            <Text>
              {activeTab === "posts"
                ? "Você ainda não publicou nenhum post."
                : "Você ainda não curtiu nenhum post."}
            </Text>
          )}
          {visiblePosts.map((post) => (
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
              avatarSrc={post.author.avatarUrl || loggedUser.avatarUrl}
              likes={post.likesCount}
              liked={post.likedByMe}
              comments={post.commentsCount}
              description={post.description}
              id={post.id}
              onLikeChange={(liked) => handlePostLikeChange(post, liked)}
            />
          ))}
        </PostsGrid>
      )}
    </>
  );
}

export default Profile;
