import { useEffect, useMemo } from 'react'

type Props = {
  data: any
}

export const Uint8Array = ({ data }: Props) => {
  const imageUrl = useMemo(() => {
    const blob = new Blob([data], { type: 'image/jpeg' })
    return URL.createObjectURL(blob)
  }, [data])

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  return imageUrl ? (
    <img
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        objectFit: 'cover',
      }}
      src={imageUrl}
      alt="Image Preview"
    />
  ) : null
}
