import { useEffect, useState } from 'react'
import PostCard from '../../components/PostCard'
import PostsGrid from '../../components/PostsGrid'
import SearchInput from '../../components/SearchInput'
import type { Post } from '../../services/api'

function Feed() {
  
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
   fetch('http://localhost:3000/posts')
      .then((response) => response.json())
      .then((paginatedPosts) => {
        setPosts(paginatedPosts.data)
      })
  }, [])

  return (
    <>
      <SearchInput placeholder="O que você procura?" />
      <PostsGrid>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            time={String(post.durationSeconds)}
            activity="Caminhada intensa"
            distance="2 Km"
            calories="300 Kcal"
            heartRate="120 BPM"
            author="Laura Mota Linhares"
            avatarSrc="https://i.pravatar.cc/96?img=68"
            likes={5}
            comments={2}
            description="Hoje dei meu mínimo e esse foi meu máximo! kkkk"
          />
        ))}
      </PostsGrid>
    </>
  )
}

export default Feed
