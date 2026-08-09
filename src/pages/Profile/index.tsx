import { Suspense, use, useState } from 'react'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import PostList from '../../components/PostList'
import ProfileHeader from '../../components/ProfileHeader'
import Tab from '../../components/Tab'
import Tabs from '../../components/Tabs'
import { fetchPostsCreatedByTheLoggedUser } from '../../services/posts'
import { fetchLoggedUser } from '../../services/user'

const promiseFetchLoggedUser = fetchLoggedUser()

function Profile() {

  const loggedUser = use(promiseFetchLoggedUser)

  const [postPromise] = useState(() => fetchPostsCreatedByTheLoggedUser())

  return (
    <>
      <ProfileHeader
        avatarSrc={loggedUser.avatarUrl}
        username={loggedUser.username}
        name={loggedUser.name}
        bio={loggedUser.bio || ''}
        workouts={loggedUser.workoutsCount || 0}
      />
      <Tabs>
        <Tab active>Posts</Tab>
        <Tab>Curtidas</Tab>
      </Tabs>
      <ErrorBoundary fallback={<div>Ocorreu um erro ao carregar os seus posts.</div>}>
        <Suspense fallback={<div>Carregando seus posts...</div>}>
          <PostList postPromise={postPromise} />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

export default Profile
