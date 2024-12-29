import React from 'react'
import Header from '../../Header'
import ContactBaner from '../ContactBaner'
import Contact from '../Contact'
import Footer from '../../Footer'


function ContactParent() {
    return (
        <div>
            <div><Header/></div>
            <div><ContactBaner/></div>
            <div><Contact/></div>
            <div><Footer/></div>
        </div>
    )
}

export default ContactParent
