import React from 'react'
import { Typeahead } from 'react-simplest-typeahead'
import { SearchBar } from './SearchBar'
import { Filter } from './Filter'
import { withAlgolia } from '../../../../index'
import styled from 'react-emotion'

const SearchComponent = ({
  value,
  hits,
  onChange,
  query,
  onQueryChange,
  filters,
  onFiltersChange,
}) => (
  <Container>
    <Filter filters={filters} onFiltersChange={onFiltersChange} />
    <SearchBar
      hits={hits}
      value={value}
      onChange={onChange}
      query={query}
      onQueryChange={onQueryChange}
    />
  </Container>
)

const Container = styled.div`
  width: 80%;
  max-width: 700px;
`

const config = {
  hitsPerPage: 10,
  delay: 100,
  indexName: 'movie',
  ALGOLIA_APP_ID: 'V4D8I8W4EI',
  ALGOLIA_API_KEY: '2812ccac3c1c922221c16cf495d0b5f8',
}

export const Search = withAlgolia(config)(SearchComponent)
