import React from 'react'
import styled, { injectGlobal } from 'react-emotion'

export const StarCount = ({ count, ...props }) => (
  <Body {...props}>
    <Bar style={{ width: `${count * 10}%` }} />
  </Body>
)

let starPath = [
  [0.5, 0],
  [0.4, 0.4],
  [0, 0.4],
  [0.31, 0.6],
  [0.2, 1],
  [0.5, 0.67],
]

starPath = [...starPath, ...starPath.map(([x, y]) => [1 - x, y]).reverse()]

const mask = [].concat(
  ...Array.from({ length: 5 }).map((_, i) =>
    starPath.map(([x, y]) => [x / 5 + i / 5, y])
  )
)

const Body = styled.div`
  position: relative;
  background-color: #887d6ad6;
  clip-path: polygon(
    ${mask.map(([x, y]) => `${x * 100}% ${y * 100}%`).join(',')}
  );
`

const Bar = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #ffb307;
`
