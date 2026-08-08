import { ArrowRight } from 'lucide-react'
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
import { createUser } from '../../services/user'

function Register() {
  const navigate = useNavigate()

  const [error, registerAction, isPending] = useActionState(
    async (_previousError: string | null, formData: FormData) => {
      const name = String(formData.get('name') ?? '').trim()
      const login = String(formData.get('login') ?? '').trim()
      const password = String(formData.get('password') ?? '')

      if (!name || !login || !password) {
        return 'Preencha todos os campos.'
      }

      try {
        await createUser({ name, login, password })
      } catch {
        return 'Não foi possível criar sua conta. Tente novamente.'
      }

      navigate('/auth/login')
      return null
    },
    null
  )

  return (
    <AuthLayout bannerImage="/images/banner-register.png">
      <Title>CADASTRO</Title>
      <Text bold>Junte-se à nossa comunidade!</Text>
      <Text>Preencha seus dados:</Text>
      <Form action={registerAction}>
        <FormField label="Nome" htmlFor="name">
          <Input id="name" name="name" placeholder="Seu nome" />
        </FormField>
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
          {isPending ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </Form>
      <AuthLink
        linkText="Faça seu login!"
        to="/auth/login"
      >
        Já tem conta?
      </AuthLink>
    </AuthLayout>
  )
}

export default Register
