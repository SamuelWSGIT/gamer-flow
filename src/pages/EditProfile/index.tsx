import { Suspense, use, useActionState, useState } from 'react'
import { useNavigate } from 'react-router'
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
import {
  fetchLoggedUser,
  updateUser,
  type UpdateUser,
  type User,
} from '../../services/user'
import styles from './EditProfile.module.css'

type EditProfileFormProps = {
  userPromise: Promise<User>
}

function EditProfileForm({ userPromise }: EditProfileFormProps) {

  const user: User = use(userPromise)

  const navigate = useNavigate()

  const [error, updateUserAction, isPending] = useActionState(
    async (_previousError: string | null, formData: FormData) => {
      const name = String(formData.get('name') ?? '').trim()
      const username = String(formData.get('username') ?? '').trim()

      if (!name || !username) {
        return 'Nome e usuário não podem ficar em branco.'
      }

      const updatedUser: UpdateUser = {
        name,
        username,
        bio: String(formData.get('bio') ?? '').trim(),
      }

      const avatar = formData.get('avatar')
      // sem arquivo escolhido o input devolve um File vazio
      if (avatar instanceof File && avatar.size > 0) {
        updatedUser.avatar = avatar
      }

      try {
        await updateUser(updatedUser)
      } catch {
        return 'Não foi possível salvar seus dados. Tente novamente.'
      }

      navigate('/perfil')
      return null
    },
    null
  )

  return (
    <form action={updateUserAction}>
      <Columns>
        <ImageUploader
          name="avatar"
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
          {error && <Text>{error}</Text>}
          <FormActions submit isPending={isPending} />
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
