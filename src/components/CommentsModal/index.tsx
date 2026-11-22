import { Send } from "lucide-react";
import type { FormEvent } from "react";
import Button from "../Button";
import CommentList from "../CommentList";
import Input from "../Input";
import Modal from "../Modal";
import type { Comment } from "../../services/comments";
import styles from "./CommentsModal.module.css";

type CommentsModalProps = {
  open?: boolean;
  onClose?: () => void;
  comments: Comment[];
  onComment: (text: string) => void | Promise<void>;
  loading?: boolean;
};

function CommentsModal({
  open,
  onClose,
  comments,
  onComment,
  loading = false,
}: CommentsModalProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const text = String(formData.get("comment") ?? "").trim();

    if (!text) {
      return;
    }

    await onComment(text);
    form.reset();
  }

  return (
    <Modal open={open} onClose={onClose} title="Comentários">
      {loading ? <div>Carregando comentários...</div> : <CommentList comments={comments} />}
      <form className={styles.composer} onSubmit={handleSubmit}>
        <Input name="comment" placeholder="Escreva um comentário..." />
        <Button
          type="submit"
          icon={<Send size={20} />}
          aria-label="Enviar comentário"
        />
      </form>
    </Modal>
  );
}

export default CommentsModal;
