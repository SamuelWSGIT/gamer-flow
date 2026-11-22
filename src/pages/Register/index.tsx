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
      message: "Não foi possível criar o usuário: preencha todos os campos.",
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
      message: "Usuário criado com sucesso! Você será redirecionado para o login.",
      status: "success",
    };
  } catch (error) {
    return {
      message: `Não foi possível criar o usuário: ${getApiErrorMessage(error)}`,
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
    <AuthLayout bannerImage="/images/banner-register.png">
      <Title>CADASTRO</Title>
      <Text bold>Junte-se à nossa comunidade!</Text>
      <Text>Preencha seus dados:</Text>
      <Form action={formAction}>
        <FormField label="Nome" htmlFor="name">
          <Input id="name" name="name" placeholder="Seu nome" required />
        </FormField>
        <FormField label="Email ou usuário" htmlFor="email">
          <Input
            id="email"
            name="login"
            type="email"
            placeholder="usuario123@hotmail.com"
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
        <Checkbox id="remember">Lembrar-me</Checkbox>
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
          {isPending ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </Form>
      <AuthLink linkText="Faça seu login!" to="/auth/login">
        Já tem conta?
      </AuthLink>
    </AuthLayout>
  );
}

export default Register;
