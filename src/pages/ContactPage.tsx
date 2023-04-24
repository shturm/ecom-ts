import React, { Component } from 'react'

type Props = {}

type State = {}

export default class ContactPage extends Component<Props, State> {
  state = {}

  render() {
    return (
      <React.Fragment>
        <h1>Контакти</h1>
        office@safetyshoes.bg<br/>
        тел. 0882056506
        <address>
        София, бул. Копенхаген 38 <br/>
        Акумулатори БС ООД <br/>
        ЕИК: 205827917 <br/>
        IBAN: BG51 UBBS 8002 1021 0533 50
        </address>
      </React.Fragment>
    )
  }
}