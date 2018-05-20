/**
 * this helpers convert a object filter to a string which can be understood by algolia
 *
 * it use this transformation :
 *
 * filter : {
 *   a : 1,
 *   b : [ 2, 3, 4 ]
 * }
 *
 * ==>
 *
 * ( a === 1 ) && ( b === 2 OR b === 3 OR b === 4 )
 *
 */

type Filters = { [string]: string[] }
type Filters_Loose = { [string]: string[] | string }

export const parseFilter = (x: string): Filters => {
  const filter = {}

  const r = /([\w\.\-]+):"([^"]+)"/g
  let m

  while ((m = r.exec(x))) {
    const [_, topic, key] = m
    ;(filter[topic] = filter[topic] || []).push(key)
  }

  return filter
}

export const formatFilter = (x: Filters_Loose): string =>
  Object.keys(x)
    .map(key =>
      (Array.isArray(x[key]) ? x[key] : [x[key]])
        .filter(Boolean)
        .map(value => `${key}:"${value}"`)
        .join(' OR ')
    )
    .filter(Boolean)
    .map(p => `( ${p} )`)
    .join(' AND ')
