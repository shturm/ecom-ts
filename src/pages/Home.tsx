import { Button } from '@mui/material'
import React, { Component } from 'react'


export type Props = {
  // aHomeProp: boolean
}

type State = {}

export default class Home extends Component<Props, State> {
  state = {}

  render() {
    return (
      <div data-testid="page-home">
        <h2>Home</h2>
        <Button variant="contained">Hello World</Button>

      </div>
    )
  }
}