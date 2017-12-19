import React from 'react'
import { Typeahead } from 'react-simplest-typeahead'
import { StarCount } from '../StarCount'
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

export const SearchBar = ({ value, onChange, hits, query, onQueryChange }) => (
  <Typeahead
    value={value && value.title}
    pattern={query}
    options={hits}
    onChange={onChange}
    onPatternChange={onQueryChange}
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
