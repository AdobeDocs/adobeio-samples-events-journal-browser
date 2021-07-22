/* 
* <license header>
*/

import React from 'react'
import { NavLink } from 'react-router-dom'
import {Switch} from '@adobe/react-spectrum'

function SideBar (props) {
  let [selected, setSelection] = React.useState(false);
  const {setDarkMode} = props

  return (
    <ul className="SideNav">
      {/* <li className="SideNav-item">
        <NavLink className="SideNav-itemLink" activeClassName="is-selected" aria-current="page" exact to="/">Home</NavLink>
      </li> */}
      <li className="SideNav-item">
        <NavLink className="SideNav-itemLink" activeClassName="is-selected" aria-current="page" exact to="/">Your App Actions</NavLink>
      </li>
      <li className="SideNav-item">
        <NavLink className="SideNav-itemLink" activeClassName="is-selected" aria-current="page" to="/about">About Project Firefly Apps</NavLink>
      </li>
      <li className="SideNav-item">
        <div className="SideNav-itemLink">
          <Switch isSelected={selected} onChange={() => {setSelection(!selected); setDarkMode(!selected)}}>
            Dark mode
          </Switch>
        </div>
      </li>
    </ul>
  )
}

export default SideBar
