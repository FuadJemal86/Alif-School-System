import React, { useEffect, useState } from 'react';
import './homeCss/body.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSchool, faPen } from '@fortawesome/free-solid-svg-icons';
import kidsImage from './logo/studentKid.jpg';
import school1 from './logo/shoolEnvi1.jpeg';
import school2 from './logo/schoolEnvi2.jpeg';
import school3 from './logo/schoolEnvi3.jpg';
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

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.2 });

        // Observe all cards
        document.querySelectorAll('.box,.features-card, .teacher-box-container, .school-card ').forEach(card => {
            observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

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
                <div className='about-box-container'>

                    <div className='box'>
                        <div class="card">
                            <div className='body-icon'><FontAwesomeIcon icon={faBook} /></div>
                            <p class="heading">

                                Quality Education
                            </p>
                            <p>

                            </p>
                            <p>
                            </p>
                        </div>
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


            <div className='our-teacher'>
                <h1>Our <span className='school-text-only'>Teachers</span></h1>
                <div className='teacher-box-container'>

                    {
                        teacherImage.map(c => (
                            <div key={c.id} className='teacher-imags'>
                                <div>
                                    <div className="teacher-card">
                                        <div className='teacher-card-image'> <img src={`http://localhost:3032/image/${c.image}`} alt="" /></div>
                                        <div className="teacher-card-content">
                                            <p className="teacher-card-title">{c.name}</p>
                                            <p className="teacher-card-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
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
                                    <p className="school-card-title">Modern Facilities</p>
                                    <p className="school-card-description">State-of-the-art classrooms and learning spaces equipped with the latest technology</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <div className=''>
                            <div className="school-card">
                                <div className='about-school-image'><img src={school1} alt="" srcset="" /> </div>
                                <div className="ouer-school-card-content">
                                    <p className="school-card-title">Peaceful Environment</p>
                                    <p className="school-card-description">Well-maintained campus with green spaces promoting a calm learning atmosphere</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='school-imags'>
                        <div>
                            <div className="school-card">
                                <div className='about-school-image'><img src={school2} alt="" srcset="" /> </div>
                                <div className="ouer-school-card-content">
                                    <p className="school-card-title">Interactive Spaces</p>
                                    <p className="school-card-description">Collaborative areas designed to encourage student engagement and creativity</p>
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
