type Filters = { [string]: string[] | string }

export const parseFilter = (x: string): Filters => {
  const filter = {}

  const r = /([\w\.\-]+):([\w\.\-]+)/g
  let m

  while ((m = r.exec(x))) {
    const [_, topic, key] = m
    ;(filter[topic] = filter[topic] || []).push(key)
  }

  return filter
}

export const formatFilter = (x: Filters): string =>
  Object.keys(x)
    .map(key =>
      (Array.isArray(x[key]) ? x[key] : [x[key]])
        .map(value => `${key}:${value}`)
        .join(' OR ')
    )
    .map(p => `( ${p} )`)
    .join(' AND ')
