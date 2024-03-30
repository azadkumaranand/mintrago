import React from 'react'
import './loader.css'
import Spinner from 'react-bootstrap/Spinner';

function Loader() {
  return (
    <div className="loaderContainer">
      <Spinner animation="border" />;
    </div>
  )
}

export default Loader
