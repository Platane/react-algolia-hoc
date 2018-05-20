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
      onChange={x => {
        onChange(x)
        onQueryChange('')
      }}
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
  indexName: 'movies',
  ALGOLIA_APP_ID: 'latency',
  ALGOLIA_API_KEY: '6be0576ff61c053d5f9a3225e2a90f76',
}

export const Search = withAlgolia(config)(SearchComponent)
