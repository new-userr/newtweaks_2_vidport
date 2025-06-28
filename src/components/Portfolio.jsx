import React, { useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlay, FaExternalLinkAlt, FaInstagram, FaVideo, FaClock, FaPause } from 'react-icons/fa'
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
    videoId: "dQw4w9WgXcQ",
    type: "youtube",
    title: "Corporate Brand Story",
    description: "A comprehensive brand story video showcasing company values and mission.",
  },
  {
    id: 4,
    videoId: "9bZkp7q19f0",
    type: "youtube",
    title: "Documentary Feature",
    description: "An in-depth documentary exploring social issues and human stories.",
  },
  {
    id: 5,
    videoId: "kJQP7kiw5Fk",
    type: "youtube",
    title: "Educational Series",
    description: "A comprehensive educational series breaking down complex topics into digestible content.",
  },
  {
    id: 6,
    videoId: "jNQXAC9IVRw",
    type: "youtube",
    title: "Client Testimonial Compilation",
    description: "A heartfelt compilation of client testimonials showcasing successful partnerships.",
  },
  {
    id: 7,
    videoId: "ScMzIvxBSi4",
    type: "youtube",
    title: "Behind the Scenes Documentary",
    description: "An exclusive behind-the-scenes look at the creative process and production workflow.",
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
    videoId: "M7lc1UVf-VE",
    type: "youtube",
    title: "Quick Product Reveal",
    description: "A fast-paced product reveal with dynamic transitions and eye-catching effects.",
  }
]

const gradients = [
  "gradient-purple-blue",
  "gradient-pink-orange",
  "gradient-green-blue",
  "gradient-yellow-red",
]

const YouTubeEmbed = ({ videoId, title, isHovered, onLoad }) => {
  const iframeRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isLoaded && iframeRef.current) {
      try {
        if (isHovered && !isPlaying) {
          // Send play command to iframe
          iframeRef.current.contentWindow?.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            '*'
          )
          setIsPlaying(true)
        } else if (!isHovered && isPlaying) {
          // Send pause command to iframe
          iframeRef.current.contentWindow?.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*'
          )
          setIsPlaying(false)
        }
      } catch (error) {
        console.log('YouTube API interaction failed:', error)
      }
    }
  }, [isHovered, isLoaded, isPlaying])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  return (
    <div className="youtube-embed-container">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0&showinfo=0&mute=1&loop=1&playlist=${videoId}`}
        title={title}
        className="youtube-iframe"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleLoad}
      />
      <div className="youtube-overlay">
        <motion.div 
          className="youtube-play-indicator"
          animate={{ 
            scale: isPlaying ? 1.2 : 1,
            opacity: isPlaying ? 0.8 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </motion.div>
      </div>
    </div>
  )
}

const YouTubeThumbnail = ({ videoId, title, showEmbed, isHovered, onLoad }) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  if (showEmbed) {
    return <YouTubeEmbed videoId={videoId} title={title} isHovered={isHovered} onLoad={onLoad} />
  }

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

const PortfolioItem = ({ item, index, isLongForm }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const hoverTimeoutRef = useRef(null)

  const gradientClass = useMemo(
    () => (item.type === "instagram" ? gradients[(item.id - 1) % gradients.length] : ""),
    [item.id, item.type]
  )

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (item.type === "youtube") {
      // Delay showing embed to avoid loading too many videos at once
      hoverTimeoutRef.current = setTimeout(() => {
        setShowEmbed(true)
      }, 500)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    // Keep embed loaded but pause video
    if (item.type === "youtube" && showEmbed) {
      // Don't immediately hide embed to avoid flickering
      setTimeout(() => {
        if (!isHovered) {
          setShowEmbed(false)
          setIsLoaded(false)
        }
      }, 1000)
    }
  }

  const getHref = () => {
    if (item.type === "youtube") {
      return `https://www.youtube.com/watch?v=${item.videoId}`
    } else if (item.type === "instagram") {
      return `https://www.instagram.com/reel/${item.postId}/`
    }
    return "#"
  }

  const getIcon = () => {
    if (item.type === "youtube") return <FaPlay />
    if (item.type === "instagram") return <FaInstagram />
    return <FaPlay />
  }

  const getOverlayIcon = () => {
    if (item.type === "youtube") {
      return <FaPlay className="play-icon" />
    }
    return <FaExternalLinkAlt className="external-icon" />
  }

  const itemVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      },
    },
  }

  return (
    <motion.div
      className={`portfolio-item ${isLongForm ? 'long-form' : 'short-form'} ${isHovered ? 'hovered' : ''}`}
      variants={itemVariants}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.05,
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      <motion.div 
        className="portfolio-type-badge"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: (index * 0.1) + 0.3, duration: 0.4 }}
      >
        {getIcon()}
      </motion.div>

      <a
        href={getHref()}
        target="_blank"
        rel="noopener noreferrer"
        className={`portfolio-link ${gradientClass}`}
        onClick={(e) => {
          // Prevent navigation when hovering over embedded video
          if (showEmbed && isHovered) {
            e.preventDefault()
          }
        }}
      >
        {item.type === "youtube" ? (
          <YouTubeThumbnail 
            videoId={item.videoId} 
            title={item.title} 
            showEmbed={showEmbed}
            isHovered={isHovered}
            onLoad={() => setIsLoaded(true)}
          />
        ) : (
          <InstagramPlaceholder gradientClass={gradientClass} />
        )}

        <motion.div 
          className="portfolio-overlay"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: (isHovered && !showEmbed) ? 1 : 0 
          }}
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
        transition={{ delay: (index * 0.1) + 0.4, duration: 0.4 }}
      >
        <h3 className="portfolio-title">{item.title}</h3>
        <p className="portfolio-description">{item.description}</p>
      </motion.div>
    </motion.div>
  )
}

const VideoSection = ({ title, videos, icon, isLongForm = false, scrollDirection = "right" }) => {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Duplicate videos for infinite scroll effect
  const duplicatedVideos = [...videos, ...videos]

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      
      <div className="portfolio-scroll-container">
        <div className="portfolio-scroll-wrapper">
          <div className={`portfolio-infinite-scroll scroll-${scrollDirection}`}>
            {duplicatedVideos.map((item, index) => (
              <PortfolioItem 
                key={`${item.id}-${index}`}
                item={item} 
                index={index % videos.length}
                isLongForm={isLongForm}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
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
        isLongForm={true}
        scrollDirection="right"
      />

      <VideoSection
        title="Short Videos"
        videos={shortFormVideos}
        icon={<FaVideo className="category-icon" />}
        isLongForm={false}
        scrollDirection="left"
      />
    </motion.section>
  )
}