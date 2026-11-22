import { useActionState, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Avatar from "../../components/Avatar";
import Columns from "../../components/Columns";
import FormActions from "../../components/FormActions";
import FormField from "../../components/FormField";
import ImageUploader from "../../components/ImageUploader";
import Input from "../../components/Input";
import Text from "../../components/Text";
import Textarea from "../../components/Textarea";
import Title from "../../components/Title";
import { fetchLoggedUser, updateUser, type User } from "../../services/user";
import { getApiErrorMessage } from "../../util";
import styles from "./EditProfile.module.css";

function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const userRequest = useRef<ReturnType<typeof fetchLoggedUser> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const request = userRequest.current ??= fetchLoggedUser();

    request
      .then((loggedUser) => {
        if (isMounted) {
          setUser(loggedUser);
        }
      })
      .catch((requestError: unknown) => {
        if (isMounted) {
          setLoadError(`Não foi possível carregar o perfil: ${getApiErrorMessage(requestError)}`);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const [error, updateUserAction, isPending] = useActionState(
    async (_previousError: string | null, formData: FormData) => {
      const name = String(formData.get("name") ?? "").trim();
      const username = String(formData.get("username") ?? "").trim();
      const bio = String(formData.get("bio") ?? "").trim();
      const avatar = formData.get("avatar");

      if (!name || !username) {
        return "Nome e usuário não podem ficar em branco.";
      }

      try {
        await updateUser({
          name,
          username,
          bio,
          ...(avatar instanceof File && avatar.size > 0 ? { avatar } : {}),
        });

        navigate("/perfil");
        return null;
      } catch (requestError: unknown) {
        return `Não foi possível salvar os dados: ${getApiErrorMessage(requestError)}`;
      }
    },
    null,
  );

  if (loadError) {
    return <Text role="alert">{loadError}</Text>;
  }

  if (!user) {
    return <Text>Carregando perfil...</Text>;
  }

  return (
    <form action={updateUserAction}>
      <Columns>
        <ImageUploader
          name="avatar"
          fileName={user.avatarUrl ? "Imagem atual" : undefined}
          removeName="removeAvatar"
          onRemoveExisting={() => setRemoveAvatar(true)}
          onSelectImage={() => setRemoveAvatar(false)}
          placeholder={<Avatar size="large" src={removeAvatar ? null : user.avatarUrl} />}
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
            <Textarea id="description" name="bio" defaultValue={user.bio || ""} />
          </FormField>
          {error && <Text role="alert">{error}</Text>}
          <FormActions
            isSubmitting={isPending}
            onCancel={() => navigate("/perfil")}
          />
        </div>
      </Columns>
    </form>
  );
}

export default EditProfile;
