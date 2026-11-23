import { useActionState, useEffect } from "react";
import { ArrowRight, ClipboardList } from "lucide-react";
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
import { signIn } from "../../services/user";
import { getApiErrorMessage } from "../../util";

type LoginState = {
  message: string | null;
  status: "idle" | "success" | "error";
};

const initialState: LoginState = {
  message: null,
  status: "idle",
};

async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const login = formData.get("login");
  const password = formData.get("password");

  if (
    typeof login !== "string" ||
    typeof password !== "string" ||
    !login.trim() ||
    !password
  ) {
    return {
      message: "Não foi possível entrar: informe o usuário e a senha.",
      status: "error",
    };
  }

  try {
    await signIn({
      login: login.trim(),
      password,
    });

    return {
      message: "Login realizado! Redirecionando para o arquivo.",
      status: "success",
    };
  } catch (error) {
    return {
      message: `Não foi possível realizar o login: ${getApiErrorMessage(error)}`,
      status: "error",
    };
  }
}

function Login() {
  const navigate = useNavigate();
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigate("/", { replace: true });
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [navigate, state.status]);

  return (
    <AuthLayout bannerImage="/images/cyberpunk-banner-login.png">
      <Title>Access terminal</Title>
      <Text bold>Conecte-se ao seu arquivo de partidas.</Text>
      <Text>
        Acesso de teste — login: <strong>test@outlook.com</strong> | senha:{" "}
        <strong>test</strong>
      </Text>
      <Form action={formAction}>
        <FormField label="Email ou handle" htmlFor="email">
          <Input
            id="email"
            name="login"
            type="email"
            placeholder="test@outlook.com"
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
          {isPending ? "Conectando..." : "Entrar"}
        </Button>
      </Form>
      <AuthLink
        linkText="Criar novo perfil"
        icon={<ClipboardList size={20} />}
        to="/auth/cadastro"
      >
        Ainda não tem acesso?
      </AuthLink>
    </AuthLayout>
  );
}

export default Login;
