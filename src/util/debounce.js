export const debounce = (delay: number = 0) => (fn: Function) => {
  let pending = null

  const out = () => {
    clearTimeout(pending)
    pending = setTimeout(fn, delay)
  }

  out.cancel = () => clearTimeout(pending)

  return out
}
