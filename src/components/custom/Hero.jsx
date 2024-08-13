import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
    return (

        <div className='flex flex-col items-center mx-7 md:mx-40'>
            <h1 className='font-bold text-4xl md:text-5xl text-center mt-20'>
                <span className='text-[#ff7d00] '>Discover the World Smarter:</span> AI-Enhanced Travel Planning Just for You</h1>
            <p className='text-xl text-center text-gray-600 m-10'>Elevate your adventures with our advanced AI travel app that offers personalized recommendations and intelligent planning features.</p>
            <Link to={'/create-trip'}>
                <Button>Get Started, Its Free</Button>
            </Link>

        </div>
    )
}

export default Hero
