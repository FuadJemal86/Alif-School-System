import React from 'react';
import './contact css/contact.css';

function Contact() {
    return (
        <div className="contact-container">
            {/* Contact Form Section */}
            <div className="contact-texs">
                <h2>Contact Form</h2>
                <div className="contact-input">
                    <input
                        type="text"
                        placeholder="Name"
                        className="input"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="input"
                    />
                </div>
                <textarea placeholder="Message"></textarea>
                <div className="contact-submit">
                    <button className="contact-button">Send Message</button>
                </div>
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
