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
  
  // Get keyboard controls state subscriptions
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);
  const interact = useKeyboardControls((state) => state.interact);
  const rotateLeft = useKeyboardControls((state) => state.rotateLeft);
  const rotateRight = useKeyboardControls((state) => state.rotateRight);
  const rotateLookUp = useKeyboardControls((state) => state.rotateLookUp);
  const rotateLookDown = useKeyboardControls((state) => state.rotateLookDown);
  
  // Track previous interact state for edge detection
  const prevInteractRef = useRef(false);
  
  // Add handlers for keyboard navigation
  useEffect(() => {
    const unsubMovement = useKeyboardControls.subscribe(
      (state) => state.forward || state.backward || state.left || state.right,
      (isMoving) => {
        if (isMoving) {
          // Play a subtle sound when moving
          if (Math.random() > 0.9) {
            playHit();
          }
        }
      }
    );
    
    return () => {
      unsubMovement();
    };
  }, [playHit]);
  
  // Handle movement with frame timing
  useFrame(() => {
    const {
      movePlayer,
      rotatePlayer,
      lookUpDown
    } = useLabStore.getState();
    
    // Handle player movement
    if (forward) movePlayer("forward");
    if (backward) movePlayer("backward");
    if (left) movePlayer("left");
    if (right) movePlayer("right");
    
    // Handle player rotation
    if (rotateLeft) rotatePlayer("left");
    if (rotateRight) rotatePlayer("right");
    
    // Handle camera look angle
    if (rotateLookUp) lookUpDown("up");
    if (rotateLookDown) lookUpDown("down");
    
    // Handle interactions with equipment (edge detection)
    if (interact && !prevInteractRef.current) {
      handleInteract();
    }
    prevInteractRef.current = interact;
    
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
