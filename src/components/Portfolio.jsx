import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaPlay, FaExternalLinkAlt, FaInstagram, FaVideo, FaClock } from 'react-icons/fa'
import { useInView } from 'react-intersection-observer'
import './Portfolio.css'

const longFormVideos = [
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
    type: "uploaded",
    title: "Corporate Brand Story",
    description: "A comprehensive brand story video showcasing company values and mission.",
    thumbnail: "/uploaded-media/corporate-brand-thumb.jpg",
    videoSrc: "/uploaded-media/corporate-brand.mp4"
  },
  {
    id: 4,
    type: "uploaded",
    title: "Documentary Feature",
    description: "An in-depth documentary exploring social issues and human stories.",
    thumbnail: "/uploaded-media/documentary-thumb.jpg",
    videoSrc: "/uploaded-media/documentary.mp4"
  }
]

const shortFormVideos = [
  {
    id: 5,
    postId: "C-NiI64yZsT",
    type: "instagram",
    title: "A Day in TEDx (cinematic)",
    description: "A cinematic recap of an inspiring day at a TEDx event.",
  },
  {
    id: 6,
    postId: "DByd-yky9-c",
    type: "instagram",
    title: "My Dream Bike (cinematic)",
    description: "A visually stunning showcase of a dream bicycle, captured in cinematic style.",
  },
  {
    id: 7,
    postId: "DCYuKgFyx3L",
    type: "instagram",
    title: "Travel",
    description: "An immersive travel montage featuring breathtaking landscapes and cultural experiences.",
  },
  {
    id: 8,
    postId: "C-xnhK2q-jX",
    type: "instagram",
    title: "Flashy Edit",
    description: "A high-energy, flashy edit showcasing advanced video editing techniques.",
  },
  {
    id: 9,
    type: "uploaded",
    title: "Product Showcase",
    description: "A dynamic product reveal with stunning visual effects and motion graphics.",
    thumbnail: "/uploaded-media/product-showcase-thumb.jpg",
    videoSrc: "/uploaded-media/product-showcase.mp4"
  },
  {
    id: 10,
    type: "uploaded",
    title: "Music Video Edit",
    description: "A rhythmic music video edit with synchronized beats and creative transitions.",
    thumbnail: "/uploaded-media/music-video-thumb.jpg",
    videoSrc: "/uploaded-media/music-video.mp4"
  },
  {
    id: 11,
    type: "uploaded",
    title: "Social Media Campaign",
    description: "A viral social media campaign video with trending effects and engaging content.",
    thumbnail: "/uploaded-media/social-campaign-thumb.jpg",
    videoSrc: "/uploaded-media/social-campaign.mp4"
  }
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

const UploadedVideoThumbnail = ({ thumbnail, title }) => {
  return (
    <img
      src={thumbnail}
      alt={`${title} thumbnail`}
      className="portfolio-thumbnail"
      loading="lazy"
      onError={(e) => {
        // Fallback to a placeholder if image fails to load
        e.target.src = 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800'
      }}
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

  const getHref = () => {
    if (item.type === "youtube") {
      return `https://www.youtube.com/watch?v=${item.videoId}`
    } else if (item.type === "instagram") {
      return `https://www.instagram.com/reel/${item.postId}/`
    } else if (item.type === "uploaded") {
      return item.videoSrc
    }
    return "#"
  }

  const getIcon = () => {
    if (item.type === "youtube") return <FaPlay />
    if (item.type === "instagram") return <FaInstagram />
    if (item.type === "uploaded") return <FaVideo />
    return <FaPlay />
  }

  const getOverlayIcon = () => {
    if (item.type === "youtube" || item.type === "uploaded") {
      return <FaPlay className="play-icon" />
    }
    return <FaExternalLinkAlt className="external-icon" />
  }

  return (
    <motion.div
      className="portfolio-item"
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="portfolio-type-badge">
        {getIcon()}
      </div>

      <a
        href={getHref()}
        target="_blank"
        rel="noopener noreferrer"
        className={`portfolio-link ${gradientClass}`}
      >
        {item.type === "youtube" ? (
          <YouTubeThumbnail videoId={item.videoId} title={item.title} />
        ) : item.type === "uploaded" ? (
          <UploadedVideoThumbnail thumbnail={item.thumbnail} title={item.title} />
        ) : (
          <InstagramPlaceholder gradientClass={gradientClass} />
        )}

        <div className="portfolio-overlay">
          <div className="portfolio-play-button">
            {getOverlayIcon()}
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

const VideoSection = ({ title, videos, icon, hoveredItem, onHover }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="video-category">
      <div className="category-header">
        {icon}
        <h3 className="category-title">{title}</h3>
      </div>
      <div className="portfolio-grid">
        {videos.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <PortfolioItem 
              item={item} 
              isHovered={hoveredItem === item.id} 
              onHover={onHover} 
            />
          </motion.div>
        ))}
      </div>
    </div>
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
      
      <VideoSection
        title="Long-form Videos"
        videos={longFormVideos}
        icon={<FaClock className="category-icon" />}
        hoveredItem={hoveredItem}
        onHover={setHoveredItem}
      />

      <VideoSection
        title="Short Videos"
        videos={shortFormVideos}
        icon={<FaVideo className="category-icon" />}
        hoveredItem={hoveredItem}
        onHover={setHoveredItem}
      />
    </motion.section>
  )
}