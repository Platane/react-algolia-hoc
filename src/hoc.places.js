import React from 'react'
import { debounce } from './util/debounce'
import algoliasearch from 'algoliasearch'

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
  onChange?: (o: Object) => void,
}

export type Config = {
  delay?: number,
  language?: string,
  hitsPerPage?: number,
  useDeviceLocation?: boolean,
  PLACES_APPID?: string,
  PLACES_APIKEY?: string,
}

export const withAlgoliaPlaces = ({
  PLACES_APIKEY,
  PLACES_APPID,
  hitsPerPage,
  delay,
  language,
  useDeviceLocation,
}: Config = {}) => {
  // parse option
  delay = Number.isFinite(delay) ? delay : 100
  hitsPerPage = Number.isFinite(hitsPerPage) ? hitsPerPage : 20
  useDeviceLocation = useDeviceLocation === true

  return C =>
    class SearchState extends React.Component<Props, State> {
      static defaultProps = {
        hitsPerPage,
        useDeviceLocation,
        language: language || 'en',
      }

      state: State = { pending: false, hits: [], query: '', userCoord: null }

      _places = null

      constructor(props: Props) {
        super(props)
        this._places = algoliasearch.initPlaces(PLACES_APPID, PLACES_APIKEY)

        this.doDebouncedSearch = debounce(delay)(this.doSearch)
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
        this.doDebouncedSearch.cancel()
      }

      onChange = (...args: *) => {
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
}
