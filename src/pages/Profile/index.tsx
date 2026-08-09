import { Suspense, use, useState, useTransition } from 'react'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import PostList from '../../components/PostList'
import ProfileHeader from '../../components/ProfileHeader'
import Tab from '../../components/Tab'
import Tabs from '../../components/Tabs'
import {
  fetchPostsCreatedByTheLoggedUser,
  fetchPostsLikedByTheLoggedUser,
  type Post,
} from '../../services/posts'
import { fetchLoggedUser, type User } from '../../services/user'

const tabFetchers = {
  posts: fetchPostsCreatedByTheLoggedUser,
  likes: fetchPostsLikedByTheLoggedUser,
}

type TabId = keyof typeof tabFetchers

type ProfileInfoProps = {
  userPromise: Promise<User>
}

function ProfileInfo({ userPromise }: ProfileInfoProps) {

  const loggedUser: User = use(userPromise)

  return (
    <ProfileHeader
      avatarSrc={loggedUser.avatarUrl}
      username={loggedUser.username}
      name={loggedUser.name}
      bio={loggedUser.bio || ''}
      workouts={loggedUser.workoutsCount || 0}
    />
  )
}

function Profile() {

  const [activeTab, setActiveTab] = useState<TabId>('posts')

  const [isPending, startTransition] = useTransition()

  const [userPromise] = useState(() => fetchLoggedUser())

  // Guardamos uma promise por tab: voltar para uma tab já carregada é
  // instantâneo, sem refetch e sem passar pelo fallback de novo.
  const [postPromises, setPostPromises] = useState<Partial<Record<TabId, Promise<Post[]>>>>(
    () => ({ posts: tabFetchers.posts() })
  )

  function handleTabChange(tab: TabId) {
    if (tab === activeTab) return

    const postPromise = postPromises[tab] ?? tabFetchers[tab]()

    // startTransition mantém a lista atual na tela enquanto a nova carrega,
    // em vez de trocar tudo pelo "Carregando seus posts...".
    startTransition(() => {
      setPostPromises((promises) => ({ ...promises, [tab]: postPromise }))
      setActiveTab(tab)
    })
  }

  return (
    <>
      <ErrorBoundary fallback={<div>Ocorreu um erro ao carregar os seus dados.</div>}>
        <Suspense fallback={<div>Carregando seus dados...</div>}>
          <ProfileInfo userPromise={userPromise} />
        </Suspense>
      </ErrorBoundary>
      <Tabs>
        <Tab active={activeTab === 'posts'} onClick={() => handleTabChange('posts')}>
          Posts
        </Tab>
        <Tab active={activeTab === 'likes'} onClick={() => handleTabChange('likes')}>
          Curtidas
        </Tab>
      </Tabs>
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        <ErrorBoundary
          resetKey={activeTab}
          fallback={<div>Ocorreu um erro ao carregar os seus posts.</div>}
        >
          <Suspense fallback={<div>Carregando seus posts...</div>}>
            <PostList postPromise={postPromises[activeTab]!} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  )
}

export default Profile
