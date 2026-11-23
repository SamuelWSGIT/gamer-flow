import { Suspense } from "react";
import ErrorBoundary from "../../components/ErrorBoundary";
import SearchInput from "../../components/SearchInput";
import PostList from "../../components/PostList";

function Feed() {
  return (
    <>
      <SearchInput placeholder="Buscar jogo, gênero ou player..." />
      <ErrorBoundary fallback={<div>Falha ao sincronizar a biblioteca.</div>}>
        <Suspense fallback={<div>Sincronizando biblioteca...</div>}>
          <PostList />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default Feed;
