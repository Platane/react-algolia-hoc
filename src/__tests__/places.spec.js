/* global jest */
import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { waitFor } from './util'
import { App } from './demo/places-basic/App'

Enzyme.configure({ adapter: new Adapter() })

it('should fetch according to query', async () => {
  let c = Enzyme.mount(<App />)

  c.find('input').simulate('change', {
    target: { value: '1 place de la république, paris' },
  })

  await waitFor(() => {
    c.mount()

    const m = c.find('li').map(x => x.text())

    return m.some(address => address.toLowerCase().includes('paris'))
  })
})
