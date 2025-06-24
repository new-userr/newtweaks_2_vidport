import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaPlay, FaExternalLinkAlt, FaInstagram } from 'react-icons/fa'
import { useInView } from 'react-intersection-observer'
import './Portfolio.css'

const portfolioItems = [
  {
    id: 1,
    videoId: "Bea3sHnuQcQ",
    type: "youtube",
    title: "Dynamic Visualization Explainer",
    description: "An engaging explainer video showcasing dynamic data visualization techniques.",
  },
  {
    id: 2,
    videoId: "XDOTe_gsDyw",
    type: "youtube",
    title: "Manifestation Blueprint Edit",
    description: "A motivational video edit exploring the concept of manifestation and personal growth.",
  },
  {
    id: 3,
    postId: "C-NiI64yZsT",
    type: "instagram",
    title: "A Day in TEDx (cinematic)",
    description: "A cinematic recap of an inspiring day at a TEDx event.",
  },
  {
    id: 4,
    postId: "DByd-yky9-c",
    type: "instagram",
    title: "My Dream Bike (cinematic)",
    description: "A visually stunning showcase of a dream bicycle, captured in cinematic style.",
  },
  {
    id: 5,
    postId: "DCYuKgFyx3L",
    type: "instagram",
    title: "Travel",
    description: "An immersive travel montage featuring breathtaking landscapes and cultural experiences.",
  },
  {
    id: 6,
    postId: "C-xnhK2q-jX",
    type: "instagram",
    title: "Flashy Edit",
    description: "A high-energy, flashy edit showcasing advanced video editing techniques.",
  },
]

const gradients = [
  "gradient-purple-blue",
  "gradient-pink-orange",
  "gradient-green-blue",
  "gradient-yellow-red",
]

const YouTubeThumbnail = ({ videoId, title }) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  return (
    <img
      src={thumbnailUrl}
      alt={`${title} thumbnail`}
      className="portfolio-thumbnail"
      loading="lazy"
    />
  )
}

const InstagramPlaceholder = ({ gradientClass }) => {
  return (
    <div className={`instagram-placeholder ${gradientClass}`}>
      <FaInstagram className="instagram-icon" />
      <div className="instagram-label">
        <span>View on Instagram</span>
      </div>
    </div>
  )
}

const PortfolioItem = ({ item, isHovered, onHover }) => {
  const gradientClass = useMemo(
    () => (item.type === "instagram" ? gradients[(item.id - 1) % gradients.length] : ""),
    [item.id, item.type]
  )

  const href =
    item.type === "youtube"
      ? `https://www.youtube.com/watch?v=${item.videoId}`
      : `https://www.instagram.com/reel/${item.postId}/`

  return (
    <motion.div
      className="portfolio-item"
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="portfolio-type-badge">
        {item.type === "youtube" ? <FaPlay /> : <FaInstagram />}
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`portfolio-link ${gradientClass}`}
      >
        {item.type === "youtube" ? (
          <YouTubeThumbnail videoId={item.videoId} title={item.title} />
        ) : (
          <InstagramPlaceholder gradientClass={gradientClass} />
        )}

        <div className="portfolio-overlay">
          <div className="portfolio-play-button">
            {item.type === "youtube" ? (
              <FaPlay className="play-icon" />
            ) : (
              <FaExternalLinkAlt className="external-icon" />
            )}
          </div>
        </div>
      </a>

      <div className="portfolio-content">
        <h3 className="portfolio-title">{item.title}</h3>
        <p className="portfolio-description">{item.description}</p>
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.section
      id="my-work"
      className="portfolio-section"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      ref={ref}
    >
      <h2 className="portfolio-section-title">My Work</h2>
      <div className="portfolio-grid">
        {portfolioItems.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <PortfolioItem 
              item={item} 
              isHovered={hoveredItem === item.id} 
              onHover={setHoveredItem} 
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}