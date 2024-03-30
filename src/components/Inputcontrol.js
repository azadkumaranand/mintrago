import React from 'react'
import './inputcontrol.css'
function Inputcontrol(props) {
  return (
    <div className='forminput'>
      {props.label && <label>{props.label}</label>}
      <input {...props}/>
    </div>
  )
}

export default Inputcontrol
