import React from 'react'
import { debounce } from './util/debounce'
import algoliasearch from 'algoliasearch'

export type State = {
  pending: boolean,
  query: string,
  filters: string | null,
  hits: *[],
}

export type Props = {
  index: string,
}

export type Option = {
  indexName?: string,
  ALGOLIA_APP_ID: string,
  ALGOLIA_API_KEY: string,
}

export const withAlgolia = ({
  indexName,
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY,
}: Option) => (C: React.Component) =>
  class SearchState extends React.Component {
    static defaultProps = {
      indexName: indexName,
    }

    _index = null

    state: State = { pending: false, filters: null, hits: [], query: '' }

    constructor(props) {
      super(props)

      const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)

      this._index = client.initIndex(this.props.indexName)

      this.doDebouncedSearch = debounce(100)(this.doSearch)
    }

    componentDidMount() {
      this.onQuerySearch('')
    }

    onChange = (...args) => {
      this.onQuerySearch('')
      this.props.onChange && this.props.onChange(...args)
    }

    doSearch = async () => {
      const { filters, query } = this.state

      const searchParam = {
        query,
      }

      if (filters) searchParam.filters = filters

      const { hits } = await this._index.search(searchParam)

      // if the search param have changed since the async call, ignore
      if (query !== this.state.query || filters !== this.state.filters) return

      this.setState({ pending: false, hits })
    }

    onQuerySearch = (query: string) => {
      this.setState({ pending: true, query }, this.doDebouncedSearch)
    }

    onFiltersChange = (filters: Filters) => {
      this.setState({ pending: true, filters }, this.doSearch)
    }

    render() {
      return (
        <C
          {...this.props}
          {...this.state}
          onChange={this.onChange}
          onQuerySearch={this.onQuerySearch}
          onFiltersChange={this.onFiltersChange}
        />
      )
    }
  }
