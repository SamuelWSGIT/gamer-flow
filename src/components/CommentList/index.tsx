import Comment from "../Comment";
import EmptyState from "../EmptyState";
import type { Comment as ApiComment } from "../../services/comments";
import styles from "./CommentList.module.css";

type CommentListProps = {
  comments: ApiComment[];
};

function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <EmptyState
        title="Nenhum comentário ainda..."
        description="Seja a primeira pessoa a comentar neste treino."
      />
    );
  }

  return (
    <ul className={styles.list}>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          avatarSrc={comment.author.avatarUrl || "https://i.pravatar.cc/96?img=68"}
          author={comment.author.name}
          text={comment.text}
        />
      ))}
    </ul>
  );
}

export default CommentList;
