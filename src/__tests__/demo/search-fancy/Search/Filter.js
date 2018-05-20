import React from 'react'
import { Tokenizer, injectFilterState } from 'react-simplest-typeahead'
import { parseFilter, formatFilter } from '../../../../util/parseFilter'
import styled, { css } from 'react-emotion'

const filtersOptions = [
  'Drama',
  'Comedy',
  'Thriller',
  'Action',
  'Romance',
  'Adventure',
  'Crime',
  'Science Fiction',
  'Horror',
  'Family',
  'Fantasy',
  'Mystery',
  'Animation',
  'History',
  'Music',
  'War',
  'Documentary',
  'Western',
]

const renderItem = ({ item, onDelete }) => (
  <Item key={item} onClick={onDelete}>
    {item}
    <span style={{ marginLeft: '10px' }}>×</span>
  </Item>
)
const Item = styled.div`
  cursor: pointer;
  height: 44px;
  padding: 0px 15px;
  border-radius: 20px;
  background-color: #eee;
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: 20px 20px 40px -10px rgba(0, 0, 0, 0.3);
`

const FilteredTokenizer = injectFilterState()(Tokenizer)

const format = genre => formatFilter({ genre: genre })
const parse = filters => parseFilter(filters)['genre'] || []

export const Filter = ({
  filters,
  onFiltersChange,
}: {
  filters: string,
  onFiltersChange: (filters: string) => void,
}) => (
  <FilteredTokenizer
    options={filtersOptions}
    value={parse(filters)}
    customClassName={customClassName}
    renderItem={renderItem}
    onChange={genre => onFiltersChange(format(genre))}
    placeholder="by genre"
  />
)

const customClassName = {
  values: css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 -10px;
    min-height: 64px;
  `,
  tokenizer: css`
    margin-bottom: 60px;
  `,
  typeahead: css`
    max-width: 300px;
    height: 46px;
    border-radius: 20px;
    background-color: #eee;
    padding: 4px 20px;
    box-shadow: 20px 20px 40px -10px rgba(0, 0, 0, 0.3);
  `,
  input: css`
    padding: 10px;
    font-size: 1em;
    border: none;
    background-color: transparent;
  `,
  options: css`
    top: 48px !important;
    width: calc(100% - 40px) !important;
  `,
}
