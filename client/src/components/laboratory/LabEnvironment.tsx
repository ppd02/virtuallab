import { useEffect } from "react";
import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLabStore } from "../../lib/stores/useLabStore";
import { initialEquipment } from "../../lib/data/equipmentData";
import { initialExperiments } from "../../lib/data/experimentData";
import { InteractiveObjects } from "./InteractiveObjects";
import { Equipment } from "./Equipment";

export default function LabEnvironment() {
  // Initialize the lab store with equipment and experiments
  useEffect(() => {
    useLabStore.setState({ 
      equipment: initialEquipment,
      experiments: initialExperiments
    });
    console.log("Lab environment initialized");
  }, []);

  return (
    <>
      {/* Environment lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Environment preset="city" />

      {/* Lab structure */}
      <LabRoom />
      
      {/* Lab equipment, tables, etc. */}
      <LabFurniture />
      
      {/* Interactive elements */}
      <InteractiveObjects />
      
      {/* Equipment */}
      <Equipment />
    </>
  );
}

function LabRoom() {
  return (
    <>
      {/* Floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#cecece" />
      </mesh>

      {/* Ceiling */}
      <mesh 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, 3, 0]}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, 1.5, -10]} receiveShadow>
        <boxGeometry args={[20, 3, 0.1]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-10, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.1, 3, 20]} />
        <meshStandardMaterial color="#e6e6e6" />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[10, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.1, 3, 20]} />
        <meshStandardMaterial color="#e6e6e6" />
      </mesh>
      
      {/* Front wall with door */}
      <mesh position={[-5, 1.5, 10]} receiveShadow>
        <boxGeometry args={[10, 3, 0.1]} />
        <meshStandardMaterial color="#e6e6e6" />
      </mesh>
      
      <mesh position={[7.5, 1.5, 10]} receiveShadow>
        <boxGeometry args={[5, 3, 0.1]} />
        <meshStandardMaterial color="#e6e6e6" />
      </mesh>
      
      {/* Door */}
      <mesh position={[2.5, 1.5, 10]} receiveShadow>
        <boxGeometry args={[5, 3, 0.1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </>
  );
}

function LabFurniture() {
  return (
    <>
      {/* Main lab bench in the center */}
      <mesh position={[0, 0.5, -3]} castShadow receiveShadow>
        <boxGeometry args={[8, 1, 2]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>

      {/* Lab bench top surface */}
      <mesh position={[0, 1.01, -3]} receiveShadow>
        <boxGeometry args={[8, 0.05, 2]} />
        <meshStandardMaterial color="#78909c" />
      </mesh>

      {/* Side storage cabinets */}
      <mesh position={[-4, 0.75, -8]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.5, 1]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>

      <mesh position={[4, 0.75, -8]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.5, 1]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>

      {/* Sink */}
      <mesh position={[-3, 1.01, -3]} receiveShadow>
        <boxGeometry args={[1, 0.05, 1]} />
        <meshStandardMaterial color="#b0bec5" />
      </mesh>

      {/* Sink basin */}
      <mesh position={[-3, 0.9, -3]} receiveShadow>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#78909c" />
      </mesh>

      {/* Computer workstation */}
      <mesh position={[6, 0.75, -1]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.5, 1]} />
        <meshStandardMaterial color="#616161" />
      </mesh>

      {/* Computer monitor */}
      <mesh position={[6, 1.9, -1.3]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.6, 0.1]} />
        <meshStandardMaterial color="#263238" />
      </mesh>

      {/* Computer base */}
      <mesh position={[6, 1.4, -1]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.2, 0.7]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>

      {/* Chemical storage shelf on the wall */}
      <mesh position={[-6, 1.5, -8]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>

      <mesh position={[-6, 2, -8]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>

      {/* Ventilation hood */}
      <mesh position={[0, 2, -3]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.1, 1.5]} />
        <meshStandardMaterial color="#78909c" />
      </mesh>

      <mesh position={[0, 1.5, -3.75]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 0.1]} />
        <meshStandardMaterial color="#b0bec5" opacity={0.7} transparent />
      </mesh>

      {/* Floor mats for safety */}
      <mesh position={[0, 0.01, -3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 3]} />
        <meshStandardMaterial color="#455a64" />
      </mesh>
    </>
  );
}
