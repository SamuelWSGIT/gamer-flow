import { use } from 'react'
import PostCard from '../../components/PostCard'
import PostsGrid from '../../components/PostsGrid'
import { type Post } from '../../services/posts'
import { formatDuration } from '../../util'

type PostListProps = {
  postPromise: Promise<Post[]>
}

function PostList({ postPromise }: PostListProps) {

  const posts: Post[] = use(postPromise)
  
  return (
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
            avatarSrc={post.author.avatarUrl}
            likes={post.likesCount}
            comments={post.commentsCount}
            description={post.description}
            imageUrl={post.imageUrl}
          />
        ))}
      </PostsGrid>
  )
}

export default PostList
