import { Button } from '@mui/material'
import React, { Component } from 'react'
import { ProductTile, ProductTileGrid } from '../components'

import { Product } from '../data/product.types'
import data from '../data/products.json';


// const featured: Product[] = data.slice(0,6) as Product[];
const featured: Product[] = data as Product[];

export type Props = {
  // aHomeProp: boolean
}

type State = {}

export default class HomePage extends Component<Props, State> {
  state = {}

  render() {
    return (
      <div data-testid="page-home">
        <ProductTileGrid products={featured}/>
      </div>
    )
  }
}