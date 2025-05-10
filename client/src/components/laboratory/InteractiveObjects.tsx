import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLabStore } from "../../lib/stores/useLabStore";
import { useEquipmentInteraction } from "../../lib/hooks/useEquipmentInteraction";
import { useKeyboardControls } from "@react-three/drei";
import { useAudio } from "../../lib/stores/useAudio";

export function InteractiveObjects() {
  const { camera } = useThree();
  const { handleInteract } = useEquipmentInteraction();
  const { playHit } = useAudio();
  
  // Get keyboard controls state and subscribe method
  const [, getKeyboardState] = useKeyboardControls();
  
  // Track previous interact state for edge detection
  const prevInteractRef = useRef(false);
  
  // Add handlers for keyboard navigation
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
    
    return () => {
      clearInterval(soundInterval);
    };
  }, [getKeyboardState, playHit]);
  
  // Handle movement with frame timing
  useFrame(() => {
    const {
      movePlayer,
      rotatePlayer,
      lookUpDown
    } = useLabStore.getState();
    
    // Get current keyboard state
    const state = getKeyboardState();
    
    // Handle player movement
    if (state.forward) movePlayer("forward");
    if (state.backward) movePlayer("backward");
    if (state.left) movePlayer("left");
    if (state.right) movePlayer("right");
    
    // Handle player rotation
    if (state.rotateLeft) rotatePlayer("left");
    if (state.rotateRight) rotatePlayer("right");
    
    // Handle camera look angle
    if (state.rotateLookUp) lookUpDown("up");
    if (state.rotateLookDown) lookUpDown("down");
    
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
