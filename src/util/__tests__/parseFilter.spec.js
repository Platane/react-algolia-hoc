/* global jest */
import { parseFilter, formatFilter } from '../parseFilter'

it('should parse / format empty filter', () => {
  expect(parseFilter('')).toEqual({})
  expect(parseFilter(formatFilter({}))).toEqual({})

  expect(formatFilter({})).toEqual('')
  expect(formatFilter({ a: [] })).toEqual('')
})

it('should parse / format basic filter', () => {
  const filters = {
    genres: ['a', 'b'],
    color: ['blue', 'red'],
  }

  const a = '(genres:"a" OR genres:"b") AND (color:"blue" OR color:"red")'

  expect(parseFilter(a)).toEqual(filters)
  expect(parseFilter(formatFilter(filters))).toEqual(filters)
})

it('should parse / format basic filter with special char in value', () => {
  const filters = {
    'genres.name': ['a', 'b a'],
    color: ['blue', 'red @-\\012_'],
  }

  const a =
    '(genres.name:"a" OR genres.name:"b a") AND (color:"blue" OR color:"red @-\\012_")'

  expect(parseFilter(a)).toEqual(filters)
  expect(parseFilter(formatFilter(filters))).toEqual(filters)
})
