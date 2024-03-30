import React, { useState } from 'react'
import emailjs from 'emailjs-com'
import { Link } from "react-router-dom";
import './form.css'
import './stationary.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';
export default function Forms() {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [product_name, setproduct_name] = useState()
    const [price, setPrice] = useState()
    const [conditions, setConditions] = useState()
    let navigate = useNavigate();
    const sendEmail = e => {
        e.preventDefault();
        
        if (name && email && phone && product_name && price && conditions === "done") {
            

            emailjs.sendForm(
                'service_tqimxjm',
                'template_8cgypis',
                e.target,
                'PMNQVIH_YfEmuZ1pB'

            ).then(res => {
                navigate('/')
                alert("your form is submited")

            }).catch(err => console.log(err))
            // setPayment('')
        } else {
            alert("Please Fill all credentials!")
        }
    }
    return (
        <>
            <div className='container-fluid formbg'>
                <div className='close_btn'>
                    <Link to="../"><button className="btn-close" aria-label="Close"></button></Link>

                </div>
                <form onSubmit={sendEmail} className="container inputcenter">
                    <div className="mb-3 col-lg-5">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" name='name' onChange={(e) => setName(e.target.value)} value={name} className="form-control" id="name" />
                    </div>
                    <div className="mb-3 col-lg-5">
                        <label htmlFor="email" className="form-label">College Id</label>
                        <input type="email" name='email' onChange={(e) => setEmail(e.target.value)} value={email} className="form-control" id="email" />
                    </div>
                    <div className="mb-3 col-lg-5">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input type="number" name='phone' onChange={(e) => setPhone(e.target.value)} value={phone} className="form-control" id="phone" />
                    </div>
                    <div className="mb-3 col-lg-5">
                        <label htmlFor="product_name" className="form-label">Product Name</label>
                        <input type="text" name='product_name' className="form-control" onChange={(e) => setproduct_name(e.target.value)} value={product_name} id="product_name" />
                    </div>
                    <div className="mb-3 col-lg-5">
                        <label htmlFor="price" className="form-label">Listing Price</label>
                        <input type="number" name='price' className="form-control" onChange={(e) => setPrice(e.target.value)} value={price} id="price" />
                    </div>
                    <div className="mb-3 col-lg-5">
                        <input type="hidden" name='paymentid' className="form-control" id="price" readOnly />
                    </div>
                    <div className="col-lg-5">
                        <div className="input-group mb-3">
                            <div className="input-group-text bg-transparent">
                                <input className="form-check-input mt-0" type="checkbox" onClick={() => { setConditions("done") }} />
                            </div>
                            <div className="text-light mx-2">
                                MintraGo will charge on Listing price up to 7%-10%
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-info">Submit</button>
                </form>
            </div>
        </>
    )

}
