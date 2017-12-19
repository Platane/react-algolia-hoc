import React from 'react'
import { debounce } from './util/debounce'
import algoliasearch from 'algoliasearch'

const getUserCoord = () =>
  new Promise((reject, resolve) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  )

export type State = {
  pending: boolean,
  query: string,
  hits: *[],
  userCoord: string | null,
}

export type Props = {
  language: string,
  useDeviceLocation: boolean,
}

export type Config = {
  hitsPerPage: number,
  PLACES_APPID?: string,
  PLACES_APIKEY?: string,
}

export const withAlgoliaPlaces = ({
  PLACES_APIKEY,
  PLACES_APPID,
  hitsPerPage,
}: Config = {}) => C =>
  class SearchState extends React.Component<Props, State> {
    static defaultProps = {
      language: 'en',
      useDeviceLocation: false,
      hitsPerPage: hitsPerPage || 5,
    }

    state: State = { pending: false, hits: [], query: '', userCoord: null }

    _places = null

    constructor(props: Props) {
      super(props)
      this._places = algoliasearch.initPlaces(PLACES_APPID, PLACES_APIKEY)

      this.doDebouncedSearch = debounce(100)(this.doSearch)
    }

    async getDeviceLocation() {
      try {
        const { latitude, longitude } = await getUserCoord()
        if (latitude && longitude)
          this.setState({ userCoord: `${latitude},${longitude}` })
      } catch (err) {
        // silent error,
        // which can happend for various reason, moslty because the geoloc is not implemented in this env
      }
    }

    componentDidMount() {
      if (this.props.useDeviceLocation) this.getDeviceLocation()
    }

    componentWillUnmount() {
      this.setState({ query: '' })
      this.doSearch.cancel()
    }

    onChange = (...args) => {
      this.onQueryChange('')
      if (this.props.onChange) this.props.onChange(...args)
    }

    doSearch = async () => {
      const { query, userCoord } = this.state

      const searchParam = {
        query: query,
        language: this.props.language,
        hitsPerPage: this.props.hitsPerPage,
        type: 'address',
      }

      if (userCoord) searchParam.aroundLatLng = userCoord

      const { hits } = await this._places.search(searchParam)

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
          onChange={this.onChange}
          onQueryChange={this.onQueryChange}
        />
      )
    }
  }
