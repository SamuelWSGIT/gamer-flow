import { Send } from 'lucide-react'
import Button from '../Button'
import CommentList from '../CommentList'
import Input from '../Input'
import Modal from '../Modal'
import type { Comment } from '../../services/comment'
import styles from './CommentsModal.module.css'

type CommentsModalProps = {
  open?: boolean
  onClose?: () => void
  comments: Comment[]
  loading?: boolean
  onComment: (text: string) => void | Promise<void>
}

function CommentsModal({
  open,
  onClose,
  comments,
  loading = false,
  onComment,
}: CommentsModalProps) {

  // action recebe o FormData do próprio form: nada de preventDefault
  async function handleSubmit(formData: FormData) {
    const text = String(formData.get('comment') ?? '').trim()

    if (!text) return

    await onComment(text)
  }

  return (
    <Modal open={open} onClose={onClose} title="Comentários">
      {loading ? (
        <div>Carregando comentários...</div>
      ) : (
        <CommentList comments={comments} />
      )}
      <form className={styles.composer} action={handleSubmit}>
        <Input name="comment" placeholder="Escreva um comentário..." />
        <Button
          type="submit"
          icon={<Send size={20} />}
          aria-label="Enviar comentário"
        />
      </form>
    </Modal>
  )
}

export default CommentsModal
