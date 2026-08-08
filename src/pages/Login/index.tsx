import { ArrowRight, ClipboardList } from 'lucide-react'
import { useActionState } from 'react'
import { useNavigate } from 'react-router'
import AuthLayout from '../../components/AuthLayout'
import AuthLink from '../../components/AuthLink'
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox'
import Form from '../../components/Form'
import FormField from '../../components/FormField'
import Input from '../../components/Input'
import Text from '../../components/Text'
import Title from '../../components/Title'
import { signIn } from '../../services/user'

function Login() {
  const navigate = useNavigate()

  const [error, loginAction, isPending] = useActionState(
    async (_previousError: string | null, formData: FormData) => {
      const login = String(formData.get('login') ?? '').trim()
      const password = String(formData.get('password') ?? '')

      if (!login || !password) {
        return 'Preencha todos os campos.'
      }

      try {
        await signIn({ login, password })
      } catch {
        return 'Login ou senha inválidos.'
      }

      navigate('/')
      return null
    },
    null
  )

  return (
    <AuthLayout bannerImage="/images/banner-login.png">
      <Title>LOGIN</Title>
      <Text bold>Boas-vindas! Faça seu login.</Text>
      <Form action={loginAction}>
        <FormField label="Email ou usuário" htmlFor="login">
          <Input
            id="login"
            name="login"
            type="email"
            placeholder="usuario123@hotmail.com"
          />
        </FormField>
        <FormField label="Senha" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="******"
          />
        </FormField>
        <Checkbox id="remember">Lembrar-me</Checkbox>
        {error && <Text>{error}</Text>}
        <Button
          type="submit"
          disabled={isPending}
          icon={<ArrowRight size={20} />}
        >
          {isPending ? 'Entrando...' : 'Login'}
        </Button>
      </Form>
      <AuthLink
        linkText="Crie seu cadastro!"
        icon={<ClipboardList size={20} />}
        to="/auth/cadastro"
      >
        Ainda não tem conta?
      </AuthLink>
    </AuthLayout>
  )
}

export default Login
