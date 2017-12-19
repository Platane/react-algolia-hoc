import React from 'react'
import { Search } from './Search'
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

export class App extends React.Component<{}, { movie: Object | null }> {
  state = { movie: null }

  onChange = (movie: Object) => this.setState({ movie })

  render() {
    const x = (this.state.movie && this.state.movie.id) || 0

    return (
      <Body
        style={{
          backgroundColor: `hsl(${(x * 10) % 360},60%,60%)`,
        }}
      >
        <Search onChange={this.onChange} value={this.state.movie} />
        <AlgoliaPowered src={algolia_logo} />
      </Body>
    )
  }
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
  height: 100%;
  overflow: hidden;
  transition: background-color 300ms ease;
`

const AlgoliaPowered = styled.img`
  position: absolute;
  right: 10px;
  bottom: 4px;
`
