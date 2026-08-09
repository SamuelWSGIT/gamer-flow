import { render, screen } from '@testing-library/react';
import PostCard from '.';

it('mostra o nome do autor do post', () => {
    render(<PostCard 
        id="1"
        title="Título do post"
        author="Vinicios Neves"
        activity='running'
        calories='330'
        commentsCount={5}
        description='Uma corrida bacana'
        distance='5'
        heartRate='130'
        liked={false}
        likes={5}
        time='00:15'
    />)

    expect(screen.getByText('Vinicios Neves')).toBeInTheDocument()
})