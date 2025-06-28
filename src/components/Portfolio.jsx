import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlay, FaExternalLinkAlt, FaInstagram, FaVideo, FaClock, FaPause, FaSpinner, FaExclamationTriangle } from 'react-icons/fa'
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
  },
  {
    id: 11,
    videoId: "dQw4w9WgXcQ",
    type: "youtube",
    title: "Social Media Promo",
    description: "An energetic promotional video designed for social media engagement.",
  },
  {
    id: 12,
    videoId: "9bZkp7q19f0",
    type: "youtube",
    title: "Brand Teaser",
    description: "A captivating brand teaser that builds anticipation and excitement.",
  }
]

const gradients = [
  "gradient-purple-blue",
  "gradient-pink-orange",
  "gradient-green-blue",
  "gradient-yellow-red",
]

// Performance optimization: Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Intersection Observer hook for lazy loading
const useLazyLoad = (threshold = 0.1) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
    rootMargin: '50px'
  })
  return [ref, inView]
}

// Enhanced YouTube Player with better connection handling
const YouTubePlayer = ({ 
  videoId, 
  title, 
  isHovered, 
  onLoad, 
  onError, 
  onStateChange,
  isMobile = false 
}) => {
  const iframeRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [connectionError, setConnectionError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const debouncedHover = useDebounce(isHovered, 300)
  const maxRetries = 3

  // Enhanced error handling for YouTube connection issues
  const handleConnectionError = useCallback(() => {
    setConnectionError(true)
    setHasError(true)
    onError?.('YouTube connection failed')
  }, [onError])

  // Retry mechanism for failed connections
  const retryConnection = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1)
      setHasError(false)
      setConnectionError(false)
      setIsLoaded(false)
      
      // Force iframe reload
      if (iframeRef.current) {
        const currentSrc = iframeRef.current.src
        iframeRef.current.src = ''
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = currentSrc
          }
        }, 100)
      }
    }
  }, [retryCount, maxRetries])

  // YouTube API message handler with better error handling
  const handleMessage = useCallback((event) => {
    // Only accept messages from YouTube
    if (!event.origin.includes('youtube.com')) return

    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      
      if (data.event === 'video-progress') {
        // Video is playing successfully
        setConnectionError(false)
      }
      
      if (data.info?.playerState !== undefined) {
        const playing = data.info.playerState === 1
        setIsPlaying(playing)
        onStateChange?.(data.info.playerState)
        
        // Reset connection error if video starts playing
        if (playing) {
          setConnectionError(false)
        }
      }
    } catch (error) {
      console.warn('YouTube API message parsing failed:', error)
    }
  }, [onStateChange])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  // Enhanced auto-play logic with connection error handling
  useEffect(() => {
    if (!isLoaded || !iframeRef.current || connectionError) return

    const iframe = iframeRef.current
    
    try {
      if (debouncedHover && !isPlaying && !isMobile) {
        // Test if iframe is accessible before sending commands
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            '*'
          )
        } else {
          handleConnectionError()
        }
      } else if (!debouncedHover && isPlaying) {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*'
          )
        }
      }
    } catch (error) {
      console.warn('YouTube API command failed:', error)
      handleConnectionError()
    }
  }, [debouncedHover, isLoaded, isPlaying, isMobile, connectionError, handleConnectionError])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    setHasError(false)
    setConnectionError(false)
    onLoad?.()
  }, [onLoad])

  const handleIframeError = useCallback(() => {
    handleConnectionError()
  }, [handleConnectionError])

  // Enhanced embed URL with better parameters for connection reliability
  const embedUrl = useMemo(() => {
    const params = new URLSearchParams({
      enablejsapi: '1',
      controls: isMobile ? '1' : '0',
      modestbranding: '1',
      rel: '0',
      showinfo: '0',
      mute: '1',
      autoplay: '0',
      loop: '1',
      playlist: videoId,
      origin: window.location.origin,
      // Additional parameters for better connection reliability
      fs: '1',
      hl: 'en',
      cc_load_policy: '0',
      iv_load_policy: '3',
      // Disable annotations and related videos
      disablekb: '1',
      playsinline: '1'
    })
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
  }, [videoId, isMobile])

  if (hasError && retryCount >= maxRetries) {
    return (
      <div className="youtube-error" role="alert" aria-label="Video failed to load">
        <FaExclamationTriangle className="error-icon" />
        <span>Video unavailable</span>
        <small>YouTube connection failed</small>
      </div>
    )
  }

  if (connectionError && retryCount < maxRetries) {
    return (
      <div className="youtube-error" role="alert" aria-label="Video connection error">
        <FaExclamationTriangle className="error-icon" />
        <span>Connection issue</span>
        <button 
          onClick={retryConnection}
          className="retry-button"
          aria-label="Retry loading video"
        >
          Retry ({retryCount + 1}/{maxRetries})
        </button>
      </div>
    )
  }

  return (
    <div className="youtube-embed-container" role="region" aria-label={`Video: ${title}`}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        className="youtube-iframe"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleIframeError}
        loading="lazy"
        aria-label={`YouTube video: ${title}`}
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
      
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div 
            className="youtube-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="status"
            aria-label="Loading video"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FaSpinner className="loading-spinner" />
            </motion.div>
            <span className="sr-only">Loading video...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoaded && !hasError && (
        <div className="youtube-controls" aria-hidden="true">
          <motion.div 
            className="play-state-indicator"
            animate={{ 
              scale: isPlaying ? 1.2 : 1,
              opacity: isPlaying ? 0.8 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Enhanced thumbnail component with multiple fallback sources
const YouTubeThumbnail = ({ videoId, title, onLoad }) => {
  const [imageRef, imageInView] = useLazyLoad()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0)

  // Multiple thumbnail quality options as fallbacks
  const thumbnailUrls = useMemo(() => [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/default.jpg`
  ], [videoId])

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
    setImageError(false)
    onLoad?.()
  }, [onLoad])

  const handleImageError = useCallback(() => {
    if (currentThumbnailIndex < thumbnailUrls.length - 1) {
      // Try next thumbnail quality
      setCurrentThumbnailIndex(prev => prev + 1)
    } else {
      // All thumbnails failed
      setImageError(true)
    }
  }, [currentThumbnailIndex, thumbnailUrls.length])

  return (
    <div ref={imageRef} className="thumbnail-container">
      {imageInView && !imageError && (
        <img
          src={thumbnailUrls[currentThumbnailIndex]}
          alt={`${title} thumbnail`}
          className={`portfolio-thumbnail ${imageLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      {imageError && (
        <div className="thumbnail-error" role="img" aria-label="Thumbnail unavailable">
          <FaVideo />
          <span>Preview unavailable</span>
        </div>
      )}
      {!imageLoaded && imageInView && !imageError && (
        <div className="thumbnail-loading" role="status" aria-label="Loading thumbnail">
          <FaSpinner className="loading-spinner" />
        </div>
      )}
    </div>
  )
}

// Instagram placeholder component
const InstagramPlaceholder = ({ gradientClass, title }) => {
  return (
    <div 
      className={`instagram-placeholder ${gradientClass}`}
      role="img"
      aria-label={`Instagram post: ${title}`}
    >
      <FaInstagram className="instagram-icon" aria-hidden="true" />
      <div className="instagram-label">
        <span>View on Instagram</span>
      </div>
    </div>
  )
}

// Enhanced portfolio item component with better error handling
const PortfolioItem = ({ item, index, isLongForm }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [engagementTime, setEngagementTime] = useState(0)
  const hoverTimeoutRef = useRef(null)
  const engagementTimerRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile devices and connection quality
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const gradientClass = useMemo(
    () => (item.type === "instagram" ? gradients[(item.id - 1) % gradients.length] : ""),
    [item.id, item.type]
  )

  // Engagement tracking
  const startEngagementTimer = useCallback(() => {
    const startTime = Date.now()
    engagementTimerRef.current = setInterval(() => {
      setEngagementTime(Date.now() - startTime)
    }, 100)
  }, [])

  const stopEngagementTimer = useCallback(() => {
    if (engagementTimerRef.current) {
      clearInterval(engagementTimerRef.current)
      engagementTimerRef.current = null
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    startEngagementTimer()
    
    // Only show embed for YouTube videos on desktop with good connection
    if (item.type === "youtube" && !isMobile && navigator.onLine !== false) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowEmbed(true)
      }, 500)
    }
  }, [item.type, isMobile, startEngagementTimer])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    stopEngagementTimer()
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    
    if (item.type === "youtube" && showEmbed) {
      setTimeout(() => {
        if (!isHovered) {
          setShowEmbed(false)
        }
      }, 1000)
    }
  }, [isHovered, item.type, showEmbed, stopEngagementTimer])

  // Touch handlers for mobile
  const handleTouchStart = useCallback(() => {
    if (isMobile && item.type === "youtube") {
      // On mobile, just navigate to YouTube instead of embedding
      window.open(getHref(), '_blank', 'noopener,noreferrer')
    }
  }, [isMobile, item.type])

  const getHref = useCallback(() => {
    if (item.type === "youtube") {
      return `https://www.youtube.com/watch?v=${item.videoId}`
    } else if (item.type === "instagram") {
      return `https://www.instagram.com/reel/${item.postId}/`
    }
    return "#"
  }, [item])

  const getIcon = useCallback(() => {
    if (item.type === "youtube") return <FaPlay aria-hidden="true" />
    if (item.type === "instagram") return <FaInstagram aria-hidden="true" />
    return <FaPlay aria-hidden="true" />
  }, [item.type])

  const getOverlayIcon = useCallback(() => {
    if (item.type === "youtube") {
      return <FaPlay className="play-icon" aria-hidden="true" />
    }
    return <FaExternalLinkAlt className="external-icon" aria-hidden="true" />
  }, [item.type])

  const handleError = useCallback((error) => {
    setHasError(true)
    console.warn(`Error loading ${item.title}:`, error)
  }, [item.title])

  const handleStateChange = useCallback((state) => {
    // YouTube player state tracking
    if (state === 1) {
      startEngagementTimer()
    } else {
      stopEngagementTimer()
    }
  }, [startEngagementTimer, stopEngagementTimer])

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
    <motion.article
      className={`portfolio-item ${isLongForm ? 'long-form' : 'short-form'} ${isHovered ? 'hovered' : ''} ${hasError ? 'error' : ''}`}
      variants={itemVariants}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      whileHover={{
        scale: 1.05,
        y: -10,
        transition: { duration: 0.3 }
      }}
      role="article"
      aria-label={`Portfolio item: ${item.title}`}
    >
      <motion.div 
        className="portfolio-type-badge"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: (index * 0.1) + 0.3, duration: 0.4 }}
        aria-label={`Content type: ${item.type}`}
      >
        {getIcon()}
      </motion.div>

      <a
        href={getHref()}
        target="_blank"
        rel="noopener noreferrer"
        className={`portfolio-link ${gradientClass}`}
        onClick={(e) => {
          if (showEmbed && isHovered && !isMobile) {
            e.preventDefault()
          }
        }}
        aria-label={`Open ${item.title} in new tab`}
      >
        {item.type === "youtube" ? (
          showEmbed && !isMobile ? (
            <YouTubePlayer 
              videoId={item.videoId} 
              title={item.title} 
              isHovered={isHovered}
              onLoad={() => setIsLoaded(true)}
              onError={handleError}
              onStateChange={handleStateChange}
              isMobile={isMobile}
            />
          ) : (
            <YouTubeThumbnail 
              videoId={item.videoId} 
              title={item.title} 
              onLoad={() => setIsLoaded(true)}
            />
          )
        ) : (
          <InstagramPlaceholder 
            gradientClass={gradientClass} 
            title={item.title}
          />
        )}

        <AnimatePresence>
          {(isHovered && !showEmbed) && (
            <motion.div 
              className="portfolio-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              role="presentation"
            >
              <motion.div 
                className="portfolio-play-button"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
              >
                {getOverlayIcon()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </a>

      <motion.div 
        className="portfolio-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: (index * 0.1) + 0.4, duration: 0.4 }}
      >
        <h3 className="portfolio-title">{item.title}</h3>
        <p className="portfolio-description">{item.description}</p>
        {engagementTime > 0 && (
          <div className="engagement-indicator" aria-hidden="true">
            <span className="sr-only">Engagement time: {Math.round(engagementTime / 1000)} seconds</span>
          </div>
        )}
      </motion.div>
    </motion.article>
  )
}

// Video section component with infinite scroll
const VideoSection = ({ title, videos, icon, isLongForm = false, scrollDirection = "right" }) => {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const duplicatedVideos = useMemo(() => [...videos, ...videos], [videos])

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
    <motion.section 
      className="video-category"
      ref={sectionRef}
      initial="hidden"
      animate={sectionInView ? "visible" : "hidden"}
      variants={sectionVariants}
      role="region"
      aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}
    >
      <motion.header 
        className="category-header"
        variants={headerVariants}
      >
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          aria-hidden="true"
        >
          {icon}
        </motion.div>
        <motion.h3 
          id={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}
          className="category-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {title}
        </motion.h3>
      </motion.header>
      
      <div 
        className="portfolio-scroll-container"
        role="region"
        aria-label={`${title} portfolio items`}
      >
        <div className="portfolio-scroll-wrapper">
          <div 
            className={`portfolio-infinite-scroll scroll-${scrollDirection}`}
            role="list"
            aria-label={`Scrolling list of ${title.toLowerCase()}`}
          >
            {duplicatedVideos.map((item, index) => (
              <div key={`${item.id}-${index}`} role="listitem">
                <PortfolioItem 
                  item={item} 
                  index={index % videos.length}
                  isLongForm={isLongForm}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

// Main Portfolio component
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
    <motion.main
      id="my-work"
      className="portfolio-section"
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      role="main"
      aria-labelledby="portfolio-heading"
    >
      <motion.h2 
        id="portfolio-heading"
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
    </motion.main>
  )
}