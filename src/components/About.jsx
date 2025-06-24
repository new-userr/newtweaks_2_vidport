import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './About.css'

export default function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  return (
    <motion.section 
      ref={ref}
      className="about-section"
      style={{ opacity, scale }}
    >
      <h2 className="about-title">About Me</h2>
      <div className="about-content">
        <p className="about-text">
          I'm Vidhant Gurav (Light)—a visionary video editor turning ideas into jaw-dropping visuals. With two years of experience, I fuse cinematic flair with cutting-edge effects to create content that demands attention and leaves a lasting impact. For me, every frame is an opportunity to redefine storytelling and push creative boundaries. Let's make magic together.
        </p>
      </div>
    </motion.section>
  )
}