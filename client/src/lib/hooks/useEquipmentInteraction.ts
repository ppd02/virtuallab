import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLabStore } from "../stores/useLabStore";
import { useAudio } from "../stores/useAudio";

export function useEquipmentInteraction() {
  const { raycaster, camera, scene } = useThree();
  const mousePosition = useRef(new THREE.Vector2());
  const { 
    equipment, 
    selectedEquipment, 
    selectEquipment, 
    grabEquipment,
    heldEquipment,
    placeEquipment,
    setMessage
  } = useLabStore();
  const { playHit } = useAudio();

  // Handle mouse movement for raycasting
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Handle equipment interaction
  const checkInteraction = () => {
    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mousePosition.current, camera);

    // Get all intersected objects
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      // Find the first intersected object that has userData with an equipmentId
      for (const intersect of intersects) {
        const object = intersect.object;
        if (object.userData && object.userData.equipmentId) {
          const equipmentId = object.userData.equipmentId;
          const equipment = useLabStore.getState().equipment.find(e => e.id === equipmentId);
          
          if (equipment && equipment.interactive) {
            return {
              equipmentId,
              point: intersect.point.clone(),
              equipment
            };
          }
        }
      }
    }
    
    return null;
  };

  // Handle equipment selection with improved feedback
  const handleSelect = () => {
    const interaction = checkInteraction();
    
    if (interaction) {
      const { equipmentId, equipment } = interaction;
      selectEquipment(equipmentId);
      
      // More informative messages based on equipment type
      let message = `Selected: ${equipment.name}`;
      
      if (equipment.type === "chemical") {
        message += ` - Contains: ${equipment.contents?.join(", ") || "empty"}`;
      } else if (equipment.type === "beaker" || equipment.type === "test_tube") {
        message += ` - ${equipment.contents?.length ? 
          `Contains: ${equipment.contents.join(", ")}` : 
          "Empty - ready for chemicals"}`;
      } else if (equipment.type === "bunsen_burner") {
        message += ` - ${equipment.temperature && equipment.temperature > 50 ? 
          `Active (${equipment.temperature}°C)` : 
          "Inactive - press E to light"}`;
      }
      
      setMessage(message);
      playHit();
      console.log(`Selected equipment: ${equipment.name}`);
      return true;
    } else {
      selectEquipment(null);
      setMessage(null);
      return false;
    }
  };

  // Handle grabbing equipment with improved feedback
  const handleGrab = () => {
    if (heldEquipment) {
      // If already holding something, try to place it
      const interaction = checkInteraction();
      if (interaction) {
        // Place it at the interaction point
        placeEquipment(interaction.point);
        playHit();
        
        // Get the held equipment details
        const heldItem = useLabStore.getState().equipment.find(e => e.id === heldEquipment);
        setMessage(`Placed ${heldItem?.name || 'equipment'} on the table`);
        console.log(`Placed equipment at:`, interaction.point);
      } else {
        // Place at default position in front of player
        const { playerPosition, playerRotation } = useLabStore.getState();
        const playerRotationRad = (playerRotation * Math.PI) / 180;
        const offsetX = -Math.sin(playerRotationRad) * 1;
        const offsetZ = -Math.cos(playerRotationRad) * 1;
        
        const placementPosition = new THREE.Vector3(
          playerPosition.x + offsetX,
          1, // Fixed y position for table height
          playerPosition.z + offsetZ
        );
        
        placeEquipment(placementPosition);
        playHit();
        
        const heldItem = useLabStore.getState().equipment.find(e => e.id === heldEquipment);
        setMessage(`Placed ${heldItem?.name || 'equipment'} on the table`);
      }
      return;
    }
    
    // Try to grab something
    if (selectedEquipment) {
      const equipment = useLabStore.getState().equipment.find(e => e.id === selectedEquipment);
      grabEquipment(selectedEquipment);
      
      if (equipment) {
        setMessage(`Grabbed: ${equipment.name} - Use E to place it`);
        playHit();
        console.log(`Grabbed equipment: ${selectedEquipment}`);
      }
    }
  };

  // Handle equipment interaction
  const handleInteract = () => {
    // If holding equipment, try to place it
    if (heldEquipment) {
      handleGrab();
      return;
    }
    
    // Otherwise, select or interact with equipment
    const wasSelected = handleSelect();
    
    if (wasSelected && selectedEquipment) {
      // If successfully selected, can grab it
      console.log(`Ready to grab: ${selectedEquipment}`);
    }
  };

  return { handleInteract, handleSelect, handleGrab };
}
