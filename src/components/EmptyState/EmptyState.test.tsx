import { render, screen } from '@testing-library/react';
import EmptyState from '.';

it('exibe o title e a description padrão quando as props não são passadas', () => {
    render(<EmptyState />)

    expect(screen.getByText('Nada por aqui ainda...')).toBeInTheDocument()
    expect(screen.getByText('Quando houver treinos publicados, eles aparecem aqui.')).toBeInTheDocument()
})

it('exibe o title e a description de acordo com os valores passados', () => {
    render(<EmptyState
        title="Nenhum treino encontrado"
        description="Tente ajustar os filtros da busca."
    />)

    expect(screen.getByText('Nenhum treino encontrado')).toBeInTheDocument()
    expect(screen.getByText('Tente ajustar os filtros da busca.')).toBeInTheDocument()
})
