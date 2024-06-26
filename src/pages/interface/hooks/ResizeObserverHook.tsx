import { useEffect, useState } from 'react'

function useResizeObserver(ref) {
  const [dimensions, setDimensions] = useState(null)

  useEffect(() => {
    const observeTarget = ref.current
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect)
      })
    })

    if (observeTarget) {
      resizeObserver.observe(observeTarget)
    }

    return () => {
      if (observeTarget) {
        resizeObserver.unobserve(observeTarget)
      }
    }
  }, [ref])

  return dimensions
}

export default useResizeObserver
