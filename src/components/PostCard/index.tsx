import { useEffect, useState, type ComponentProps } from 'react'
import {
  Flame,
  Footprints,
  HeartPulse,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react'
import Avatar from '../Avatar'
import CommentsModal from '../CommentsModal'
import ImagePlaceholder from '../ImagePlaceholder'
import StatChip from '../StatChip'
import Tag from '../Tag'
import Text from '../Text'
import styles from './PostCard.module.css'
import { likePost, unlikePost } from '../../services/posts'
import { createComment, getComments, type Comment } from '../../services/comment'

type PostCardProps = ComponentProps<'article'> & {
  imageUrl?: string | null
  time: string
  activity: string
  distance: string
  calories: string
  heartRate: string
  author: string
  avatarSrc?: string
  likes: number
  commentsCount: number
  description: string
  liked: boolean
  id: string
}

function PostCard({
  imageUrl,
  time,
  activity,
  distance,
  calories,
  heartRate,
  author,
  avatarSrc,
  likes: likesInitial,
  commentsCount: commentsCountInitial,
  description,
  liked: likedInitial,
  id,
  ...rest
}: PostCardProps) {

  const [likes, setLikes] = useState<number>(likesInitial)
  const [liked, setLiked] = useState(likedInitial)

  // o card é o dono dos comentários: a modal só exibe e avisa quando tem um novo
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsCount, setCommentsCount] = useState<number>(commentsCountInitial)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [loadingComments, setLoadingComments] = useState(false)

  useEffect(() => {
    // só busca quando a modal abre, para não disparar um request por card do feed
    if (!commentsOpen) return

    async function loadComments() {
      setLoadingComments(true)

      try {
        const comments = await getComments(id)
        setComments(comments)
      } catch (error) {
        console.error('Error loading the comments:', error)
      } finally {
        setLoadingComments(false)
      }
    }

    loadComments()
  }, [commentsOpen, id])

  async function handleComment(text: string) {
    try {
      const comment = await createComment(id, text)
      setComments((prevComments) => [...prevComments, comment])
      setCommentsCount((prevCount) => prevCount + 1)
    } catch (error) {
      console.error('Error creating the comment:', error)
    }
  }

  async function handleLike() {

    try {

      if (liked) {
        await unlikePost(id)
        setLiked(false)
        setLikes((prevLikes) => prevLikes - 1)
      } else {
        await likePost(id)
        setLiked(true)
        setLikes((prevLikes) => prevLikes + 1)
      }

    }
    catch (error) {
      console.error('Error liking the post:', error)
    }


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
            value={distance + " Km"}
          />
          <StatChip
            icon={<Flame size={16} />}
            label="Calorias"
            value={calories + " Kcal"}
          />
          <StatChip
            icon={<HeartPulse size={16} />}
            label="Batimentos"
            value={heartRate + " BPM"}
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
            onClick={() => setCommentsOpen(true)}
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
        comments={comments}
        loading={loadingComments}
        onComment={handleComment}
      />
    </article>
  )
}

export default PostCard
