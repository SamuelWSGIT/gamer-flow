# GamerFlow

GamerFlow é uma rede social local para registrar jogos zerados, compartilhar experiências e acompanhar o tempo investido em cada campanha. A interface usa uma estética cyberpunk com neon, cards responsivos e foco em informações de gameplay.

O projeto funciona inteiramente no navegador: usuários, sessão, posts, curtidas, comentários e imagens são persistidos no `localStorage`. Não existe dependência de API ou servidor de dados externo.

## Funcionalidades

- Cadastro e login local.
- Sessão protegida por rota.
- Feed inicial com busca por jogo, gênero ou jogador.
- Posts com:
  - título do jogo;
  - plataforma;
  - tempo de jogo;
  - percentual de conclusão;
  - quantidade de conquistas;
  - nota;
  - modo solo ou co-op;
  - imagem e descrição.
- Curtidas persistidas no navegador.
- Comentários em modal, também persistidos localmente.
- Perfil com avatar, biografia, contagem de jogos e abas de posts/curtidas.
- Edição de nome, nick, biografia e avatar.
- Criação de novos registros de jogos com upload de imagem.
- Layout responsivo para desktop, tablet e celular.
- Avatares anime com identidade visual cyberpunk.

## Demonstração local

O usuário de demonstração é criado automaticamente na primeira execução:

```text
Login: test@outlook.com
Senha: test
```

Os posts iniciais são mantidos em [`src/services/posts.ts`](src/services/posts.ts). Atualmente, os registros de demonstração pertencem somente aos perfis definidos em `profileOverrides`, como `Francyptc` e `Saalrin`.

## Como executar

Pré-requisito: Node.js 20 ou superior.

```bash
git clone <url-do-repositorio>
cd gamer-flow
npm install
npm run dev
```

Depois, acesse o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento com hot reload. |
| `npm run build` | Verifica os tipos TypeScript e gera o build de produção. |
| `npm run preview` | Serve localmente o build de produção. |
| `npm run lint` | Executa o ESLint em todo o projeto. |
| `npm run test` | Executa o Vitest configurado para o projeto. |

## Rotas

As rotas são declaradas em [`src/main.tsx`](src/main.tsx). O feed e as páginas internas ficam protegidos pela rota de autenticação.

| Rota | Página | Acesso |
| --- | --- | --- |
| `/auth/login` | Login | Público |
| `/auth/cadastro` | Cadastro | Público |
| `/` | Página Inicial | Autenticado |
| `/postagem` | Novo registro de jogo | Autenticado |
| `/perfil` | Perfil do jogador | Autenticado |
| `/perfil/editar` | Edição do perfil | Autenticado |
| `/auth/logout` | Encerramento da sessão | Autenticado |

## Arquitetura atual

O fluxo principal do aplicativo é:

```text
main.tsx
  └─ React Router
      ├─ páginas públicas de autenticação
      └─ AppLayout + ProtectedRoute
          ├─ Feed
          │   └─ PostList → posts.ts → localStorage
          ├─ NewPost → posts.ts → localStorage
          ├─ Profile → user.ts + posts.ts
          └─ PostCard → likes/comments → localStorage
```

### Ponto de entrada e rotas

[`src/main.tsx`](src/main.tsx) inicializa o React, o `BrowserRouter` e todas as rotas da aplicação. A proteção de acesso é feita por [`src/components/ProtectedRoute/index.tsx`](src/components/ProtectedRoute/index.tsx), que verifica a sessão local antes de renderizar as páginas internas.

### Páginas

As telas principais ficam em [`src/pages/`](src/pages/):

- [`Login`](src/pages/Login/) e [`Register`](src/pages/Register/) controlam autenticação e cadastro.
- [`Feed`](src/pages/Feed/) exibe a busca e a lista de posts.
- [`NewPost`](src/pages/NewPost/) cria um novo registro de jogo.
- [`Profile`](src/pages/Profile/) mostra os dados e os posts do usuário autenticado.
- [`EditProfile`](src/pages/EditProfile/) altera as informações do perfil.
- [`Logout`](src/pages/Logout/) remove a sessão local.

### Componentes reutilizáveis

Os componentes de interface ficam em [`src/components/`](src/components/). Os mais importantes para o fluxo atual são:

- `AppLayout` e `Sidebar`: estrutura da área autenticada e navegação.
- `AuthLayout`: estrutura visual das telas de entrada.
- `PostList`, `PostsGrid` e `PostCard`: carregamento, organização e renderização dos registros.
- `CommentsModal`, `CommentList` e `Comment`: comentários dos posts.
- `ProfileHeader`, `Tabs` e `Tab`: informações e navegação do perfil.
- `ImageUploader`: seleção de imagem para novos posts e edição do avatar.
- `Button`, `Input`, `Textarea`, `FormField`, `RadioGroup`, `Avatar`, `StatChip`, `Tag`, `Title` e `Text`: componentes básicos usados pelas páginas.

Cada componente mantém seu estilo em um arquivo CSS Module próprio, evitando que regras de uma tela vazem para outra.

## Persistência local

As operações de armazenamento estão centralizadas em [`src/services/storage.ts`](src/services/storage.ts). As chaves utilizadas são:

| Chave | Conteúdo |
| --- | --- |
| `gamer-flow:users` | Usuários cadastrados e dados do perfil. |
| `gamer-flow:session` | Sessão do usuário autenticado. |
| `gamer-flow:posts` | Posts, curtidas e autores. |
| `gamer-flow:comments` | Comentários dos posts. |

Os serviços responsáveis pelas regras de negócio são:

- [`src/services/user.ts`](src/services/user.ts): cadastro, login, sessão, perfil e avatar.
- [`src/services/posts.ts`](src/services/posts.ts): posts, seed inicial, autores, curtidas e criação de registros.
- [`src/services/comments.ts`](src/services/comments.ts): comentários e atualização da contagem em cada post.

Uploads são convertidos para Data URLs pela função `fileToDataUrl` e armazenados no navegador. Por isso, os dados ficam disponíveis no mesmo navegador e origem, mas não são compartilhados entre dispositivos.

Para limpar os dados durante o desenvolvimento, execute no console do navegador:

```js
localStorage.removeItem('gamer-flow:users')
localStorage.removeItem('gamer-flow:session')
localStorage.removeItem('gamer-flow:posts')
localStorage.removeItem('gamer-flow:comments')
location.reload()
```

## Dados iniciais e `profileOverrides`

[`src/services/posts.ts`](src/services/posts.ts) define os registros iniciais e o objeto `profileOverrides`. Esse objeto normaliza os autores permitidos no feed, seus nicks e seus avatares.

Ao carregar os posts, o serviço:

1. lê os dados existentes no `localStorage`;
2. identifica autores antigos pelo ID, nome ou username;
3. atualiza os dados para o perfil correspondente em `profileOverrides`;
4. remove posts de autores que não fazem parte dos perfis configurados;
5. repõe os posts de demonstração que estiverem ausentes.

Esse processo permite alterar os dados seed sem deixar sessões antigas presas a autores ou avatares obsoletos.

## Identidade visual

As variáveis globais de cor, tipografia e fundo estão em [`src/index.css`](src/index.css). A identidade GamerFlow utiliza:

- fundo escuro com textura e gradientes;
- ciano, magenta, roxo e amarelo-limão como cores de destaque;
- fonte `Chakra Petch`;
- bordas e sombras neon;
- cards flexíveis com espaçamento consistente;
- favicon gamer em [`public/favicon.svg`](public/favicon.svg);
- logo, banners e imagens em [`public/images/`](public/images/).

## Stack

| Tecnologia | Uso |
| --- | --- |
| React 19 | Construção da interface e componentes. |
| TypeScript | Tipagem de páginas, serviços e props. |
| Vite | Ambiente de desenvolvimento e build. |
| React Router | Navegação e rotas protegidas. |
| CSS Modules | Estilos isolados por componente. |
| lucide-react | Ícones da interface. |
| Vitest + Testing Library | Infraestrutura de testes. |
| ESLint | Análise e padronização do código. |

## Organização do projeto

```text
gamer-flow/
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── components/       # componentes reutilizáveis da interface
│   ├── pages/            # telas e fluxos de navegação
│   ├── services/         # regras de negócio e localStorage
│   ├── util/             # funções auxiliares
│   ├── index.css         # tokens e estilos globais
│   ├── main.tsx          # entrada, router e rotas
│   └── setupTests.ts     # configuração do ambiente de testes
├── index.html
├── package.json
└── vite.config.ts
```

## Desenvolvimento

Ao criar uma nova funcionalidade:

1. coloque a tela em [`src/pages/`](src/pages/) ou o componente reutilizável em [`src/components/`](src/components/);
2. mantenha as operações de dados nos serviços em [`src/services/`](src/services/);
3. reutilize as variáveis de [`src/index.css`](src/index.css) nos estilos;
4. atualize as rotas em [`src/main.tsx`](src/main.tsx) quando necessário;
5. valide a alteração com `npm run lint` e `npm run build`.

## Status

O GamerFlow é uma aplicação frontend funcional para demonstração de uma rede social de jogos. Os dados são locais e não há backend, sincronização entre dispositivos ou banco de dados remoto.
