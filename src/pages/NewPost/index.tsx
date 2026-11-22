import { useActionState } from "react";
import { Flame, Footprints, HeartPulse, Timer } from "lucide-react";
import Columns from "../../components/Columns";
import FormActions from "../../components/FormActions";
import FormField from "../../components/FormField";
import ImagePlaceholder from "../../components/ImagePlaceholder";
import ImageUploader from "../../components/ImageUploader";
import Input from "../../components/Input";
import Radio from "../../components/Radio";
import RadioGroup from "../../components/RadioGroup";
import Text from "../../components/Text";
import Textarea from "../../components/Textarea";
import TimeInput from "../../components/TimeInput";
import Title from "../../components/Title";
import { createPost } from "../../services/posts";
import { getApiErrorMessage } from "../../util";
import styles from "./NewPost.module.css";

type NewPostState = {
  message: string | null;
  status: "idle" | "success" | "error";
};

const initialState: NewPostState = {
  message: null,
  status: "idle",
};

function readNumber(formData: FormData, fieldName: string): number | null {
  const value = formData.get(fieldName);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function isWorkoutType(
  value: FormDataEntryValue | null,
): value is "walking" | "running" {
  return value === "walking" || value === "running";
}

async function createPostAction(
  _previousState: NewPostState,
  formData: FormData,
): Promise<NewPostState> {
  const hours = readNumber(formData, "hours");
  const minutes = readNumber(formData, "minutes");
  const distanceKm = readNumber(formData, "distance");
  const calories = readNumber(formData, "calories");
  const heartRateBpm = readNumber(formData, "heartRateBpm");
  const workoutType = formData.get("workout-type");
  const description = formData.get("description");
  const imageEntry = formData.get("image");
  const image = imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : undefined;

  const hasValidDuration =
    hours !== null &&
    minutes !== null &&
    Number.isInteger(hours) &&
    Number.isInteger(minutes) &&
    hours >= 0 &&
    minutes >= 0 &&
    minutes <= 59;

  const hasValidMetrics =
    distanceKm !== null &&
    distanceKm >= 0 &&
    calories !== null &&
    calories >= 0 &&
    heartRateBpm !== null &&
    heartRateBpm >= 0;

  if (
    !hasValidDuration ||
    !hasValidMetrics ||
    !isWorkoutType(workoutType) ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return {
      message: "Não foi possível criar a postagem: preencha os campos corretamente.",
      status: "error",
    };
  }

  try {
    await createPost({
      image,
      // A API espera distância em metros, enquanto o formulário usa km.
      distanceMeters: distanceKm * 1000,
      // A API espera a duração total em segundos, não no formato HH:MM.
      durationSeconds: hours * 3600 + minutes * 60,
      type: workoutType,
      calories,
      heartRateBpm,
      description: description.trim(),
    });

    return {
      message: "Postagem criada com sucesso!",
      status: "success",
    };
  } catch (error) {
    return {
      message: `Não foi possível criar a postagem: ${getApiErrorMessage(error)}`,
      status: "error",
    };
  }
}

function NewPost() {
  const [state, formAction, isPending] = useActionState(
    createPostAction,
    initialState,
  );

  return (
    <>
      <Title>Nova postagem</Title>
      <form action={formAction}>
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
                step="any"
                placeholder="5"
                required
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
                required
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
                name="heartRateBpm"
                type="number"
                min={0}
                placeholder="120"
                required
              />
            </FormField>
            <FormField label="Descrição" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                placeholder="Descreva como foi seu treino."
                required
              />
            </FormField>
            <RadioGroup label="Tipo de Treino">
              <Radio name="workout-type" id="walking" value="walking" required>
                Caminhada
              </Radio>
              <Radio name="workout-type" id="running" value="running">
                Corrida
              </Radio>
            </RadioGroup>
            {state.message && (
              <Text
                role={state.status === "error" ? "alert" : "status"}
                aria-live="polite"
                bold={state.status === "success"}
              >
                {state.message}
              </Text>
            )}
            <FormActions isSubmitting={isPending} />
          </div>
        </Columns>
      </form>
    </>
  );
}

export default NewPost;
