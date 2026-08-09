import { Suspense, useState } from 'react'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import SearchInput from '../../components/SearchInput'
import PostList from '../../components/PostList'
import { fetchPosts } from '../../services/posts'

function Feed() {
  
  const [postPromise] = useState(() => fetchPosts())

  return (
    <>
      <SearchInput placeholder="O que você procura?" />
      <ErrorBoundary fallback={<div>Ocorreu um erro ao carregar os posts.</div>}>
        <Suspense fallback={<div>Carregando posts...</div>}>
          <PostList postPromise={postPromise} />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default Feed
