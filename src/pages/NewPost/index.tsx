import { useActionState } from "react";
import { Gamepad2, Star, Timer, Trophy } from "lucide-react";
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
import { createPost, type GameMode } from "../../services/posts";
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

function isGameMode(value: FormDataEntryValue | null): value is GameMode {
  return value === "solo" || value === "co-op";
}

async function createPostAction(
  _previousState: NewPostState,
  formData: FormData,
): Promise<NewPostState> {
  const title = String(formData.get("title") ?? "").trim();
  const platform = String(formData.get("platform") ?? "").trim();
  const hours = readNumber(formData, "hours");
  const minutes = readNumber(formData, "minutes");
  const completionPercent = readNumber(formData, "completionPercent");
  const achievements = readNumber(formData, "achievements");
  const rating = readNumber(formData, "rating");
  const gameMode = formData.get("game-mode");
  const description = String(formData.get("description") ?? "").trim();
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
  const hasValidGameData =
    completionPercent !== null &&
    completionPercent >= 0 &&
    completionPercent <= 100 &&
    achievements !== null &&
    achievements >= 0 &&
    Number.isInteger(achievements) &&
    rating !== null &&
    rating >= 0 &&
    rating <= 10;

  if (
    !title ||
    !platform ||
    !hasValidDuration ||
    !hasValidGameData ||
    !isGameMode(gameMode) ||
    !description
  ) {
    return {
      message: "Não foi possível criar o registro: revise os campos.",
      status: "error",
    };
  }

  try {
    await createPost({
      title,
      image,
      durationSeconds: hours * 3600 + minutes * 60,
      type: gameMode,
      platform,
      completionPercent,
      achievements,
      rating,
      description,
    });

    return {
      message: "Game log publicado com sucesso!",
      status: "success",
    };
  } catch (error) {
    return {
      message: `Não foi possível publicar o registro: ${getApiErrorMessage(error)}`,
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
      <Title>Novo game log</Title>
      <form action={formAction}>
        <Columns mediaSize="fluid">
          <ImageUploader
            name="image"
            fileName="capa-do-jogo.png"
            placeholder={<ImagePlaceholder />}
          />
          <div className={styles.fields}>
            <FormField label="Nome do jogo" htmlFor="title">
              <Input id="title" name="title" placeholder="Elden Ring" required />
            </FormField>
            <FormField label="Plataforma" htmlFor="platform">
              <Input id="platform" name="platform" placeholder="PC, PS5, Switch..." required />
            </FormField>
            <FormField
              label={
                <>
                  <Timer size={20} /> Tempo para zerar
                </>
              }
              htmlFor="hours"
            >
              <TimeInput />
            </FormField>
            <FormField
              label={
                <>
                  <Gamepad2 size={20} /> Conclusão (%)
                </>
              }
              htmlFor="completion-percent"
            >
              <Input
                id="completion-percent"
                name="completionPercent"
                type="number"
                min={0}
                max={100}
                placeholder="100"
                required
              />
            </FormField>
            <FormField
              label={
                <>
                  <Trophy size={20} /> Conquistas
                </>
              }
              htmlFor="achievements"
            >
              <Input
                id="achievements"
                name="achievements"
                type="number"
                min={0}
                placeholder="42"
                required
              />
            </FormField>
            <FormField
              label={
                <>
                  <Star size={20} /> Nota pessoal
                </>
              }
              htmlFor="rating"
            >
              <Input
                id="rating"
                name="rating"
                type="number"
                min={0}
                max={10}
                step="0.1"
                placeholder="9.5"
                required
              />
            </FormField>
            <FormField label="Diário da run" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                placeholder="Conte como foi zerar esse jogo."
                required
              />
            </FormField>
            <RadioGroup label="Modo de jogo">
              <Radio name="game-mode" id="solo" value="solo" required>
                Solo
              </Radio>
              <Radio name="game-mode" id="co-op" value="co-op">
                Co-op
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
