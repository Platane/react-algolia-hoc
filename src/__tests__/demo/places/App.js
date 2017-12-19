import React from 'react'
import { Places } from './Places'
import styled, { injectGlobal } from 'react-emotion'

const algolia_logo =
  'https://www.algolia.com/static_assets/images/pricing/pricing_new/algolia-powered-by-14773f38.svg'

injectGlobal`
  * {
    box-sizing: border-box;
  }
  body,html,#app {
    margin: 0;
    height: 100%;
    font-family: helvetica;
  }
`

export class App extends React.Component {
  state = { address: null }

  onChange = address => this.setState({ address })

  render() {
    return (
      <Body>
        <Places
          onChange={this.onChange}
          value={this.state.address}
          useDeviceLocation
        />
        <AlgoliaPowered src={algolia_logo} />
      </Body>
    )
  }
}
const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
  transition: background-color 300ms ease;
  background-color: rgb(215, 92, 92);
`

const AlgoliaPowered = styled.img`
  position: absolute;
  right: 10px;
  bottom: 4px;
`
