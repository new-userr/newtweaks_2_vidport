import React from 'react'
import { motion } from 'framer-motion'
import { Link as ScrollLink } from 'react-scroll'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <video
        className="header-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      
      <div className="header-overlay"></div>
      
      <div className="header-content">
        <motion.h1 
          className="header-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Light's Portfolio
        </motion.h1>
        <motion.p 
          className="header-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Turning ideas into jaw-dropping visuals
        </motion.p>
        <ScrollLink
          to="my-work"
          smooth={true}
          duration={1000}
          offset={-100}
        >
          <motion.button
            className="header-button"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore My Work
          </motion.button>
        </ScrollLink>
      </div>
    </header>
  )
}