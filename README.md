# react-algolia-hoc

Simple higher order component to use with [Algolia search engine](https://www.algolia.com/).

Also works great with [Algolia Places](https://blog.algolia.com/introducing-algolia-places/).

[![npm](https://img.shields.io/npm/v/react-algolia-hoc.svg)](https://www.npmjs.com/package/react-algolia-hoc)

# Demo

Some examples with fancy styling

* [search movies](https://platane.github.io/react-algolia-hoc/search-fancy.html)
* [search address](https://platane.github.io/react-algolia-hoc/places-fancy.html)

... or others more bare bone with less noise.

* [search movies basic](https://platane.github.io/react-algolia-hoc/search-basic.html)
* [search address basic](https://platane.github.io/react-algolia-hoc/places-basic.html)

# Motivation

Algolia provides an awesome library of component to build on top of their API.

This is a great option to consider, but you may want to use just what you need.

> Also you might find the module hard to integrate with your tool chain.
>
> Especially algolia places which bundles a lot of stuff ( including a version of jQuery :{ ). Pretty bad for ssr.

# Usage

The hoc holds the query in it's state, it provides a way to change it, and will request the results when it does change.

```javascript
import { withAlgolia } from 'react-algolia-hoc'

// dumb component,
// expect to receive a list of hit, a callback to change the query, and the current query
const App = ({ hits, query, onQueryChange }) => (
  <div>
    <input
      type="text"
      value={query}
      onChange={e => onQueryChange(e.target.value)}
    />
    <ul>{hits.map(({ title }) => <li>{title}</li>)}</ul>
  </div>
)

// wrap the dumb component with the hoc
const config = {
  indexName: 'movies',
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY,
}
const StateFulApp = withAlgolia(config)(App)
```

# Advanced Usage

**request status**

The hoc also provides the props `pending` which is true while a request is being processed.

It also provides `loadMore` callback to load more result from the same query, as well as props `haveMore` and `nbHits`.

**filtering**

Algolia supports complex filtering [doc](https://www.algolia.com/doc/guides/searching/filtering/).

The hoc also provides a `filters` property, as well a `onFiltersChange` to handle this case.

`filters` is a string in a custom query language. It is super powerful but building the string can be tricky.

The library provides a utility function to parse / stringify a basic filters.

**places**

The places hoc have the same logic, it does not support filtering, nor loading more.

It gives places as returned by Algolia, which have a very loose type. I recommend to use the utility `parseAddress` function, which mimics what the official Algolia places library does.

# API

**withAlgolia**

the hoc accepts as config:

* `indexName` _: string_
* `ALGOLIA_APP_ID` _: string_
* `ALGOLIA_API_KEY` _: string_
* `hitsPerPage` _?: number_
* `delay` _?: number_ : debounce delay on the `onFilterChange`, default to 100 ( ms )

The component accepts as props:

* `indexName` _: string_ will overwrite the config. /!\ at initialization only

The hoc injects as props:

* `pending` _: boolean_
* `query` _: string_
* `filters` _: string | null_
* `hits` _: Hit[]_ : hit is whatever is in your index
* `nbHits` _: number_
* `haveMore` _: boolean_
* `onQueryChange` _: (query: string ) => void_
* `onFilterChange` _: (filters: string | null) => void_

**withAlgoliaPlaces**

the hoc accepts as config:

* `ALGOLIA_APP_ID` _: string_
* `ALGOLIA_API_KEY` _: string_
* `hitsPerPage` _?: number_
* `delay` _?: number_ : debounce delay on the `onFilterChange`, default to 100 ( ms )
* `useDeviceLocation` _?: boolean_ : request device location permission to narrow the search
* `language` _?: string_ : language of the search, default to 'en'

The hoc injects as props:

* `pending` _: boolean_
* `query` _: string_
* `hits` _: Hit[]_ : addresses, as returned by Algolia search, consider using the parseAddress function to have consistent structure.
* `onQueryChange` _: (query: string ) => void_
