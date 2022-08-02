import { useRef, useCallback, useEffect } from 'react'

export const chooseWeighted = (weights, x) => {
  if (x < 0 || x > 1) throw new Error('x value must be 0-1')
  const total = Object.values(weights).reduce((a, b) => a + b, 0)

  let rv = x
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
