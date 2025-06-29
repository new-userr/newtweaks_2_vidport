import { useEffect, useRef, useCallback } from 'react'

export const useCursor = () => {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const particlesRef = useRef([])
  const mousePosition = useRef({ x: 0, y: 0 })
  const followerPosition = useRef({ x: 0, y: 0 })
  const animationFrameId = useRef(null)
  const lastParticleTime = useRef(0)

  // Create cursor elements
  const createCursorElements = useCallback(() => {
    // Main cursor
    const cursor = document.createElement('div')
    cursor.className = 'custom-cursor'
    document.body.appendChild(cursor)
    cursorRef.current = cursor

    // Cursor follower
    const follower = document.createElement('div')
    follower.className = 'cursor-follower'
    document.body.appendChild(follower)
    followerRef.current = follower
  }, [])

  // Create particle effect
  const createParticle = useCallback((x, y) => {
    const now = Date.now()
    if (now - lastParticleTime.current < 50) return // Throttle particle creation
    
    lastParticleTime.current = now
    
    const particle = document.createElement('div')
    particle.className = 'cursor-particle'
    particle.style.left = `${x - 2}px`
    particle.style.top = `${y - 2}px`
    
    document.body.appendChild(particle)
    particlesRef.current.push(particle)
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle)
      }
      particlesRef.current = particlesRef.current.filter(p => p !== particle)
    }, 800)
  }, [])

  // Update cursor position with smooth animation
  const updateCursorPosition = useCallback(() => {
    if (!cursorRef.current || !followerRef.current) return

    const cursor = cursorRef.current
    const follower = followerRef.current

    // Update main cursor position (immediate)
    cursor.style.transform = `translate3d(${mousePosition.current.x - 10}px, ${mousePosition.current.y - 10}px, 0)`

    // Update follower position (smooth)
    const dx = mousePosition.current.x - followerPosition.current.x
    const dy = mousePosition.current.y - followerPosition.current.y
    
    followerPosition.current.x += dx * 0.1
    followerPosition.current.y += dy * 0.1
    
    follower.style.transform = `translate3d(${followerPosition.current.x - 20}px, ${followerPosition.current.y - 20}px, 0)`

    // Create particle trail occasionally
    if (Math.random() > 0.85) {
      createParticle(mousePosition.current.x, mousePosition.current.y)
    }

    animationFrameId.current = requestAnimationFrame(updateCursorPosition)
  }, [createParticle])

  // Handle mouse movement
  const handleMouseMove = useCallback((e) => {
    mousePosition.current = { x: e.clientX, y: e.clientY }
  }, [])

  // Handle element hover states
  const handleMouseEnter = useCallback((e) => {
    if (!cursorRef.current || !followerRef.current) return

    const target = e.target
    const cursor = cursorRef.current
    const follower = followerRef.current

    // Remove existing hover classes
    cursor.className = 'custom-cursor'
    follower.className = 'cursor-follower'

    // Add appropriate hover class based on element type
    if (target.matches('a, button, [role="button"], .clickable')) {
      if (target.matches('button, [role="button"], .header-button')) {
        cursor.classList.add('hover-button')
        follower.classList.add('hover-button')
      } else {
        cursor.classList.add('hover-link')
        follower.classList.add('hover-link')
      }
    } else if (target.matches('video, .portfolio-item, .youtube-embed-container, [data-media]')) {
      cursor.classList.add('hover-media')
      follower.classList.add('hover-media')
    } else if (target.matches('input, textarea, [contenteditable]')) {
      cursor.classList.add('selecting-text')
      follower.classList.add('selecting-text')
    } else if (target.matches('[disabled], .disabled')) {
      cursor.classList.add('not-allowed')
      follower.classList.add('not-allowed')
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!cursorRef.current || !followerRef.current) return

    cursorRef.current.className = 'custom-cursor'
    followerRef.current.className = 'cursor-follower'
  }, [])

  // Handle loading states
  const setLoadingState = useCallback((isLoading) => {
    if (!cursorRef.current || !followerRef.current) return

    if (isLoading) {
      cursorRef.current.classList.add('loading')
      followerRef.current.classList.add('loading')
    } else {
      cursorRef.current.classList.remove('loading')
      followerRef.current.classList.remove('loading')
    }
  }, [])

  // Initialize cursor
  useEffect(() => {
    // Check if device supports hover (not touch-only)
    const supportsHover = window.matchMedia('(hover: hover)').matches
    if (!supportsHover) return

    createCursorElements()

    // Start animation loop
    animationFrameId.current = requestAnimationFrame(updateCursorPosition)

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current)
        }
      } else {
        animationFrameId.current = requestAnimationFrame(updateCursorPosition)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup function
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      // Remove cursor elements
      if (cursorRef.current && cursorRef.current.parentNode) {
        cursorRef.current.parentNode.removeChild(cursorRef.current)
      }
      if (followerRef.current && followerRef.current.parentNode) {
        followerRef.current.parentNode.removeChild(followerRef.current)
      }

      // Remove particles
      particlesRef.current.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
    }
  }, [createCursorElements, updateCursorPosition, handleMouseMove, handleMouseEnter, handleMouseLeave])

  return { setLoadingState }
}