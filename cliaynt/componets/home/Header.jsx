import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './homeCss/home.css'
import logo from './logo/alif.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import logoo from './logo/alif.png'
import { faLocationDot, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';


function Header() {

    const colour = '#A09AE3'

    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleScroll = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
        if (!isNavOpen) {

            document.body.style.backgroundColor = '#121212';
            document.body.style.overflow = 'hidden';

        }  else {
            document.body.style.backgroundColor = '';
            document.body.style.overflow = ''; 
        }
    };


    return (
        <div className='header-container'>
            {
                isNavOpen && (
                    
                    <div>
                        
                        <div className="nav-container d-block d-md-none" onClick={toggleNav}>
                            
                            <div className="nav-container1">

                                <ul>
                                <div className='alif-logoo nav-logo'><img src={logo} alt="" srcset="" /></div>
                                    <li className='mobile-ls'><Link to={'/'}>Home</Link></li>
                                    <li className='mobile-ls'><Link onClick={() => handleScroll('about')} to={'/'}>About Us</Link></li>
                                    <li className='mobile-ls'><Link  onClick={() => handleScroll('contact')} to={'/contact'}>Contact</Link></li>
                                    <li className='mobile-ls'><Link to={'/techer-login'}>Login</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className='header-container1'>

                <div className='header-container2'>
                    <div className='header-text d-flex' style={{background: colour}}>
                        <div className='d-none d-md-block'><strong><Link to={'contact'}>Have quation  ?</Link></strong></div>
                        <div className='d-none d-md-block'><span></span> </div>
                        <div className='fs-15 d-block d-md-none header-mobile'><strong>phone number:</strong> +251-90292-0301</div>
                        <div className='d-none d-md-block'><span className='t-icone-phone'><FontAwesomeIcon icon={faPhone} /></span><strong>phone number:</strong> +251-90292-0301</div>
                        <div className='d-none d-md-block'><span className='t-icone-phone'><FontAwesomeIcon icon={faEnvelope} /></span><span><strong>Email:</strong></span> fuad47722@gmail.com</div>
                        <div className='d-block d-md-none header-mobile'><span><strong>Email:</strong></span> fuad47722@gmail.com</div>
                    </div>
                </div>

            </div>
            <div className='header-nav-conatiner'>
                <div className='header-navs'>
                    <div className='alif-logoo'><img src={logo} alt="" /></div>
                    <ul className='header-ul'>
                        <Link to={'/'} onClick={() => handleScroll('home')} className='point d-none d-md-block'>Home</Link>
                        <Link onClick={() => handleScroll('about')} to={'/'} className='point d-none d-md-block'>About Us</Link>
                        <Link onClick={() => handleScroll('contact')} to={'/Contact'} className='point d-none d-md-block'>Contact</Link>
                        <Link to={'/techer-login'} className='header-login-button d-none d-md-block'>Login</Link>
                    </ul>
                    <button onClick={toggleNav} className='nav-button d-block d-md-none'><FontAwesomeIcon icon={faBars} /></button>
                </div>
            </div>
        </div>
    )
}

export default Header
