import React, { useEffect, useState } from 'react';
import './contact css/contact.css';
import api from '../../../src/api';
import { Toaster,toast } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

function Contact() {

    const [contact, setContact] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handelSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await api.post('/auth/contact-message', contact)

            if (result.data.status) {

                toast.promise(
                    Promise.resolve(),
                    {
                        loading: 'Sending...',
                        success: <b>{result.data.message}</b>,
                        error: <b>Could not send!.</b>,
                    }
                );

            } else {
                toast.error(result.data.message);

            }
        } catch (err) {
            console.log(err.message)
            toast.error('An error occurred while sending the message.');
        }
    }
    return (
        <div className="contact-container">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            {/* Contact Form Section */}

            <div className="contact-texs">
                <form onSubmit={handelSubmit}>
                <h2>Contact Form</h2>
                
                    <div className="contact-input">
                        <input
                            onChange={(e) => setContact({ ...contact, name: e.target.value })}
                            type="text"
                            placeholder="Name"
                            className="input"
                        />
                        <input
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                            type="email"
                            placeholder="Email"
                            className="input"
                        />
                    </div>
                    <textarea onChange={(e) => setContact({ ...contact, message: e.target.value })} placeholder="Message">

                    </textarea>
                
                <div className="contact-submit">
                    <button className="contact-button">Send Message</button>
                </div>
                </form>
            </div>

            {/* Contact Information Section */}
            <div className="contact-texs">
                <h2>Contact Information</h2>
                <div className="contact-information">
                    <div><span>Address:</span> Jimma, Ethiopia</div>
                    <div><span>Email:</span> fuad47722@gmail.com</div>
                    <div><span>Phone:</span> +251 902 920 301</div>
                </div>
                <h2>Find Us Here</h2>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1538.628487497212!2d38.18817915182729!3d7.845365722845885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17b30907c0617715%3A0x937346852a92d5a!2sAlif%20Praivet%20School!5e0!3m2!1sen!2set!4v1733495631952!5m2!1sen!2set"
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>

        </div>
    );
}

export default Contact;
