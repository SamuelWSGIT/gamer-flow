import { use } from 'react'
import PostCard from '../../components/PostCard'
import PostsGrid from '../../components/PostsGrid'
import ProfileHeader from '../../components/ProfileHeader'
import Tab from '../../components/Tab'
import Tabs from '../../components/Tabs'
import { fetchLoggedUser } from '../../services/user'

const posts = [1, 2, 3, 4, 5, 6]

const promiseFetchLoggedUser = fetchLoggedUser()

function Profile() {

  const loggedUser = use(promiseFetchLoggedUser)

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
      <PostsGrid>
        {posts.map((post) => (
          <PostCard
            key={post}
            time="00:30"
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

export default Profile
