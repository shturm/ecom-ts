import { Button } from '@mui/material'
import React, { Component } from 'react'
import { ProductTile, ProductTileGrid } from '../components'


export type Props = {
  // aHomeProp: boolean
}

type State = {}

export default class Home extends Component<Props, State> {
  state = {}

  render() {
    return (
      <div data-testid="page-home">
        <ProductTileGrid />
      </div>
    )
  }
}