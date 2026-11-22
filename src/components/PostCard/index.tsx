import { useState, type ComponentProps } from "react";
import {
  Flame,
  Footprints,
  HeartPulse,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { createComment, getComments, type Comment } from "../../services/comments";
import { likePost, unLikePost } from "../../services/posts";
import Avatar from "../Avatar";
import CommentsModal from "../CommentsModal";
import ImagePlaceholder from "../ImagePlaceholder";
import StatChip from "../StatChip";
import Tag from "../Tag";
import Text from "../Text";
import styles from "./PostCard.module.css";

type PostCardProps = ComponentProps<"article"> & {
  imageUrl?: string | null;
  time: string;
  activity: string;
  distance: string;
  calories: string;
  heartRate: string;
  author: string;
  avatarSrc?: string | null;
  likes: number;
  liked: boolean;
  comments: string | number;
  description: string;
  id: string;
  onLikeChange?: (liked: boolean) => void;
};

function PostCard({
  imageUrl,
  time,
  activity,
  distance,
  calories,
  heartRate,
  author,
  avatarSrc,
  comments,
  description,
  likes: likesInitial,
  liked: likedInitial,
  id,
  onLikeChange,
  ...rest
}: PostCardProps) {
  const [likes, setLikes] = useState(likesInitial);
  const [liked, setLiked] = useState(likedInitial);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(Number(comments));
  const [commentsLoading, setCommentsLoading] = useState(false);

  async function handleLike() {
    try {
      if (liked) {
        await unLikePost(id);
        setLiked(false);
        setLikes((previousLikes) => previousLikes - 1);
        onLikeChange?.(false);
      } else {
        await likePost(id);
        setLiked(true);
        setLikes((previousLikes) => previousLikes + 1);
        onLikeChange?.(true);
      }
    } catch (error) {
      console.error("Error occurred while liking/unliking post:", error);
    }
  }

  async function handleOpenComments() {
    setCommentsOpen(true);
    setCommentsLoading(true);

    try {
      const fetchedComments = await getComments(id);
      setCommentsList(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  }

  async function handleComment(text: string) {
    const createdComment = await createComment(id, text);
    setCommentsList((previousComments) => [
      ...previousComments,
      createdComment,
    ]);
    setCommentsCount((previousCount) => previousCount + 1);
  }

  return (
    <article className={styles.postCard} {...rest}>
      {imageUrl ? (
        <img className={styles.image} src={imageUrl} alt="" />
      ) : (
        <ImagePlaceholder />
      )}
      <div className={styles.content}>
        <p className={styles.timeLabel}>Tempo:</p>
        <p className={styles.time}>{time}</p>
        <Tag>{activity}</Tag>
        <div className={styles.stats}>
          <StatChip
            icon={<Footprints size={16} />}
            label="Distância"
            value={distance}
          />
          <StatChip
            icon={<Flame size={16} />}
            label="Calorias"
            value={calories}
          />
          <StatChip
            icon={<HeartPulse size={16} />}
            label="Batimentos"
            value={heartRate}
          />
        </div>
        <div className={styles.author}>
          <Avatar src={avatarSrc} />
          <Text>{author}</Text>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.reactions}>
          <button
            type="button"
            className={liked ? `${styles.reaction} ${styles.liked}` : styles.reaction}
            onClick={handleLike}
          >
            <ThumbsUp size={20} />
            {likes}
          </button>
          <button
            type="button"
            className={styles.reaction}
            onClick={handleOpenComments}
          >
            <MessageSquare size={20} />
            {commentsCount}
          </button>
        </div>
        <Text>{description}</Text>
      </footer>
      <CommentsModal
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        comments={commentsList}
        onComment={handleComment}
        loading={commentsLoading}
      />
    </article>
  );
}

export default PostCard;
