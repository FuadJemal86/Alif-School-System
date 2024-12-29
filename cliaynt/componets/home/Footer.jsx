import React from 'react'
import './homeCss/footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <div>
            <div className='footer-container'>
                <div className='footer-container1'>
                    <div className='footer-texts'>
                        <h3>About Us</h3>
                        <div>
                            <div>Quality Education</div>
                            <div>Inclusive Community</div>
                            <div>Dedicated Teachers</div>
                            <div>Fostering a safe</div>
                        </div>
                    </div>

                    <div className='footer-texts '>
                        <h3>Site Map</h3>
                        <div>
                            <div>Home</div>
                            <div>About Us</div>
                            <div>Contact</div>
                        </div>
                    </div>

                    <div className='footer-texts'>
                        <h3>Contact Information</h3>
                        <div>
                            <div><FontAwesomeIcon icon={faLocationDot} /><span className='conatct-text'>Jimma,Ethopia</span></div>
                            <div><FontAwesomeIcon icon={faEnvelope} /><spane className='conatct-text'>fuad47722@gmail.com</spane></div>
                            <div><FontAwesomeIcon icon={faPhone} /><span className='conatct-text'>+251 902 920 301</span></div>
                        </div>
                    </div>

                    <div className='footer-texts'>
                        <div>
                            <p>
                                Stay updated with our latest <br /> news and offers. <br />Subscribe to our newsletter <br /> and never miss an update.
                            </p>
                        </div>
                        <h3>Subscrip Our Newsletter</h3>
                        <div>
                            <input
                                placeholder='Your Email Address'
                            />
                        </div>
                        <button>Subscribe</button>
                    </div>

                </div>
                <div className='footer-icone-conatiner'>
                    <div className='footer-icons'>
                        <div className='footer-icon'><FontAwesomeIcon icon={faFacebook} /></div>
                        <div className='footer-icon'><FontAwesomeIcon icon={faInstagram} /></div>
                        <div className='footer-icon'><FontAwesomeIcon icon={faLinkedin} /></div>
                        <div className='footer-icon'><FontAwesomeIcon icon={faTwitter} /></div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Footer
