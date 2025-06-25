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
  },
  {
    id: 5,
    type: "uploaded",
    title: "Educational Series",
    description: "A comprehensive educational series breaking down complex topics into digestible content.",
    thumbnail: "/uploaded-media/educational-series-thumb.jpg",
    videoSrc: "/uploaded-media/educational-series.mp4"
  },
  {
    id: 6,
    type: "uploaded",
    title: "Client Testimonial Compilation",
    description: "A heartfelt compilation of client testimonials showcasing successful partnerships.",
    thumbnail: "/uploaded-media/testimonial-thumb.jpg",
    videoSrc: "/uploaded-media/testimonial.mp4"
  },
  {
    id: 7,
    type: "uploaded",
    title: "Behind the Scenes Documentary",
    description: "An exclusive behind-the-scenes look at the creative process and production workflow.",
    thumbnail: "/uploaded-media/bts-documentary-thumb.jpg",
    videoSrc: "/uploaded-media/bts-documentary.mp4"
  }
]

const shortFormVideos = [
  {
    id: 8,
    postId: "C-NiI64yZsT",
    type: "instagram",
    title: "A Day in TEDx (cinematic)",
    description: "A cinematic recap of an inspiring day at a TEDx event.",
  },
  {
    id: 9,
    postId: "DByd-yky9-c",
    type: "instagram",
    title: "My Dream Bike (cinematic)",
    description: "A visually stunning showcase of a dream bicycle, captured in cinematic style.",
  },
  {
    id: 10,
    type: "uploaded",
    title: "Quick Product Reveal",
    description: "A fast-paced product reveal with dynamic transitions and eye-catching effects.",
    thumbnail: "/uploaded-media/quick-product-thumb.jpg",
    videoSrc: "/uploaded-media/quick-product.mp4"
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

const PortfolioItem = ({ item, isHovered, onHover, index, isLongForm }) => {
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

  // Enhanced animations for long-form videos
  const longFormItemVariants = {
    hidden: { 
      y: 60, 
      opacity: 0,
      scale: 0.8,
      rotateX: -15
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: { 
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
    },
  }

  const shortFormItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.4,
        delay: index * 0.1
      },
    },
  }

  const hoverVariants = {
    hover: {
      scale: 1.05,
      y: -10,
      rotateY: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className="portfolio-item"
      variants={isLongForm ? longFormItemVariants : shortFormItemVariants}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      whileHover="hover"
      variants={isLongForm ? { ...longFormItemVariants, ...hoverVariants } : shortFormItemVariants}
      style={isLongForm ? { perspective: 1000 } : {}}
    >
      <motion.div 
        className="portfolio-type-badge"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: isLongForm ? (index * 0.15) + 0.3 : (index * 0.1) + 0.2, duration: 0.4 }}
      >
        {getIcon()}
      </motion.div>

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

        <motion.div 
          className="portfolio-overlay"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="portfolio-play-button"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            {getOverlayIcon()}
          </motion.div>
        </motion.div>
      </a>

      <motion.div 
        className="portfolio-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isLongForm ? (index * 0.15) + 0.4 : (index * 0.1) + 0.3, duration: 0.4 }}
      >
        <h3 className="portfolio-title">{item.title}</h3>
        <p className="portfolio-description">{item.description}</p>
      </motion.div>
    </motion.div>
  )
}

const VideoSection = ({ title, videos, icon, hoveredItem, onHover, isLongForm = false }) => {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isLongForm ? 0.15 : 0.1,
        delayChildren: 0.2
      },
    },
  }

  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: -30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <motion.div 
      className="video-category"
      ref={sectionRef}
      initial="hidden"
      animate={sectionInView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      <motion.div 
        className="category-header"
        variants={headerVariants}
      >
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {icon}
        </motion.div>
        <motion.h3 
          className="category-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {title}
        </motion.h3>
      </motion.div>
      
      <div className="portfolio-grid">
        {videos.map((item, index) => (
          <PortfolioItem 
            key={item.id}
            item={item} 
            isHovered={hoveredItem === item.id} 
            onHover={onHover}
            index={index}
            isLongForm={isLongForm}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.3,
      },
    },
  }

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <motion.section
      id="my-work"
      className="portfolio-section"
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.h2 
        className="portfolio-section-title"
        variants={titleVariants}
      >
        My Work
      </motion.h2>
      
      <VideoSection
        title="Long-form Videos"
        videos={longFormVideos}
        icon={<FaClock className="category-icon" />}
        hoveredItem={hoveredItem}
        onHover={setHoveredItem}
        isLongForm={true}
      />

      <VideoSection
        title="Short Videos"
        videos={shortFormVideos}
        icon={<FaVideo className="category-icon" />}
        hoveredItem={hoveredItem}
        onHover={setHoveredItem}
        isLongForm={false}
      />
    </motion.section>
  )
}