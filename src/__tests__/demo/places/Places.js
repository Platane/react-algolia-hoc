import React from 'react'
import { Typeahead } from 'react-simplest-typeahead'
import { withAlgoliaPlaces } from '../../../index'
import { parseAddress } from '../../../util/parseAddress'

import styled, { css } from 'react-emotion'

const formatAddress = ({ street, city }) => street + ', ' + city

const renderOption = ({ option, isHighlighted, ...props }) => (
  <Option {...props} key={option.objectID} isHighlighted={isHighlighted}>
    <Icon />
    {formatAddress(parseAddress(option))}
  </Option>
)

const Option = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px 10px;
  cursor: pointer;
  background-color: ${props =>
    props.isHighlighted ? 'rgba(128,128,128,0.3)' : 'transparent'};
`

const Icon = () => (
  <svg
    viewBox="0 0 100 100"
    style={{ width: '20px', height: '20px', margin: '0 10px' }}
  >
    <path d="M48.9 0A36 36 0 0 0 16 50.7C25 70.3 42.3 91 47.3 97a2 2 0 0 0 3 0 227 227 0 0 0 31.4-46.3A36 36 0 0 0 48.9 0zm0 54.7a18.7 18.7 0 1 1 0-37.5 18.7 18.7 0 0 1 0 37.5z" />
  </svg>
)

const SearchPlacesTypeahead = ({
  value,
  query,
  onQueryChange,
  hits,
  onChange,
  ...props
}) => (
  <Typeahead
    value={value && formatAddress(parseAddress(value))}
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

const config = {
  useDeviceLocation: true,
  hitsPerPage: 5,
}

export const Places = withAlgoliaPlaces(config)(SearchPlacesTypeahead)
