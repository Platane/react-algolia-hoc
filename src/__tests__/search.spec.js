/* global jest */
import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Typeahead } from 'react-simplest-typeahead'
import { withAlgolia } from '../index'

Enzyme.configure({ adapter: new Adapter() })

const SearchTypeahead = ({ query, onQueryChange, hits, onChange }) => (
  <Typeahead
    pattern={query}
    options={hits}
    onChange={onChange}
    onPatternChange={onQueryChange}
    renderOption={({ option }) => <span key={option.id}>{option.title}</span>}
  />
)

const options = {
  indexName: 'movie',
  ALGOLIA_APP_ID: 'V4D8I8W4EI',
  ALGOLIA_API_KEY: '2812ccac3c1c922221c16cf495d0b5f8',
}

const Search = withAlgolia(options)(SearchTypeahead)

const wait = delay => new Promise(resolve => setTimeout(resolve, delay))
const waitFor = async expr => {
  for (let i = 50; i--; ) {
    const res = await expr()

    if (res) return res

    await wait(100)
  }

  throw new Error('timeout')
}

// it('should render search, display list on focus', async () => {
//   let value = null
//   const onChange = x => (value = x)
//
//   let c = Enzyme.mount(<Search onChange={onChange} />)

it('should render search, display list on focus', async () => {
  let c = Enzyme.mount(<Search />)

  c.find('input').simulate('focus')

  await waitFor(() => {
    // need to force update for whatever reason
    c.mount()

    return !c.children().props().pending
  })

  expect(c.find('.typeahead-options').children().length > 0).toBe(true)
})

it('should render search, display list on focus with option related to query', async () => {
  let c = Enzyme.mount(<Search />)

  c.find('input').simulate('focus')

  await wait(1000)

  c.find('input').simulate('change', { target: { value: 'star' } })

  await waitFor(() => {
    // need to force update for whatever reason
    c.mount()

    return !c.children().props().pending
  })

  const titles = c
    .find('.typeahead-options')
    .children()
    .map(x => x.text())

  expect(titles.every(x => x.toLowerCase().includes('star'))).toBe(true)
})
