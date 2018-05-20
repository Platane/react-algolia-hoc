import React from 'react'
import { debounce } from './util/debounce'
import algoliasearch from 'algoliasearch'
import type { ComponentType } from 'react'

export type State = {
  pending: boolean,
  query: string,
  filters: string | null,
  hits: *[],
  nbHits: number,
  haveMore: boolean,
  nextPage: number,
}

export type Props = {
  indexName?: string,
}

export type Config = {
  delay?: number,
  hitsPerPage?: number,
  indexName?: string,
  ALGOLIA_APP_ID: string,
  ALGOLIA_API_KEY: string,
}

export type AlgoliaParam = {
  hitsPerPage?: number,
  filters?: string,
  query?: string,
  page?: number,
}

export type ChildProps = {}

export const withAlgolia = ({
  indexName,
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY,
  ...c
}: Config = {}) => {
  // parse option
  const delay = c.delay !== undefined ? c.delay : 100
  const hitsPerPage = c.hitsPerPage !== undefined ? c.hitsPerPage : 20

  return (C: ComponentType<*>) =>
    class SearchState extends React.Component<Props, State> {
      static defaultProps = {
        indexName: indexName,
      }

      _index: * = null

      doDebouncedSearch: * = null

      state: State = {
        pending: false,
        filters: null,
        hits: [],
        nbHits: 0,
        query: '',
        haveMore: false,
        nextPage: 0,
      }

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

      doSearch = async () => {
        const { filters, query, nextPage } = this.state

        // build the algolia search params
        const searchParam: AlgoliaParam = {
          query,
          hitsPerPage,
          page: nextPage,
        }
        if (filters) searchParam.filters = filters

        // await result
        const { hits, nbHits, nbPages, page } = await this._index.search(
          searchParam
        )

        // if the search param have changed since the async call, ignore
        if (
          query !== this.state.query ||
          filters !== this.state.filters ||
          nextPage !== this.state.nextPage
        )
          return

        // if it's a load more call, merge with the previous results
        if (page > 0) hits.unshift(...this.state.hits)

        this.setState({
          pending: false,
          hits,
          nbHits,
          nextPage: page + 1,
          haveMore: page + 1 < nbPages,
        })
      }

      onQueryChange = (query: string) => {
        this.setState(
          { pending: true, nextPage: 0, query },
          this.doDebouncedSearch
        )
      }

      onFiltersChange = (filters: string) => {
        this.setState({ pending: true, nextPage: 0, filters }, this.doSearch)
      }

      loadMore = () => this.setState({ pending: true }, this.doSearch)

      render() {
        return (
          <C
            {...this.props}
            {...this.state}
            loadMore={this.loadMore}
            onQueryChange={this.onQueryChange}
            onFiltersChange={this.onFiltersChange}
          />
        )
      }
    }
}
