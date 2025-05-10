import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useLabStore } from "../../lib/stores/useLabStore";
import { PerspectiveCamera } from "@react-three/drei";

export function LabCamera() {
  const { camera } = useThree();
  const { playerPosition, playerRotation, cameraLookAngle } = useLabStore();
  
  // Set initial camera position and properties
  useEffect(() => {
    camera.position.copy(playerPosition);
    camera.fov = 75;
    camera.near = 0.1;
    camera.far = 100;
    camera.updateProjectionMatrix();
    
    console.log("Camera initialized at position:", playerPosition);
  }, [camera, playerPosition]);
  
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[playerPosition.x, playerPosition.y, playerPosition.z]}
        fov={75}
        near={0.1}
        far={100}
      />
      
      {/* Helper to show where the player is */}
      <mesh position={[playerPosition.x, playerPosition.y - 1.5, playerPosition.z]} visible={false}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  );
}
