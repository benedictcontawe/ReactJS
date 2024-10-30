import React from 'react'
import HeroSection from './HeroSection'
import FeaturedProducts from './FeaturedProducts'
import iphone from '../../assets/iphone-14-pro.webp'
import mac from '../../assets/mac-system-cut.jfif'

const HomePage = () => {
  return (
    <div>
        <HeroSection 
            title="Buy iPhone 14 Pro" 
            subtitle="Experience the power of the latest 14 with our most pro camera ever."
            link='/'
            image={iphone}
        />
        <FeaturedProducts />
        <HeroSection 
            title="Build the ultimate setup" 
            subtitle="You can add Studio Display and colour-matched Magic accesories to your bag after configure your Mac mini"
            link='/'
            image={mac}
        />
    </div>
  )
}

export default HomePage