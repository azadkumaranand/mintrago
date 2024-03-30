import React from 'react'
import './alert.css'
import { FaWindowClose } from 'react-icons/fa';

function Alert(props) {
    return (
        <div className='alertContainer'>
            <div className='alertcontent'>
                {...props}
            </div>
            <div className='closealert'>
                <FaWindowClose/>
            </div>
        </div>
    )
}

export default Alert
