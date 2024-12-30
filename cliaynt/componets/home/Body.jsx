import React, { useEffect, useState } from 'react'
import './homeCss/body.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSchool, faPen } from '@fortawesome/free-solid-svg-icons';
import kidsImage from './logo/studentKid.jpg'
import school1 from './logo/school1.jpg'
import school2 from './logo/school2.jpg'
import school3 from './logo/school3.jpg'
import api from '../../src/api';

function Body() {

    const [teacherImage, setteacherImage] = useState([])

    useEffect(() => {

        const FeachData = async () => {
            try {
                const result = await api.get('/auth/get-teacherImage')

                if (result.data.status) {
                    setteacherImage(result.data.result)
                } else {
                    console.log(result.data.error)
                }
            } catch (err) {
                console.log(err)
            }
        }
        FeachData()

    }, [])

    return (
        <div className='body-container' id='home'>
            <div>
                <div className="banner">
                    <div className="banner-content">
                        <h1>Welcome to Alif School</h1>
                        <p>Empowering Education, Inspiring Excellence</p>
                        <a class="fancy" href="#">
                            <span class="top-key"></span>
                            <span class="text">Enroll now</span>
                            <span class="bottom-key-1"></span>
                            <span class="bottom-key-2"></span>
                        </a>
                    </div>
                </div>
            </div>
            <div className='alif-school'>
                <div><h1>Welcome to <span className='alif-school-text'>Alif School</span> – <h6>Where Learning Meets Excellence!</h6></h1></div>
                <div className='box-container'>

                    <div className='box'>
                        <div class="card">
                            <div className='body-icon'><FontAwesomeIcon icon={faBook} /></div>
                            <p class="heading">

                                Quality Education
                            </p>
                            <p>

                            </p>
                            <p>
                            </p></div>
                    </div>

                    <div className='box'>
                        <div class="card">
                            <div className='body-icon'><FontAwesomeIcon icon={faSchool} /></div>
                            <p class="heading">
                                Inclusive Community
                            </p>
                            <p>

                            </p>
                            <p>
                            </p></div>
                    </div>

                    <div className='box'>
                        <div class="card">
                            <div className='body-icon'><FontAwesomeIcon icon={faPen} /></div>
                            <p class="heading">
                                Dedicated Teachers
                            </p>
                            <p>

                            </p>
                            <p>
                            </p></div>
                    </div>
                </div>
            </div>

            <div className='about-container' id="about">
                <h1 className="about-title">About <span className='about-us-text'>Us</span></h1>
                <div className='about-content'>
                    <div className='about-image-section'>
                        <div className='image-wrapper'>
                            <img src={kidsImage} alt="Students learning" loading="lazy" />
                        </div>
                        <div className="circle-decoration top-left"></div>
                        <div className="circle-decoration bottom-right"></div>
                    </div>
                    <div className='about-features'>
                        <div className="features-card">
                            <h2>Features</h2>
                            <div className="feature-list">
                                <div className="feature-item">
                                    <div className="feature-icon">🎓</div>
                                    <p>Incorporating modern teaching methods and technology for a dynamic learning environment.</p>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">🌟</div>
                                    <p>Fostering a safe, diverse, and supportive atmosphere for every student.</p>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">👨‍🏫</div>
                                    <p>Experienced educators who inspire and guide students to achieve their best.</p>
                                </div>
                            </div>
                            <div className="background-circle"></div>
                        </div>
                    </div>
                </div>
            </div>


            <div className='our-school alif-school'>
                <h1>Our <span className='school-text-only'>Teachers</span></h1>
                <div className='box-container'>

                    {
                        teacherImage.map(c => (
                            <div key={c.id} className='school-imags'>
                                <div>
                                    <div className="school-card">
                                        <div className='school-card-image'> <img src={`http://localhost:3032/image/${c.image}`} alt="" /></div>
                                        <div className="school-card-content">
                                            <p className="school-card-title">{c.name}</p>
                                            <p className="school-card-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>


            <div className='our-school alif-school'>
                <h1>Our <span className='school-text-only'>School</span></h1>

                <div className='box-container'>

                    <div className='ouer-school-imags'>
                        <div>
                            <div className="school-card">
                                <div className='about-school-image'><img src={school3} alt="" srcset="" /> </div>
                                <div className="ouer-school-card-content">
                                    <p className="school-card-description"></p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className=''>
                        <div className=''>
                            <div className="school-card">
                                <div className='about-school-image'><img src={school1} alt="" srcset="" /> </div>
                                <div className="ouer-school-card-content">
                                    <p className="school-card-title"></p>
                                    <p className="school-card-description">Good Climate</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='school-imags'>
                        <div>
                            <div className="school-card">
                                <div className='about-school-image'><img src={school2} alt="" srcset="" /> </div>
                                <div className="ouer-school-card-content">
                                    <p className="school-card-title"></p>
                                    <p className="school-card-description"></p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Body
