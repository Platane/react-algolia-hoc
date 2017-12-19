import React from 'react'
import { Tokenizer, injectFilterState } from 'react-simplest-typeahead'
import { parseFilter, formatFilter } from '../../../../util/parseFilter'
import styled, { css } from 'react-emotion'

const filtersOptions = [
  'Drama', //2297,
  'Comedy', //1722,
  'Thriller', //1274,
  'Action', //1154,
  'Romance', //894,
  'Adventure', //790,
  'Crime', //696,
  'Science Fiction', //535,
  'Horror', //519,
  'Family', //513,
  'Fantasy', //424,
  'Mystery', //348,
  'Animation', //234,
  'History', //197,
  'Music', //185,
  'War', //144,
  'Documentary', //110,
  'Western', //82,
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

const format = genres => formatFilter({ genres: genres })
const parse = filters => parseFilter(filters)['genres'] || []

export const Filter = ({ filters, onFiltersChange }) => (
  <FilteredTokenizer
    options={filtersOptions}
    value={parse(filters)}
    customClassName={customClassName}
    renderItem={renderItem}
    onChange={genres => onFiltersChange(format(genres))}
    placeholder="by genres"
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
