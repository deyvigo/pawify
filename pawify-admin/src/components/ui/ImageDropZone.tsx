import { useState, useRef, useCallback, type DragEvent, type ChangeEvent, useEffect } from 'react'

interface ImageEntry {
  id: number
  file: File
  previewUrl: string
}

interface ImageDropzoneProps {
  onChange?: (files: File[]) => void
}

export default function ImageDropZone({ onChange }: ImageDropzoneProps) {
  const [images, setImages] = useState<ImageEntry[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const entries: ImageEntry[] = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .map((file) => ({ id: Date.now() + Math.random(), file, previewUrl: URL.createObjectURL(file) }))

      setImages((prev) => [...prev, ...entries])
  }, [onChange])

  const remove = useCallback((id: number) => {
    setImages((prev) => {
      const entry = prev.find((e) => e.id === id)
      if (entry) URL.revokeObjectURL(entry.previewUrl)
      return prev.filter((e) => e.id !== id)
    })
  }, [onChange])

  useEffect(() => {
    onChange?.(images.map((e) => e.file))
  }, [images])

  const onDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(false) }
  const onDrop = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }
  const onChange_ = (e: ChangeEvent<HTMLInputElement>) => { addFiles(e.target.files); e.target.value = "" }

  return (
    <>
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Zona de carga de imágenes"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          border: `1.5px dashed ${dragging ? "var(--color-border-primary)" : "var(--color-border-secondary)"}`,
          borderRadius: "var(--border-radius-lg)",
          background: dragging ? "var(--color-background-secondary)" : "var(--color-background-primary)",
          padding: "2rem",
          textAlign: "center",
          cursor: "pointer",
          transition: "background 0.15s, border-color 0.15s",
          outline: "none",
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={onChange_} />
        <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
          {dragging ? "Suelta las imágenes" : "Arrastra imágenes aquí"}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-tertiary)" }}>
          o haz clic para seleccionar
        </p>
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {images.map((entry) => (
            <div key={entry.id} style={{ position: "relative" }}>
              <img
                src={entry.previewUrl}
                alt={entry.file.name}
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)", display: "block" }}
              />
              <button
                onClick={() => remove(entry.id)}
                aria-label={`Eliminar ${entry.file.name}`}
                style={{
                  position: "absolute", top: 4, right: 4,
                  width: 20, height: 20,
                  background: "rgba(0,0,0,0.55)", color: "#fff",
                  border: "none", borderRadius: "50%",
                  fontSize: 11, lineHeight: 1,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}