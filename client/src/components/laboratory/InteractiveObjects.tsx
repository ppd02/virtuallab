import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLabStore } from "../../lib/stores/useLabStore";
import { useEquipmentInteraction } from "../../lib/hooks/useEquipmentInteraction";
import { useKeyboardControls } from "@react-three/drei";
import { useAudio } from "../../lib/stores/useAudio";

export function InteractiveObjects() {
  const { camera, gl } = useThree();
  const { handleInteract } = useEquipmentInteraction();
  const { playHit } = useAudio();
  
  // Get keyboard controls state and subscribe method
  const [, getKeyboardState] = useKeyboardControls();
  
  // Track previous interact state for edge detection
  const prevInteractRef = useRef(false);
  
  // Mouse control states
  const [isRightMouseDown, setIsRightMouseDown] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const prevMousePosition = useRef({ x: 0, y: 0 });
  
  // Add handlers for keyboard navigation and mouse controls
  useEffect(() => {
    // We'll handle movement sounds in the frame loop instead of with a subscription
    const soundInterval = setInterval(() => {
      const state = getKeyboardState();
      if (state.forward || state.backward || state.left || state.right) {
        // Play a subtle sound when moving, but not too frequently
        if (Math.random() > 0.9) {
          playHit();
        }
      }
    }, 200); // Check movement every 200ms
    
    // Mouse control handlers
    const handleMouseDown = (event: MouseEvent) => {
      // Right mouse button (button 2)
      if (event.button === 2) {
        setIsRightMouseDown(true);
        mousePosition.current = { x: event.clientX, y: event.clientY };
        prevMousePosition.current = { x: event.clientX, y: event.clientY };
        
        // Disable context menu when right-clicking
        gl.domElement.oncontextmenu = (e) => {
          e.preventDefault();
          return false;
        };
      }
    };
    
    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 2) {
        setIsRightMouseDown(false);
      }
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      if (isRightMouseDown) {
        mousePosition.current = { x: event.clientX, y: event.clientY };
      }
    };
    
    // Add mouse event listeners
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      clearInterval(soundInterval);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [getKeyboardState, playHit, isRightMouseDown, gl.domElement]);
  
  // Handle movement with frame timing
  useFrame(() => {
    const {
      movePlayer,
      rotatePlayer,
      lookUpDown,
      setPlayerRotation,
      setCameraLookAngle
    } = useLabStore.getState();
    
    // Get current keyboard state
    const state = getKeyboardState();
    
    // Handle player movement
    if (state.forward) movePlayer("forward");
    if (state.backward) movePlayer("backward");
    if (state.left) movePlayer("left");
    if (state.right) movePlayer("right");
    
    // Handle keyboard rotation (as a fallback)
    if (state.rotateLeft) rotatePlayer("left");
    if (state.rotateRight) rotatePlayer("right");
    if (state.rotateLookUp) lookUpDown("up");
    if (state.rotateLookDown) lookUpDown("down");
    
    // Handle mouse rotation and look
    if (isRightMouseDown) {
      // Calculate mouse movement delta
      const deltaX = mousePosition.current.x - prevMousePosition.current.x;
      const deltaY = mousePosition.current.y - prevMousePosition.current.y;
      
      // Update player rotation (horizontal mouse movement)
      if (deltaX !== 0) {
        const { playerRotation } = useLabStore.getState();
        // Adjust sensitivity as needed
        const newRotation = playerRotation - deltaX * 0.2;
        setPlayerRotation(newRotation);
      }
      
      // Update camera look angle (vertical mouse movement)
      if (deltaY !== 0) {
        const { cameraLookAngle } = useLabStore.getState();
        // Adjust sensitivity as needed - INVERTED the sign for deltaY to fix axis
        const newLookAngle = Math.max(Math.min(cameraLookAngle - deltaY * 0.2, 45), -45);
        setCameraLookAngle(newLookAngle);
      }
      
      // Update previous mouse position
      prevMousePosition.current = { ...mousePosition.current };
    }
    
    // Handle interactions with equipment (edge detection)
    if (state.interact && !prevInteractRef.current) {
      handleInteract();
    }
    prevInteractRef.current = state.interact;
    
    // Update camera position and rotation from lab store
    const { playerPosition, playerRotation, cameraLookAngle } = useLabStore.getState();
    
    // Set camera position to follow player
    camera.position.copy(playerPosition);
    
    // Apply rotation from player rotation and look angle
    const rotationY = (playerRotation * Math.PI) / 180;
    const rotationX = (cameraLookAngle * Math.PI) / 180;
    
    camera.rotation.set(rotationX, rotationY, 0, "YXZ");
  });
  
  return null;
}
