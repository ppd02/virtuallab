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

      {/* Lab stools */}
      {[-2, 0, 2].map((x, index) => (
        <group key={`stool-${index}`} position={[x, 0, -1.5]}>
          {/* Stool seat */}
          <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
            <meshStandardMaterial color="#37474f" />
          </mesh>
          {/* Stool pole */}
          <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.65, 8]} />
            <meshStandardMaterial color="#78909c" />
          </mesh>
          {/* Stool base */}
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
            <meshStandardMaterial color="#37474f" />
          </mesh>
        </group>
      ))}

      {/* Small lab equipment */}
      {/* Row of books on wall shelf */}
      {Array.from({ length: 5 }).map((_, index) => (
        <mesh 
          key={`book-${index}`} 
          position={[-6 + index * 0.2 - 0.4, 2.15, -8]} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[0.16, 0.3, 0.7]} />
          <meshStandardMaterial color={
            ['#1565c0', '#6a1b9a', '#2e7d32', '#c62828', '#ef6c00'][index % 5]
          } />
        </mesh>
      ))}
      
      {/* Microscope slides box */}
      <mesh position={[1.5, 1.15, -3]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.15, 0.3]} />
        <meshStandardMaterial color="#b3e5fc" />
      </mesh>

      {/* Tissue box */}
      <mesh position={[-1.8, 1.15, -3]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#e1bee7" />
      </mesh>

      {/* Safety equipment */}
      {/* Safety goggles */}
      <mesh position={[3.5, 1.15, -3]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.1, 0.2]} />
        <meshStandardMaterial color="#ffecb3" />
      </mesh>

      {/* Wall clock */}
      <group position={[0, 2.5, -9.9]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#eceff1" />
        </mesh>
        <mesh position={[0, 0, 0.03]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.15, 0, 0.03]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 0.02, 0.01]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 0.2, 0.03]} rotation={[0, 0, Math.PI / 1.5]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.02, 0.01]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>

      {/* Whiteboard */}
      <mesh position={[-8, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 2, 0.05]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-9.95, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 2, 0.03]} />
        <meshStandardMaterial color="#546e7a" />
      </mesh>

      {/* Ceiling lights */}
      {[-6, 0, 6].map((x, i) => (
        <group key={`light-${i}`} position={[x, 2.95, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 0.1, 0.5]} />
            <meshStandardMaterial color="#eceff1" />
          </mesh>
          <pointLight intensity={0.5} position={[0, -0.1, 0]} color="#ffffff" />
        </group>
      ))}

      {/* Posters */}
      <mesh position={[9.95, 1.5, -5]} rotation={[0, -Math.PI/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.5, 0.01]} />
        <meshStandardMaterial color="#bbdefb" />
      </mesh>
      <mesh position={[9.95, 1.5, 5]} rotation={[0, -Math.PI/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.5, 0.01]} />
        <meshStandardMaterial color="#f8bbd0" />
      </mesh>

      {/* Small decorative plants */}
      <group position={[-4.5, 1.1, -8]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
          <meshStandardMaterial color="#795548" />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#2e7d32" />
        </mesh>
      </group>
    </>
  );
}
