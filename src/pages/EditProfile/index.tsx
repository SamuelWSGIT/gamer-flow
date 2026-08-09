import { Suspense, use, useState } from 'react'
import Avatar from '../../components/Avatar'
import Columns from '../../components/Columns'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import FormActions from '../../components/FormActions'
import FormField from '../../components/FormField'
import ImageUploader from '../../components/ImageUploader'
import Input from '../../components/Input'
import Text from '../../components/Text'
import Textarea from '../../components/Textarea'
import Title from '../../components/Title'
import { fetchLoggedUser, type User } from '../../services/user'
import styles from './EditProfile.module.css'

type EditProfileFormProps = {
  userPromise: Promise<User>
}

function EditProfileForm({ userPromise }: EditProfileFormProps) {

  const user: User = use(userPromise)

  return (
    <form>
      <Columns>
        <ImageUploader
          fileName="image.png"
          placeholder={<Avatar size="large" src={user.avatarUrl} />}
        />
        <div className={styles.fields}>
          <Text bold>@{user.username}</Text>
          <Title>Edite seus dados</Title>
          <FormField label="User" htmlFor="user">
            <Input id="user" name="username" defaultValue={user.username} />
          </FormField>
          <FormField label="Nome" htmlFor="name">
            <Input id="name" name="name" defaultValue={user.name} />
          </FormField>
          <FormField label="Descrição" htmlFor="description">
            <Textarea
              id="description"
              name="bio"
              defaultValue={user.bio || ''}
            />
          </FormField>
          <FormActions />
        </div>
      </Columns>
    </form>
  )
}

function EditProfile() {

  const [userPromise] = useState(() => fetchLoggedUser())

  return (
    <ErrorBoundary fallback={<div>Ocorreu um erro ao carregar os seus dados.</div>}>
      <Suspense fallback={<div>Carregando seus dados...</div>}>
        <EditProfileForm userPromise={userPromise} />
      </Suspense>
    </ErrorBoundary>
  )
}

export default EditProfile
