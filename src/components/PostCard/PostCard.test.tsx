import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostCard from '.';
import { likePost, unlikePost } from '../../services/posts';

// o componente chama a API ao curtir: no teste, trocamos o serviço por um dublê
vi.mock('../../services/posts')

const defaultProps = {
    id: "1",
    title: "Título do post",
    author: "Vinicios Neves",
    activity: 'running',
    calories: '330',
    commentsCount: 5,
    description: 'Uma corrida bacana',
    distance: '5',
    heartRate: '130',
    liked: false,
    likes: 5,
    time: '00:15',
}

it('mostra o nome do autor do post', () => {
    render(<PostCard {...defaultProps} />)

    expect(screen.getByText('Vinicios Neves')).toBeInTheDocument()
})

it('mostra o botão de curtir marcado quando o post já foi curtido', () => {
    render(<PostCard {...defaultProps} liked={true} />)

    expect(screen.getByRole('button', { name: 'Curtir' })).toHaveAttribute('aria-pressed', 'true')
})

it('mostra o botão de curtir desmarcado quando o post não foi curtido', () => {
    render(<PostCard {...defaultProps} liked={false} />)

    expect(screen.getByRole('button', { name: 'Curtir' })).toHaveAttribute('aria-pressed', 'false')
})

it('curte o post e soma um like quando o usuário clica em curtir', async () => {
    render(<PostCard {...defaultProps} liked={false} likes={5} />)

    const likeButton = screen.getByRole('button', { name: 'Curtir' })

    await userEvent.click(likeButton)

    expect(likePost).toHaveBeenCalledWith('1')
    expect(likeButton).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('6')).toBeInTheDocument()
})

it('descurte o post e diminui um like quando o usuário clica em um post já curtido', async () => {
    render(<PostCard {...defaultProps} liked={true} likes={5} />)

    const likeButton = screen.getByRole('button', { name: 'Curtir' })

    await userEvent.click(likeButton)

    expect(unlikePost).toHaveBeenCalledWith('1')
    expect(likeButton).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('4')).toBeInTheDocument()
})

it('mostra a distância, as calorias e os batimentos com suas unidades', () => {
    render(<PostCard {...defaultProps} distance="5" calories="330" heartRate="130" />)

    expect(screen.getByText('5 Km')).toBeInTheDocument()
    expect(screen.getByText('330 Kcal')).toBeInTheDocument()
    expect(screen.getByText('130 BPM')).toBeInTheDocument()
})
