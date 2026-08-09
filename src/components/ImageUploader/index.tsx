import type { ComponentProps, ReactNode } from 'react'
import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import Button from '../Button'
import FileItem from '../FileItem'
import styles from './ImageUploader.module.css'

type ImageUploaderProps = ComponentProps<'div'> & {
  name?: string
  fileName?: string
  placeholder?: ReactNode
}

interface Selected {
  file: File
  previewUrl: string
}

function ImageUploader({
  name,
  fileName,
  placeholder,
  ...rest
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [selected, setSelected] = useState<Selected | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setSelected({ file, previewUrl })
    }
  }

  const handleRemove = () => {
    setSelected(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={styles.imageUploader} {...rest}>
      {
        selected ? (
          <img
            src={selected.previewUrl} 
            className={styles.preview}
          />
        ) : (
          placeholder
        )

      }
      <input ref={inputRef} type="file" name={name} accept="image/*" hidden onChange={handleChange} />
      <Button
        variant="outline"
        type="button"
        icon={<Upload size={20} />}
        onClick={() => inputRef.current?.click()}
      >
        Carregar imagem
      </Button>
      {selected && <FileItem onRemove={handleRemove}>{selected.file.name}</FileItem>}
    </div>
  )
}

export default ImageUploader
