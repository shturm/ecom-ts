import { Box, Grid, Skeleton, Typography } from '@mui/material'
import React, { Component } from 'react'
import { CartOrderRecord } from './CartOrderRecord'

type ICartPageProps = {}

type State = {}

export default class CartPage extends Component<ICartPageProps, State> {
  state = {}



  render() {
    return (
      <React.Fragment>
        <Typography variant='h2'>Поръчка</Typography>
        <Grid container>
          <Grid item lg={6} md={6} xs={12}>
            
            <CartOrderRecord SubTotal={0} OrderProduct={undefined} OrderCount={0} OrderSize={0} OrderAdditionalDetails={''} />

          </Grid>


          <Grid item lg={6} md={6} xs={12}>
            item 2
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}