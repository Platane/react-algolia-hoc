import React from 'react'
import { withAlgoliaPlaces } from '../../../index'
import { parseAddress } from '../../../util/parseAddress'

const formatAddress = ({ street, city }) => street + ', ' + city

const App_ = ({ query, onQueryChange, hits }) => (
  <div>
    <input
      type="text"
      value={query}
      onChange={e => onQueryChange(e.target.value)}
    />
    <ul>
      {hits
        .map(parseAddress)
        .map((x, i) => <li key={i}>{formatAddress(x)}</li>)}
    </ul>
  </div>
)

export const App = withAlgoliaPlaces({
  useDeviceLocation: true,
  hitsPerPage: 5,
})(App_)
