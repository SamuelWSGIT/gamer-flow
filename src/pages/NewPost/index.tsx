import { Flame, Footprints, HeartPulse, Timer } from 'lucide-react'
import { useActionState } from 'react'
import { useNavigate } from 'react-router'
import Columns from '../../components/Columns'
import FormActions from '../../components/FormActions'
import FormField from '../../components/FormField'
import ImagePlaceholder from '../../components/ImagePlaceholder'
import ImageUploader from '../../components/ImageUploader'
import Input from '../../components/Input'
import Radio from '../../components/Radio'
import RadioGroup from '../../components/RadioGroup'
import Text from '../../components/Text'
import Textarea from '../../components/Textarea'
import TimeInput from '../../components/TimeInput'
import Title from '../../components/Title'
import { createPost, type NewPost as NewPostPayload } from '../../services/posts'
import { parseDuration } from '../../util'
import styles from './NewPost.module.css'

function NewPost() {
  const navigate = useNavigate()

  const [error, createPostAction, isPending] = useActionState(
    async (_previousError: string | null, formData: FormData) => {
      const hours = String(formData.get('hours') ?? '0')
      const minutes = String(formData.get('minutes') ?? '0')
      const distanceKm = Number(formData.get('distance'))
      const calories = Number(formData.get('calories'))
      const heartRateBpm = Number(formData.get('heart-rate'))
      const description = String(formData.get('description') ?? '').trim()

      if (formData.get('workout-type') !== 'walking' && formData.get('workout-type') !== 'running') {
        return 'Escolha o tipo de treino.'
      }
      const type: 'walking' | 'running' = formData.get('workout-type') as 'walking' | 'running'

      // "HH:MM" -> segundos; km -> metros
      const durationSeconds = parseDuration(`${hours}:${minutes}`)
      const distanceMeters = Math.round(distanceKm * 1000)

      if (!durationSeconds || !distanceMeters) {
        return 'Informe o tempo e a distância do treino.'
      }

      const newPost: NewPostPayload = {
        durationSeconds,
        type,
        distanceMeters,
        calories,
        heartRateBpm,
        description,
      }

      if (formData.get('image') instanceof File) {
        newPost.image = formData.get('image') as File
      }

      try {
        await createPost(newPost)
      } catch {
        return 'Não foi possível publicar sua postagem. Tente novamente.'
      }

      navigate('/')
      return null
    },
    null
  )

  return (
    <>
      <Title>Nova postagem</Title>
      <form action={createPostAction}>
        <Columns mediaSize="fluid">
          <ImageUploader
            name="image"
            fileName="image_projeto.png"
            placeholder={<ImagePlaceholder />}
          />
          <div className={styles.fields}>
            <FormField
              label={
                <>
                  <Timer size={20} /> Tempo
                </>
              }
              htmlFor="hours"
            >
              <TimeInput />
            </FormField>
            <FormField
              label={
                <>
                  <Footprints size={20} /> Distância (Km)
                </>
              }
              htmlFor="distance"
            >
              <Input
                id="distance"
                name="distance"
                type="number"
                min={0}
                step="0.01"
                placeholder="5"
              />
            </FormField>
            <FormField
              label={
                <>
                  <Flame size={20} /> Calorias (Kcal)
                </>
              }
              htmlFor="calories"
            >
              <Input
                id="calories"
                name="calories"
                type="number"
                min={0}
                placeholder="300"
              />
            </FormField>
            <FormField
              label={
                <>
                  <HeartPulse size={20} /> Batimentos (BPM)
                </>
              }
              htmlFor="heart-rate"
            >
              <Input
                id="heart-rate"
                name="heart-rate"
                type="number"
                min={0}
                placeholder="120"
              />
            </FormField>
            <FormField label="Descrição" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                placeholder="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
              />
            </FormField>
            <RadioGroup label="Tipo de Treino">
              <Radio name="workout-type" id="walking" value="walking">
                Caminhada
              </Radio>
              <Radio name="workout-type" id="running" value="running">
                Corrida
              </Radio>
            </RadioGroup>
            {error && <Text>{error}</Text>}
            <FormActions submit isPending={isPending} />
          </div>
        </Columns>
      </form>
    </>
  )
}

export default NewPost
