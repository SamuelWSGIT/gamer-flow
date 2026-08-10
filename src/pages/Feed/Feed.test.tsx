import { act, render, screen } from '@testing-library/react';
import Feed from '.';
import { fetchPosts, type Post } from '../../services/posts';

// a página busca os posts na API: no teste, trocamos o serviço por um dublê
vi.mock('../../services/posts')

const post: Post = {
    id: '1',
    durationSeconds: 900,
    type: 'running',
    distanceMeters: 5000,
    calories: 330,
    heartRateBpm: 130,
    description: 'Uma corrida bacana',
    likesCount: 5,
    likedByMe: false,
    commentsCount: 2,
    createdAt: '2026-01-01T10:00:00.000Z',
    author: {
        id: '10',
        name: 'Vinicios Neves',
        username: 'vinicios',
    },
}

// o Feed suspende já no primeiro render: sem o act, o React deixa a atualização
// na fila e a tela fica congelada no fallback do Suspense
async function renderFeed() {
    await act(async () => {
        render(<Feed />)
    })
}

it('mostra o aviso de carregando enquanto os posts não chegam', () => {
    // uma promise que nunca resolve congela a tela no estado de carregamento
    vi.mocked(fetchPosts).mockReturnValue(new Promise(() => {}))

    render(<Feed />)

    expect(screen.getByText('Carregando posts...')).toBeInTheDocument()
})

it('mostra os posts retornados pela API', async () => {
    vi.mocked(fetchPosts).mockResolvedValue([post])

    await renderFeed()

    expect(await screen.findByText('Vinicios Neves')).toBeInTheDocument()
    // os metros viram km e o tempo em segundos vira HH:MM na tela
    expect(screen.getByText('5 Km')).toBeInTheDocument()
    expect(screen.getByText('00:15')).toBeInTheDocument()
    expect(screen.queryByText('Carregando posts...')).not.toBeInTheDocument()
})

it('mostra a mensagem de erro quando a busca pelos posts falha', async () => {
    vi.mocked(fetchPosts).mockRejectedValue(new Error('Erro de rede'))

    // o ErrorBoundary loga o erro que capturou: silenciamos pra não poluir a saída
    vi.spyOn(console, 'error').mockImplementation(() => {})

    await renderFeed()

    expect(await screen.findByText('Ocorreu um erro ao carregar os posts.')).toBeInTheDocument()
})
