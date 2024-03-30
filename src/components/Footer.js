import React from 'react'
import './footer.css'
import { FaMobile, FaVoicemail, FaTwitter, FaFacebookSquare, FaInstagramSquare, FaWhatsappSquare, } from 'react-icons/fa'
import { Link } from 'react-router-dom'
export default function Footer() {
    return (
        <div className='container-fluid footer'>
            <div className='footercontent container'>
                <div className='contact'>
                    <h4>Get Into Touch</h4>
                    <div className='contact_details'>
                        <p><a href="tel:9798827707"><span><FaMobile /></span>+91-97-9882-7707</a></p>
                        <p><a href="mailto:appnamintrago@gmail.com" target="_blank" rel='noreferrer'><span><FaVoicemail /></span>appnamintrago@gmail.com</a></p>
                    </div>
                </div>
                <div className='servicesf'>
                    <h4>MintraGo Services</h4>
                    <div className='service_details'>
                        <p><Link to="/">Home</Link></p>
                        <p><Link to="/dress">Dress</Link></p>
                        <p><Link to="/cycle">Cycle</Link></p>
                        <p><Link to="/selling">Sell</Link></p>
                    </div>
                </div>
                <div className='social_mediaf'>
                    <h4>Follow MintraGo On</h4>
                    <div className='social_links'>
                    <p><a href="https://www.facebook.com/profile.php?id=100087409022493" target="_blank" rel='noreferrer'><span><FaFacebookSquare /></span> Facebook</a></p>
                    <p><a href="https://instagram.com/mintrago2022" target="_blank" rel='noreferrer'><span><FaInstagramSquare /></span> Instagram</a></p>
                    <p><a href="https://wa.me/919798827707" target="_blank" rel='noreferrer'><span><FaWhatsappSquare /></span> Whatsapp</a></p>
                    <p><a href="https://twitter.com/mintrago3" target="_blank" rel='noreferrer'><span><FaTwitter /></span> Twitter</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
