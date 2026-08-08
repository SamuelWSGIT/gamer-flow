import { use } from 'react'
import PostCard from '../../components/PostCard'
import PostsGrid from '../../components/PostsGrid'
import SearchInput from '../../components/SearchInput'
import { fetchPosts, type Post } from '../../services/api'
import { formatDuration } from '../../util'

const postPromise = fetchPosts()

function Feed() {
  const posts: Post[] = use(postPromise)
  return (
    <>
      <SearchInput placeholder="O que você procura?" />
      <PostsGrid>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            time={formatDuration(post.durationSeconds)}
            activity={post.type}
            distance={String(post.distanceMeters / 1000)}
            calories={String(post.calories)}
            heartRate={String(post.heartRateBpm)}
            author={post.author.name}
            avatarSrc={post.author.avatarUrl || "https://i.pravatar.cc/96?img=68"}
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
