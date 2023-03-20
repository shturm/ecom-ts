import { Button } from '@mui/material'
import React, { Component } from 'react'

type HomeProps = {}

type HomeState = {}

export default class Home extends Component<HomeProps, HomeState> {
  state = {}

  render() {
    return (
      <div>
        Home
        <Button variant="contained">Hello World</Button>

      </div>
    )
  }
}