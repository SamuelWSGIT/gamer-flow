import { Suspense, use, useState } from 'react'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import PostList from '../../components/PostList'
import ProfileHeader from '../../components/ProfileHeader'
import Tab from '../../components/Tab'
import Tabs from '../../components/Tabs'
import { fetchPostsCreatedByTheLoggedUser } from '../../services/posts'
import { fetchLoggedUser, type User } from '../../services/user'

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

  const [userPromise] = useState(() => fetchLoggedUser())

  const [postPromise] = useState(() => fetchPostsCreatedByTheLoggedUser())

  return (
    <>
      <ErrorBoundary fallback={<div>Ocorreu um erro ao carregar os seus dados.</div>}>
        <Suspense fallback={<div>Carregando seus dados...</div>}>
          <ProfileInfo userPromise={userPromise} />
        </Suspense>
      </ErrorBoundary>
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
