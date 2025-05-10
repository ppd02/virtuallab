import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useLabStore } from "../../lib/stores/useLabStore";
import { Text } from "@react-three/drei";

export function Equipment() {
  const { equipment, selectedEquipment, heldEquipment, playerPosition, playerRotation } = useLabStore();
  
  useFrame(() => {
    // Update the position of held equipment to follow the player
    if (heldEquipment) {
      const equipment = useLabStore.getState().equipment.find(e => e.id === heldEquipment);
      if (equipment) {
        // Calculate position in front of the player
        const playerRotationRad = (playerRotation * Math.PI) / 180;
        const offsetX = -Math.sin(playerRotationRad) * 0.5;
        const offsetZ = -Math.cos(playerRotationRad) * 0.5;
        
        const newPosition = new THREE.Vector3(
          playerPosition.x + offsetX,
          playerPosition.y - 0.3, // Slightly below eye level
          playerPosition.z + offsetZ
        );
        
        // Update equipment position
        const updatedEquipment = useLabStore.getState().equipment.map(e => 
          e.id === heldEquipment 
            ? { ...e, position: newPosition } 
            : e
        );
        
        useLabStore.setState({ equipment: updatedEquipment });
      }
    }
  });
  
  return (
    <>
      {equipment.map((item) => (
        <EquipmentItem 
          key={item.id} 
          item={item} 
          isSelected={item.id === selectedEquipment}
          isHeld={item.id === heldEquipment}
        />
      ))}
    </>
  );
}

type EquipmentItemProps = {
  item: ReturnType<typeof useLabStore.getState>["equipment"][0];
  isSelected: boolean;
  isHeld: boolean;
};

function EquipmentItem({ item, isSelected, isHeld }: EquipmentItemProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setMessage } = useLabStore();
  
  // Show equipment name on hover
  useEffect(() => {
    if (hovered && !isSelected && !isHeld) {
      setMessage(`${item.name} - Click to select`);
      return () => {
        // Only clear the message if we set it and nothing else has changed it
        if (!isSelected && !isHeld) {
          setMessage(null);
        }
      };
    }
  }, [hovered, isSelected, isHeld, item.name, setMessage]);
  
  useFrame(() => {
    if (meshRef.current && (isSelected || hovered)) {
      // Make selected/hovered items pulsate slightly
      meshRef.current.scale.x = THREE.MathUtils.lerp(
        meshRef.current.scale.x,
        isSelected ? 1.1 : 1.05,
        0.1
      );
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        isSelected ? 1.1 : 1.05,
        0.1
      );
      meshRef.current.scale.z = THREE.MathUtils.lerp(
        meshRef.current.scale.z,
        isSelected ? 1.1 : 1.05,
        0.1
      );
    } else if (meshRef.current) {
      // Reset scale
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1, 0.1);
    }
  });
  
  // Render appropriate equipment model based on type
  switch (item.type) {
    case "beaker":
      return (
        <BeakerModel 
          item={item}
          meshRef={meshRef}
          isSelected={isSelected}
          isHeld={isHeld}
          onHover={setHovered}
        />
      );
    case "test_tube":
      return (
        <TestTubeModel 
          item={item}
          meshRef={meshRef}
          isSelected={isSelected}
          isHeld={isHeld}
          onHover={setHovered}
        />
      );
    case "bunsen_burner":
      return (
        <BunsenBurnerModel 
          item={item}
          meshRef={meshRef}
          isSelected={isSelected}
          isHeld={isHeld}
          onHover={setHovered}
        />
      );
    case "microscope":
      return (
        <MicroscopeModel 
          item={item}
          meshRef={meshRef}
          isSelected={isSelected}
          isHeld={isHeld}
          onHover={setHovered}
        />
      );
    case "scale":
      return (
        <ScaleModel 
          item={item}
          meshRef={meshRef}
          isSelected={isSelected}
          isHeld={isHeld}
          onHover={setHovered}
        />
      );
    case "chemical":
      return (
        <ChemicalModel 
          item={item}
          meshRef={meshRef}
          isSelected={isSelected}
          isHeld={isHeld}
          onHover={setHovered}
        />
      );
    default:
      return null;
  }
}

// Beaker model
function BeakerModel({ 
  item, 
  meshRef, 
  isSelected, 
  isHeld, 
  onHover 
}: { 
  item: ReturnType<typeof useLabStore.getState>["equipment"][0], 
  meshRef: React.RefObject<THREE.Mesh>,
  isSelected: boolean,
  isHeld: boolean,
  onHover: (hovered: boolean) => void
}) {
  return (
    <group
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
    >
      {/* Beaker body */}
      <mesh
        ref={meshRef}
        castShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        userData={{ equipmentId: item.id }}
      >
        <cylinderGeometry args={[0.15, 0.13, 0.25, 32]} />
        <meshStandardMaterial 
          color="#d3e0ea" 
          transparent 
          opacity={0.7} 
          emissive={isSelected ? "#fff" : undefined}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      
      {/* Beaker contents if any */}
      {item.contents && item.contents.length > 0 && (
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.13, 0.11, 0.1, 32]} />
          <meshStandardMaterial 
            color={item.color || "#a0c8ff"} 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      )}
      
      {/* Beaker bottom */}
      <mesh position={[0, -0.125, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.01, 32]} />
        <meshStandardMaterial color="#d3e0ea" transparent opacity={0.7} />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 0.2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.05}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        visible={isSelected || isHeld}
      >
        {item.name}
      </Text>
    </group>
  );
}

// Test tube model
function TestTubeModel({ 
  item, 
  meshRef, 
  isSelected, 
  isHeld, 
  onHover 
}: { 
  item: ReturnType<typeof useLabStore.getState>["equipment"][0], 
  meshRef: React.RefObject<THREE.Mesh>,
  isSelected: boolean,
  isHeld: boolean,
  onHover: (hovered: boolean) => void
}) {
  return (
    <group
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
    >
      {/* Test tube body */}
      <mesh
        ref={meshRef}
        castShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        userData={{ equipmentId: item.id }}
      >
        <cylinderGeometry args={[0.05, 0.05, 0.3, 32]} />
        <meshStandardMaterial 
          color="#d3e0ea" 
          transparent 
          opacity={0.7} 
          emissive={isSelected ? "#fff" : undefined}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      
      {/* Test tube bottom (rounded) */}
      <mesh position={[0, -0.15, 0]}>
        <sphereGeometry args={[0.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#d3e0ea" transparent opacity={0.7} />
      </mesh>
      
      {/* Test tube contents if any */}
      {item.contents && item.contents.length > 0 && (
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.15, 32]} />
          <meshStandardMaterial 
            color={item.color || "#a0c8ff"} 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      )}
      
      {/* Label */}
      <Text
        position={[0, 0.2, 0.1]}
        rotation={[0, 0, 0]}
        fontSize={0.04}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        visible={isSelected || isHeld}
      >
        {item.name}
      </Text>
    </group>
  );
}

// Bunsen burner model
function BunsenBurnerModel({ 
  item, 
  meshRef, 
  isSelected, 
  isHeld, 
  onHover 
}: { 
  item: ReturnType<typeof useLabStore.getState>["equipment"][0], 
  meshRef: React.RefObject<THREE.Mesh>,
  isSelected: boolean,
  isHeld: boolean,
  onHover: (hovered: boolean) => void
}) {
  // Animate the flame if temperature is high
  const flameRef = useRef<THREE.Mesh>(null);
  const isHeating = item.temperature && item.temperature > 50;
  
  useFrame((state) => {
    if (flameRef.current && isHeating) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      flameRef.current.rotation.y += 0.05;
    }
  });
  
  return (
    <group
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
    >
      {/* Burner base */}
      <mesh
        castShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        userData={{ equipmentId: item.id }}
      >
        <cylinderGeometry args={[0.15, 0.2, 0.1, 32]} />
        <meshStandardMaterial 
          color="#455a64" 
          emissive={isSelected ? "#fff" : undefined}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      
      {/* Burner tube */}
      <mesh
        ref={meshRef}
        position={[0, 0.15, 0]}
        castShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        userData={{ equipmentId: item.id }}
      >
        <cylinderGeometry args={[0.03, 0.03, 0.3, 32]} />
        <meshStandardMaterial 
          color="#78909c" 
          emissive={isSelected ? "#fff" : undefined}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      
      {/* Flame when heating */}
      {isHeating && (
        <mesh position={[0, 0.35, 0]} ref={flameRef}>
          <coneGeometry args={[0.05, 0.15, 32]} />
          <meshStandardMaterial 
            color="#ff9800" 
            emissive="#ff5722"
            emissiveIntensity={0.5} 
          />
        </mesh>
      )}
      
      {/* Gas control */}
      <mesh position={[0.1, 0.05, 0]}>
        <boxGeometry args={[0.05, 0.02, 0.02]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 0.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.05}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        visible={isSelected || isHeld}
      >
        {item.name}
      </Text>
    </group>
  );
}

// Microscope model
function MicroscopeModel({ 
  item, 
  meshRef, 
  isSelected, 
  isHeld, 
  onHover 
}: { 
  item: ReturnType<typeof useLabStore.getState>["equipment"][0], 
  meshRef: React.RefObject<THREE.Mesh>,
  isSelected: boolean,
  isHeld: boolean,
  onHover: (hovered: boolean) => void
}) {
  return (
    <group
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
    >
      {/* Base */}
      <mesh
        castShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        userData={{ equipmentId: item.id }}
      >
        <boxGeometry args={[0.25, 0.05, 0.3]} />
        <meshStandardMaterial 
          color="#263238" 
          emissive={isSelected ? "#fff" : undefined}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      
      {/* Stand */}
      <mesh position={[0, 0.15, -0.05]} ref={meshRef}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 16]} />
        <meshStandardMaterial color="#455a64" />
      </mesh>
      
      {/* Viewing tube */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 16]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>
      
      {/* Objective lenses */}
      <mesh position={[0, 0.2, 0.05]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#546e7a" />
      </mesh>
      
      {/* Stage */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.15, 0.02, 0.15]} />
        <meshStandardMaterial color="#78909c" />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 0.4, 0.2]}
        rotation={[0, 0, 0]}
        fontSize={0.04}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        visible={isSelected || isHeld}
      >
        {item.name}
      </Text>
    </group>
  );
}

// Scale model
function ScaleModel({ 
  item, 
  meshRef, 
  isSelected, 
  isHeld, 
  onHover 
}: { 
  item: ReturnType<typeof useLabStore.getState>["equipment"][0], 
  meshRef: React.RefObject<THREE.Mesh>,
  isSelected: boolean,
  isHeld: boolean,
  onHover: (hovered: boolean) => void
}) {
  return (
    <group
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
    >
      {/* Scale base */}
      <mesh
        ref={meshRef}
        castShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        userData={{ equipmentId: item.id }}
      >
        <boxGeometry args={[0.25, 0.05, 0.2]} />
        <meshStandardMaterial 
          color="#546e7a" 
          emissive={isSelected ? "#fff" : undefined}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      
      {/* Scale platform */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.15, 0.01, 0.15]} />
        <meshStandardMaterial color="#b0bec5" />
      </mesh>
      
      {/* Display */}
      <mesh position={[0, 0.05, -0.08]} rotation={[Math.PI / 8, 0, 0]}>
        <boxGeometry args={[0.1, 0.02, 0.05]} />
        <meshStandardMaterial color="#263238" />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 0.1, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.03}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        visible={isSelected || isHeld}
      >
        {item.name}
      </Text>
    </group>
  );
}

// Chemical bottle model
function ChemicalModel({ 
  item, 
  meshRef, 
  isSelected, 
  isHeld, 
  onHover 
}: { 
  item: ReturnType<typeof useLabStore.getState>["equipment"][0], 
  meshRef: React.RefObject<THREE.Mesh>,
  isSelected: boolean,
  isHeld: boolean,
  onHover: (hovered: boolean) => void
}) {
  return (
    <group
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[item.rotation.x, item.rotation.y, item.rotation.z]}
    >
      {/* Bottle body */}
      <mesh
        ref={meshRef}
        castShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        userData={{ equipmentId: item.id }}
      >
        <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        <meshStandardMaterial 
          color="#546e7a" 
          transparent 
          opacity={0.9} 
          emissive={isSelected ? "#fff" : undefined}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      
      {/* Bottle contents */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.15, 16]} />
        <meshStandardMaterial 
          color={item.color || "#a0c8ff"} 
          transparent 
          opacity={0.8} 
        />
      </mesh>
      
      {/* Bottle cap */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
        <meshStandardMaterial color="#263238" />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 0, 0.06]}
        rotation={[0, 0, 0]}
        fontSize={0.02}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        visible={true}
        maxWidth={0.1}
      >
        {item.name}
      </Text>
    </group>
  );
}