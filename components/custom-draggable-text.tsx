"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface CustomDraggableTextProps {
  text: string
  position: { x: number; y: number }
  onPositionChange: (position: { x: number; y: number }) => void
  style: React.CSSProperties
  defaultPosition: "top" | "bottom"
}

export default function CustomDraggableText({
  text,
  position,
  onPositionChange,
  style,
  defaultPosition,
}: CustomDraggableTextProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const textRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  
  // Only enable dragging on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle mouse down event to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!textRef.current) return

    // Prevent default behavior and text selection
    e.preventDefault()

    // Calculate the offset between mouse position and element position
    const rect = textRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - position.x
    const offsetY = e.clientY - rect.top - position.y

    setDragOffset({ x: offsetX, y: offsetY })
    setIsDragging(true)
  }

  // Handle mouse move event during dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !textRef.current) return

    const rect = textRef.current.parentElement?.getBoundingClientRect()
    if (!rect) return

    // Calculate new position
    const newX = e.clientX - rect.left - dragOffset.x
    const newY = e.clientY - rect.top - dragOffset.y

    // Apply bounds to keep text within parent container
    const maxX = rect.width - (textRef.current.offsetWidth || 0)
    const maxY = rect.height - (textRef.current.offsetHeight || 0)

    const boundedX = Math.max(0, Math.min(newX, maxX))
    const boundedY = Math.max(0, Math.min(newY, maxY))

    onPositionChange({ x: boundedX, y: boundedY })
  }

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add and remove event listeners
  useEffect(() => {
    if (mounted) {
      if (isDragging) {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, mounted])

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!textRef.current) return

    // Prevent default behavior
    e.preventDefault()

    // Calculate the offset between touch position and element position
    const rect = textRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const offsetX = touch.clientX - rect.left - position.x
    const offsetY = touch.clientY - rect.top - position.y

    setDragOffset({ x: offsetX, y: offsetY })
    setIsDragging(true)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !textRef.current) return

    const rect = textRef.current.parentElement?.getBoundingClientRect()
    if (!rect) return

    // Calculate new position
    const touch = e.touches[0]
    const newX = touch.clientX - rect.left - dragOffset.x
    const newY = touch.clientY - rect.top - dragOffset.y

    // Apply bounds to keep text within parent container
    const maxX = rect.width - (textRef.current.offsetWidth || 0)
    const maxY = rect.height - (textRef.current.offsetHeight || 0)

    const boundedX = Math.max(0, Math.min(newX, maxX))
    const boundedY = Math.max(0, Math.min(newY, maxY))

    onPositionChange({ x: boundedX, y: boundedY })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Add and remove touch event listeners
  useEffect(() => {
    if (mounted) {
      if (isDragging) {
        window.addEventListener("touchmove", handleTouchMove)
        window.addEventListener("touchend", handleTouchEnd)
      }

      return () => {
        window.removeEventListener("touchmove", handleTouchMove)
        window.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isDragging, mounted])

  // Combine style with position
  const combinedStyle: React.CSSProperties = {
    ...style,
    position: "absolute",
    transform: `translate(${position.x}px, ${position.y}px)`,
    cursor: mounted ? "move" : "default",
    userSelect: "none",
    touchAction: "none",
  }

  return (
    <div
      ref={textRef}
      style={combinedStyle}
      onMouseDown={mounted ? handleMouseDown : undefined}
      onTouchStart={mounted ? handleTouchStart : undefined}
      className="p-2 z-10"
    >
      {text}
    </div>
  )
}
