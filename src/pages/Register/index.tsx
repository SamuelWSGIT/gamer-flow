import { useActionState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

import AuthLayout from "../../components/AuthLayout";
import AuthLink from "../../components/AuthLink";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Input from "../../components/Input";
import Text from "../../components/Text";
import Title from "../../components/Title";
import { createUser } from "../../services/user";
import { getApiErrorMessage } from "../../util";

type RegisterState = {
  message: string | null;
  status: "idle" | "success" | "error";
};

const initialState: RegisterState = {
  message: null,
  status: "idle",
};

async function registerAction(
  _previousState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name = formData.get("name");
  const login = formData.get("login");
  const password = formData.get("password");

  if (
    typeof name !== "string" ||
    typeof login !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !login.trim() ||
    !password
  ) {
    return {
      message: "Não foi possível criar o perfil: preencha todos os campos.",
      status: "error",
    };
  }

  try {
    await createUser({
      name: name.trim(),
      login: login.trim(),
      password,
    });

    return {
      message: "Perfil criado! Preparando seu acesso.",
      status: "success",
    };
  } catch (error) {
    return {
      message: `Não foi possível criar o perfil: ${getApiErrorMessage(error)}`,
      status: "error",
    };
  }
}

function Register() {
  const navigate = useNavigate();
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigate("/auth/login", { replace: true });
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [navigate, state.status]);

  return (
    <AuthLayout bannerImage="/images/cyberpunk-banner-register.png">
      <Title>New player</Title>
      <Text bold>Crie seu perfil na rede de jogadores.</Text>
      <Text>Configure seu acesso:</Text>
      <Form action={formAction}>
        <FormField label="Nome" htmlFor="name">
          <Input id="name" name="name" placeholder="Seu handle" required />
        </FormField>
        <FormField label="Email ou handle" htmlFor="email">
          <Input
            id="email"
            name="login"
            type="email"
            placeholder="player@neonsave.gg"
            required
          />
        </FormField>
        <FormField label="Senha" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="******"
            required
          />
        </FormField>
        <Checkbox id="remember">Manter sessão ativa</Checkbox>
        {state.message && (
          <Text
            role={state.status === "error" ? "alert" : "status"}
            aria-live="polite"
            bold={state.status === "success"}
          >
            {state.message}
          </Text>
        )}
        <Button
          type="submit"
          disabled={isPending}
          icon={<ArrowRight size={20} />}
        >
          {isPending ? "Criando..." : "Criar perfil"}
        </Button>
      </Form>
      <AuthLink linkText="Acessar terminal" to="/auth/login">
        Já tem um perfil?
      </AuthLink>
    </AuthLayout>
  );
}

export default Register;
