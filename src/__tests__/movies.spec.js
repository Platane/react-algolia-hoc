/* global jest */
import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { App } from './demo/search-basic/App'
import { waitFor } from './util'

Enzyme.configure({ adapter: new Adapter() })

it('should render a list of results', async () => {
  let c = Enzyme.mount(<App />)

  await waitFor(() => {
    // need to force update for whatever reason
    c.mount()

    return c.find('.movie').length
  })
})

it("should fetch more when 'loading more'", async () => {
  let c = Enzyme.mount(<App />)

  let movies

  await waitFor(() => {
    c.mount()

    const m = c.find('.movie').map(x => x.text())

    return (movies = m).length
  })

  c.find('button').simulate('click')

  await waitFor(() => {
    c.mount()

    const m = c.find('.movie').map(x => x.text())

    if (movies.length === m.length) return false

    return true
  })
})

it('should fetch according to query', async () => {
  let c = Enzyme.mount(<App />)

  c
    .find('.inputquery')
    .simulate('change', { target: { value: 'the good the bad the ugly' } })

  await waitFor(() => {
    c.mount()

    const m = c.find('.movie').map(x => x.text())

    return m.includes('The Good, the Bad and the Ugly')
  })
})

it('should fetch according to filter', async () => {
  let c = Enzyme.mount(<App />)

  c.find('.checkbox-Western').simulate('change')

  await waitFor(() => {
    c.mount()

    const m = c.find('.movie').map(x => x.text())

    return m.includes('The Good, the Bad and the Ugly')
  })
})
