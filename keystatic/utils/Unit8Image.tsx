import { useEffect, useRef } from 'react'

type Props = {
  data: ArrayBuffer | globalThis.Uint8Array
}

export const Uint8Array = ({ data }: Props) => {
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(
    function createImageObjectUrl() {
      const blob = new Blob([new globalThis.Uint8Array(data)], { type: 'image/jpeg' })
      const objectUrl = URL.createObjectURL(blob)
      const image = imageRef.current
      if (image) {
        image.src = objectUrl
      }
      return function revokeImageObjectUrl() {
        URL.revokeObjectURL(objectUrl)
      }
    },
    [data],
  )

  return (
    <img
      ref={imageRef}
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        objectFit: 'cover',
      }}
      alt="Image Preview"
    />
  )
}
