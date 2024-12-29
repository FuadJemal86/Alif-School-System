import React from 'react'
import Header from './Header'
import Body from './Body'
import Footer from './Footer'
import './homeCss/body.css'

function HomeParent() {
    return (
        <div >
            <div className='parent-container'>
                <div><Header /></div>
                <div><Body /></div>
                <div><Footer /></div>
            </div>
        </div>
    )
}

export default HomeParent
