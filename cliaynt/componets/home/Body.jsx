import React from 'react'
import './homeCss/body.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSchool, faPen } from '@fortawesome/free-solid-svg-icons';
import kidsImage from './logo/studentKid.jpg'
import school1 from './logo/school1.jpg'
import school2 from './logo/school2.jpg'
import school3 from './logo/school3.jpg'

function Body() {
    return (
        <div className='body-container' id='home'>
            <div>
                <div className="banner">
                    <div className="banner-content">
                        <h1>Welcome to Alif School</h1>
                        <p>Empowering Education, Inspiring Excellence</p>
                        <a href="#enroll" className="cta-button">Enroll Now</a>
                    </div>
                </div>
            </div>
            <div className='alif-school'>
                <div><h1>Welcome to <span className='alif-school-text'>Alif School</span> – <h6>Where Learning Meets Excellence!</h6></h1></div>
                <div className='box-container'>
                    <div className='box'>
                        <div className='box-text'>
                            <div className='body-icon'><FontAwesomeIcon icon={faSchool} style={{ fontSize: '40px', color: '#4379F2' }} /></div>
                            <div className='body-text1'>Quality Education</div>
                            <div className='body-text1'>Innovative Approach</div>
                        </div>
                    </div>

                    <div className='box'>
                        <div className='box-text'>
                            <div className='body-icon'><FontAwesomeIcon icon={faBook} style={{ fontSize: '40px', color: '#4379F2' }} /></div>
                            <div className='body-text1'>Inclusive Community</div>
                            <div className='body-text1'>Dedicated Teachers</div>
                        </div>
                    </div>

                    <div className='box'>
                        <div className='box-text'>
                            <div className='body-icon'><FontAwesomeIcon icon={faPen} style={{ fontSize: '40px', color: '#4379F2' }} /></div>
                            <div className='body-text1'>Holistic Development</div>
                            <div className='body-text1'>Fostering a safe</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='about-box' id="about">
                <h1>Features</h1>
                <div className='about-box1'>
                    <div className='about-kids'>
                        <div className='about-image'><img src={kidsImage} alt="" /></div>
                    </div>
                    <div className='about-dicrption '>
                        <div className='about-dicrption-texs'>
                            <div>Empowering students with knowledge, critical thinking, and creativity</div>
                            <div>Incorporating modern teaching methods and technology for a dynamic learning environment</div>
                            <div> Fostering a safe, diverse, and supportive atmosphere for every student</div>
                            <div>Experienced educators who inspire and guide students to achieve their best.</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='our-school alif-school'>
                <h1>Our <span className='school-text-only'>School</span></h1>
                <div className='box-container'>
                    <div className='school-imags'>
                        <img src={school1} alt="" />
                    </div>
                    <div className='school-imags'>
                        <img src={school2} alt="" />
                    </div>
                    <div className='school-imags'>
                        <img src={school3} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Body
