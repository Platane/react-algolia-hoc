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
  index?: string,
  onChange?: (*) => void,
}

export type Config = {
  delay?: number,
  hitsPerPage?: number,
  indexName?: string,
  ALGOLIA_APP_ID: string,
  ALGOLIA_API_KEY: string,
}

export const withAlgolia = ({
  hitsPerPage,
  delay,
  indexName,
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY,
}: Config = {}) => {
  // parse option
  delay = Number.isFinite(delay) ? delay : 100
  hitsPerPage = Number.isFinite(hitsPerPage) ? hitsPerPage : 20

  return C =>
    class SearchState extends React.Component<Props, State> {
      static defaultProps = {
        indexName: indexName,
      }

      _index = null

      doDebouncedSearch = null

      state: State = { pending: false, filters: null, hits: [], query: '' }

      constructor(props: Props) {
        super(props)

        const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)

        this._index = client.initIndex(this.props.indexName)

        this.doDebouncedSearch = debounce(delay)(this.doSearch)
      }

      componentDidMount() {
        this.onQueryChange('')
      }

      componentWillUnmount() {
        this.doDebouncedSearch.cancel()
      }

      onChange = (...args: *) => {
        this.onQueryChange('')
        if (this.props.onChange) this.props.onChange(...args)
      }

      doSearch = async () => {
        const { filters, query } = this.state

        const searchParam = {
          query,
          hitsPerPage,
        }

        if (filters) searchParam.filters = filters

        const { hits } = await this._index.search(searchParam)

        // if the search param have changed since the async call, ignore
        if (query !== this.state.query || filters !== this.state.filters) return

        this.setState({ pending: false, hits })
      }

      onQueryChange = (query: string) => {
        this.setState({ pending: true, query }, this.doDebouncedSearch)
      }

      onFiltersChange = (filters: string) => {
        this.setState({ pending: true, filters }, this.doSearch)
      }

      render() {
        return (
          <C
            {...this.props}
            {...this.state}
            onChange={this.onChange}
            onQueryChange={this.onQueryChange}
            onFiltersChange={this.onFiltersChange}
          />
        )
      }
    }
}
