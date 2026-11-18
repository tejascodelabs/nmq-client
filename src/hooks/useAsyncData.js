import { useCallback, useEffect, useState } from 'react'

export function useAsyncData(loader) {
  const [state, setState] = useState({ data: null, loading: true, error: '' })
  const [version, setVersion] = useState(0)
  const refresh = useCallback(() => {
    setState(current => ({ ...current, loading: true, error: '' }))
    setVersion(current => current + 1)
  }, [])

  useEffect(() => {
    let active = true
    Promise.resolve().then(loader).then(data => {
      if (active) setState({ data, loading: false, error: '' })
    }).catch(error => {
      if (active) setState({ data: null, loading: false, error: error.message || 'Something went wrong.' })
    })
    return () => { active = false }
  }, [loader, version])

  return { ...state, refresh }
}
