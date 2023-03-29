import { ReactNode, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './Layout.css'
import { Link, Outlet, Router } from 'react-router-dom'



function Layout(children: any) {
  const [count, setCount] = useState(0)

  return (

    <div className="Layout">
      <h1><Link to={"/"}>Layout</Link></h1>
      <div>
        <ul>
          <li> <Link to={"/home"}>home</Link> </li>
          <li> <Link to={"/pricing"}>pricing</Link> </li>
          <li> <Link to={"/category"}>category</Link> </li>
          <li> <Link to={"/product/1337"}>product 1337</Link> </li>
          <li> <Link to={"/search"}>search</Link> </li>
          <li> <Link to={"/contact"}>Contact</Link> </li>
          <li> <Link to={"/cart"}>Cart</Link> </li>
          <li> <Link to={"/not-found"}>404</Link> </li>
        </ul>
      </div>
      <Outlet />
    </div>
  )
}

export default Layout
