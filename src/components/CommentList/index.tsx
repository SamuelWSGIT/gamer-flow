import type { ComponentProps } from 'react'
import Comment from '../Comment'
import EmptyState from '../EmptyState'
import type { Comment as CommentType } from '../../services/comment'
import styles from './CommentList.module.css'

type CommentListProps = ComponentProps<'ul'> & {
  comments: CommentType[]
}

function CommentList({ comments, ...rest }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <EmptyState
        title="Nenhum comentário ainda..."
        description="Seja a primeira pessoa a comentar neste treino."
      />
    )
  }

  return (
    <ul className={styles.list} {...rest}>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          avatarSrc={comment.author.avatarUrl}
          author={comment.author.name}
          text={comment.text}
        />
      ))}
    </ul>
  )
}

export default CommentList
