import type { ChangeEvent, ComponentProps, ReactNode } from 'react'
import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import Button from '../Button'
import FileItem from '../FileItem'
import styles from './ImageUploader.module.css'

type ImageUploaderProps = ComponentProps<'div'> & {
  name?: string
  fileName?: string
  placeholder?: ReactNode
  onRemoveExisting?: () => void
  onSelectImage?: (file: File | null) => void
  removeName?: string
}

type SelectedImage = {
  file: File
  previewUrl: string
}

function ImageUploader({
  name,
  fileName,
  placeholder,
  onRemoveExisting,
  onSelectImage,
  removeName,
  ...rest
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<SelectedImage | null>(null)
  const [removed, setRemoved] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setRemoved(false)
    onSelectImage?.(file)
    setSelected({
      file,
      previewUrl: URL.createObjectURL(file),
    })
  }

  function handleRemove() {
    if (selected) {
      URL.revokeObjectURL(selected.previewUrl)
      setSelected(null)
      onSelectImage?.(null)
    } else {
      setRemoved(true)
      onRemoveExisting?.()
    }

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={styles.imageUploader} {...rest}>
      {selected ? (
        <img className={styles.preview} src={selected.previewUrl} alt="Pré-visualização do avatar" />
      ) : (
        placeholder
      )}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        hidden
        onChange={handleChange}
      />
      {removeName && (
        <input type="hidden" name={removeName} value={removed ? "true" : "false"} />
      )}
      <Button
        variant="outline"
        type="button"
        icon={<Upload size={20} />}
        onClick={() => inputRef.current?.click()}
      >
        Carregar imagem
      </Button>
      {fileName && !removed && (
        <FileItem onRemove={handleRemove}>
          {selected?.file.name || fileName}
        </FileItem>
      )}
      {selected && !fileName && (
        <FileItem onRemove={handleRemove}>{selected.file.name}</FileItem>
      )}
    </div>
  )
}

export default ImageUploader
