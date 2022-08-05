import { useRef, useCallback, useEffect } from 'react'

export const randWeighted = weights => {
  const total = Object.values(weights).reduce((a, b) => a + b, 0)

  let rv = Math.random()
  for (let [item, weight] of Object.entries(weights)) {
    if (rv < weight / total) return item
    rv -= weight / total
  }
}

export const useAnimationFrame = callback => {
  const ref = useRef()

  const animate = useCallback(timeStamp => {
    callback(timeStamp)
    ref.current = requestAnimationFrame(animate)
  }, [callback])

  useEffect(() => {
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [animate])
}

export const loadImage = src => new Promise((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve(image)
  image.onerror = reject
  image.src = src
})

export const randMinMax = tuple => {
  if (!Array.isArray(tuple)) return tuple
  const [min, max] = tuple
  if (max === undefined || max === null) return min
  return min + (Math.random() * (max - min))
}
