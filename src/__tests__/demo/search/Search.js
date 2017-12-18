import React from 'react'
import { Typeahead } from 'react-simplest-typeahead'
import { StarCount } from './StarCount'
import { withAlgolia } from '../../../index'
import styled, { css } from 'react-emotion'

const renderOption = ({ option, isHighlighted, ...props }) => (
  <Option {...props} key={option.id} isHighlighted={isHighlighted}>
    <Title>{option.title}</Title>
    <Stars count={+option.vote_average} />
  </Option>
)

const Stars = styled(StarCount)`
  width: 100px;
  height: 20px;
  margin-left: auto;
`
const Title = styled.div``
const Option = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px 10px;
  cursor: pointer;
  background-color: ${props =>
    props.isHighlighted ? 'rgba(128,128,128,0.3)' : 'transparent'};
`

const SearchTypeahead = ({
  value,
  query,
  onQuerySearch,
  hits,
  onChange,
  ...props
}) => (
  <Typeahead
    value={value && value.title}
    pattern={query}
    options={hits}
    onChange={onChange}
    onPatternChange={onQuerySearch}
    placeholder="start to type ..."
    renderOption={renderOption}
    customClassName={customClassName}
  />
)

const customClassName = {
  typeahead: css`
    height: 80px;
    border-radius: 40px;
    background-color: #fff;
    padding: 15px 50px;
    width: 80%;
    max-width: 700px;
    box-shadow: 20px 20px 40px -10px rgba(0, 0, 0, 0.3);
  `,
  input: css`
    padding: 10px;
    font-size: 1.4em;
    border: none;
  `,
  options: css`
    top: 82px !important;
    width: calc(100% - 100px) !important;
  `,
}

const options = {
  indexName: 'movie',
  ALGOLIA_APP_ID: 'V4D8I8W4EI',
  ALGOLIA_API_KEY: '2812ccac3c1c922221c16cf495d0b5f8',
}

export const Search = withAlgolia(options)(SearchTypeahead)
