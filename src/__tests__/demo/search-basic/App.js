import React from 'react'
import { withAlgolia } from '../../../index'
import { parseFilter, formatFilter } from '../../../util/parseFilter'

const App_ = ({ ...props }) => (
  <React.Fragment>
    <header style={{ padding: '10px' }}>
      <SearchBar {...props} />
    </header>
    <section>
      <div style={{ display: 'flex' }}>
        <nav style={{ padding: '10px' }}>
          <FilterPanel {...props} genres={['Drama', 'Comedy', 'Western']} />
        </nav>
        <div style={{ padding: '10px' }}>
          <Results {...props} />
        </div>
      </div>
    </section>
  </React.Fragment>
)

export const App = withAlgolia({
  indexName: 'movies',
  ALGOLIA_APP_ID: 'latency',
  ALGOLIA_API_KEY: '6be0576ff61c053d5f9a3225e2a90f76',
})(App_)

const SearchBar = ({ query, onQueryChange }) => (
  <input
    className="inputquery"
    type="text"
    placeholder="search here.."
    value={query}
    onChange={e => onQueryChange(e.target.value)}
  />
)

const Results = ({ hits, pending, haveMore, loadMore }) => (
  <React.Fragment>
    {hits.map(x => (
      <div className="movie" key={x.objectID}>
        {x.title}
      </div>
    ))}

    {pending && <i>fetching ...</i>}

    {!pending && haveMore && <button onClick={loadMore}>load more</button>}

    {!pending && hits.length === 0 && <i>no results :(</i>}
  </React.Fragment>
)

const FilterPanel = ({ genres, filters, onFiltersChange }) => {
  const selected = parseFilter(filters)['genre'] || []

  const toggle = genre => () =>
    onFiltersChange(
      formatFilter({
        genre: selected.includes(genre)
          ? selected.filter(x => genre !== x)
          : [...selected, genre],
      })
    )

  return (
    <React.Fragment>
      {genres.map(genre => (
        <div key={genre}>
          <input
            className={`checkbox-${genre}`}
            type="checkbox"
            onChange={toggle(genre)}
            checked={selected.includes(genre)}
          />
          {genre}
        </div>
      ))}
    </React.Fragment>
  )
}
