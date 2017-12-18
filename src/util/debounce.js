
export const debounce = ( delay:number = 0 ) => ( fn : (*) => void ) => {
  let pending = null
  let _args = []

  const exec = () => fn(..._args)

  const out = (...args : *) => {
    _args = args
    clearTimeout(pending)
    pending = setTimeout(exec, delay)
  }

  out.cancel = () => clearTimeout(pending)

  return out
}
