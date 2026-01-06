/**
 * Polyfill for useEffectEvent which was removed from React 19
 * This provides a compatible implementation for Sanity Studio
 */
const { useRef, useEffect, useCallback } = require('react')

function useEffectEvent(callback) {
  const callbackRef = useRef(callback)
  
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  
  return useCallback(
    (...args) => {
      return callbackRef.current(...args)
    },
    []
  )
}

module.exports = { useEffectEvent }

