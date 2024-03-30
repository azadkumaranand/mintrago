import React, { useState } from 'react'
import emailjs from 'emailjs-com'
import './form.css'
export default function Forms() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    function sendEmail(e) {
        e.preventDefault();
        if (name && email && phone) {

            emailjs.sendForm(
                'service_tqimxjm',
                'template_8cgypis',
                e.target,
                'PMNQVIH_YfEmuZ1pB'
            ).then(res => {
                alert("your form is submited")
            }).catch(err => console.log(err))
        } else {
            alert("Please fill the all cridentials")
        }

    }
    return (
        <div className='container'>
            <div className='container-fluid formbg'>
                <form onSubmit={sendEmail} className="container inputcenter">
                    <div className="mb-3 col-lg-5">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" onChange={(e) => setName(e.target.value)} value={name} name='name' className="form-control" id="name" />
                    </div>
                    <div className="mb-3 col-lg-5">
                        <label htmlFor="email" className="form-label">College Id</label>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} name='email' className="form-control" id="email" />
                    </div>
                    <div className="mb-3 col-lg-5">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input type="number" onChange={(e) => setPhone(e.target.value)} value={phone} name='phone' className="form-control" id="phone" />
                    </div>
                    <div className="mb-3 col-lg-5">
                        <div className="form-floating">
                            <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: "150px" }}></textarea>
                            <label htmlFor="floatingTextarea2">Comments</label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-info">Submit</button>
                </form>
            </div>
        </div>
    )
}
