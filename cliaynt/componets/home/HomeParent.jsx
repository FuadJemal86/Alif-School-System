import React, { useEffect, useState } from 'react'
import Header from './Header'
import Body from './Body'
import Footer from './Footer'
import './homeCss/body.css'

function HomeParent() {

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    })

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <span class="home-loader"></span>
            </div>
        );
    }
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
