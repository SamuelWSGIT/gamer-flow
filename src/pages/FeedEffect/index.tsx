import { useEffect, useState } from 'react'
import PostCard from '../../components/PostCard'
import PostsGrid from '../../components/PostsGrid'
import SearchInput from '../../components/SearchInput'
import { fetchPosts, type Post } from '../../services/api'

function Feed() {
  
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    async function loadPosts() {  
      const posts = await fetchPosts()
      setPosts(posts)
    }
    loadPosts()
  }, [])

  return (
    <>
      <SearchInput placeholder="O que você procura?" />
      <PostsGrid>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            time={String(post.durationSeconds)}
            activity={post.type}
            distance={String(post.distanceMeters / 1000)}
            calories={String(post.calories)}
            heartRate={String(post.heartRateBpm)}
            author={post.author.name}
            avatarSrc={post.author.avatar || "https://i.pravatar.cc/96?img=68"}
            likes={post.likesCount}
            comments={post.commentsCount}
            description={post.description}
          />
        ))}
      </PostsGrid>
    </>
  )
}

export default Feed
