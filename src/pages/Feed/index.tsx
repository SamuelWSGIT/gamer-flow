import { Suspense } from "react";
import ErrorBoundary from "../../components/ErrorBoundary";
import SearchInput from "../../components/SearchInput";
import PostList from "../../components/PostList";

function Feed() {
  return (
    <>
      <SearchInput placeholder="O que você procura?" />
      <ErrorBoundary fallback={<div>Erro ao carregar os posts</div>}>
      <Suspense fallback={<div>Carregando posts...</div>} >
        <PostList />
      </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default Feed;