import { useRef, useCallback, useEffect } from 'react'

export const randWeighted = (weights: Record<string, number>) => {
  const total = Object.values(weights).reduce((a, b) => a + b, 0)

  let rv = Math.random()
  for (let [item, weight] of Object.entries(weights)) {
    if (rv < weight / total) return item
    rv -= weight / total
  }

  return undefined as never
}

export const useAnimationFrame = (callback: (timeStamp: number) => unknown) => {
  const ref = useRef<number>()

  const animate = useCallback((timeStamp: number) => {
    callback(timeStamp)
    ref.current = requestAnimationFrame(animate)
  }, [callback])

  useEffect(() => {
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current!)
  }, [animate])
}

export const loadImage = (src: string) => new Promise((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve(image)
  image.onerror = reject
  image.src = src
})

export const randMinMax = (tuple: number | [number, number]) => {
  if (!Array.isArray(tuple)) return tuple
  const [min, max] = tuple
  if (max === undefined || max === null) return min
  return min + (Math.random() * (max - min))
}
