import React from 'react'
import { debounce } from './util/debounce'
import algoliasearch from 'algoliasearch'
import type { ComponentType } from 'react'

const getUserCoord = (): Promise<{ latitude: number, longitude: number }> =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(x => resolve(x.coords), reject)
  )

export type State = {
  pending: boolean,
  query: string,
  hits: *[],
  userCoord: string | null,
}

export type Props = {
  language?: string,
  hitsPerPage?: number,
  useDeviceLocation?: boolean,
}

export type Config = {
  delay?: number,
  language?: string,
  hitsPerPage?: number,
  useDeviceLocation?: boolean,
  PLACES_APPID?: string,
  PLACES_APIKEY?: string,
}

export type AlgoliaParam = {
  hitsPerPage?: number,
  query?: string,
  page?: number,
  language?: string,
  aroundLatLng?: string,
  type?: string,
}

export const withAlgoliaPlaces = ({
  PLACES_APIKEY,
  PLACES_APPID,
  ...c
}: Config = {}) => {
  // parse option
  const delay = c.delay !== undefined ? c.delay : 100
  const hitsPerPage = c.hitsPerPage !== undefined ? c.hitsPerPage : 20
  const useDeviceLocation = c.useDeviceLocation === true
  const language = c.language || 'en'

  return (C: ComponentType<*>) =>
    class SearchState extends React.Component<Props, State> {
      static defaultProps = {
        hitsPerPage,
        useDeviceLocation,
        language: language || 'en',
      }

      _places: * = null

      doDebouncedSearch: * = null

      state: State = { pending: false, hits: [], query: '', userCoord: null }

      constructor(props: Props) {
        super(props)
        this._places = algoliasearch.initPlaces(PLACES_APPID, PLACES_APIKEY)

        this.doDebouncedSearch = debounce(delay)(this.doSearch)
      }

      async getDeviceLocation() {
        const { latitude, longitude } = await getUserCoord()
          // silent error,
          // which can happend for various reason, moslty because the geoloc is not implemented in this env
          .catch(err => ({}))

        if (latitude && longitude)
          this.setState({ userCoord: `${latitude},${longitude}` })
      }

      componentDidMount() {
        if (this.props.useDeviceLocation) this.getDeviceLocation()
      }

      componentWillUnmount() {
        // this.setState({ query: '' })
        this.doDebouncedSearch.cancel()
      }

      doSearch = async () => {
        const { query, userCoord } = this.state

        // build the algolia search params
        const searchParam: AlgoliaParam = {
          query: query,
          language: this.props.language,
          hitsPerPage: this.props.hitsPerPage,
          type: 'address',
        }
        if (userCoord) searchParam.aroundLatLng = userCoord

        // await result
        const { hits } = await this._places.search(searchParam)

        // if the search param have changed since the async call, ignore
        if (query !== this.state.query) return

        this.setState({ pending: false, hits })
      }

      onQueryChange = async (query: string) => {
        this.setState({ pending: true, query }, this.doDebouncedSearch)
      }

      render() {
        return (
          <C
            {...this.props}
            {...this.state}
            onQueryChange={this.onQueryChange}
          />
        )
      }
    }
}
