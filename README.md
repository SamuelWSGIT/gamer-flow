# GamerFlow — Rede social de jogos

Projeto de portfólio adaptado por Samuel Almeida a partir do [Runner Circle da Alura](https://github.com/alura-cursos/runner-circle). A aplicação permite catalogar jogos finalizados, compartilhar avaliações e acompanhar o progresso das campanhas. Foi construída com React, TypeScript, Vite, React Router e CSS Modules, com identidade visual cyberpunk e layout responsivo.

## Demonstração

**[Acessar a aplicação na Vercel](https://gamerflow-six.vercel.app/)**

1. Na [tela de login](https://gamerflow-six.vercel.app/auth/login), entre com a conta de demonstração abaixo ou crie uma conta local.
2. No feed, procure registros por título, gênero ou jogador e experimente interagir com os cards por meio de curtidas e comentários.
3. Na área de nova postagem, registre um jogo informando plataforma, duração, progresso, conquistas, avaliação, modo de jogo, descrição e imagem.
4. Visite o perfil para consultar seus registros e curtidas. Na edição de perfil, personalize nome, nick, biografia e avatar.

| Conta de demonstração | Valor |
| --- | --- |
| E-mail | `test@outlook.com` |
| Senha | `test` |

O cadastro, a autenticação e as interações são simulados no navegador. Os dados ficam no `localStorage` e não são sincronizados entre dispositivos. Não há servidor de autenticação ou banco de dados remoto nesta versão. Use apenas dados fictícios.

## Como executar

Utilize Node.js 24 (recomendado) e npm. Clone o projeto e execute:

```bash
git clone https://github.com/SamuelWSGIT/gamer-flow.git
cd gamer-flow
npm ci
npm run dev
```

Abra a URL indicada pelo Vite, normalmente `http://localhost:5173`.

| Comando | Uso |
| --- | --- |
| `npm run lint` | Analisar o código com ESLint |
| `npm run build` | Validar TypeScript e gerar a versão de produção em `dist/` |
| `npm run preview` | Visualizar localmente o build |
| `npm run test` | Iniciar o Vitest |

## Estrutura

| Diretório ou arquivo | Conteúdo |
| --- | --- |
| `src/main.tsx` | Entrada da aplicação e definição das rotas |
| `src/pages/` | Telas de autenticação, feed, postagem e perfil |
| `src/components/` | Componentes reutilizáveis, layouts, cards e formulários |
| `src/services/` | Operações de usuários, posts, comentários e armazenamento |
| `src/util/` | Funções auxiliares |
| `src/index.css` | Estilos globais e identidade visual |
| `src/setupTests.ts` | Configuração do ambiente de testes |
| `public/images/` | Imagens e recursos visuais |

## Rotas principais

| Rota | Tela | Acesso |
| --- | --- | --- |
| `/auth/login` | Entrada | Público |
| `/auth/cadastro` | Cadastro | Público |
| `/` | Feed | Sessão local |
| `/postagem` | Novo registro | Sessão local |
| `/perfil` | Perfil | Sessão local |
| `/perfil/editar` | Personalização do perfil | Sessão local |
| `/auth/logout` | Saída | Sessão local |

## Tecnologias

React 19, TypeScript, Vite, React Router, CSS Modules, Lucide React, Web Storage API, ESLint, Vitest e Testing Library.

---

Projeto educacional para demonstração de competências em desenvolvimento front-end.
