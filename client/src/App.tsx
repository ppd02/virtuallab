import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import LabEnvironment from "./components/laboratory/LabEnvironment";
import LabInterface from "./components/ui/LabInterface";
import { Loading } from "./components/ui/Loading";
import { LabCamera } from "./components/laboratory/LabCamera";
import { Preload } from "@react-three/drei";

// Define control keys for navigation
enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  interact = 'interact',
  rotateLeft = 'rotateLeft',
  rotateRight = 'rotateRight',
  rotateLookUp = 'rotateLookUp',
  rotateLookDown = 'rotateLookDown',
}

// Main App component
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { setBackgroundMusic } = useAudio();

  // Initialize background music
  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    // Create hit sound
    const hit = new Audio("/sounds/hit.mp3");
    hit.volume = 0.5;
    useAudio.getState().setHitSound(hit);

    // Create success sound
    const success = new Audio("/sounds/success.mp3");
    success.volume = 0.7;
    useAudio.getState().setSuccessSound(success);

    // Set loading to false after 2 seconds to ensure assets are loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [setBackgroundMusic]);

  // Define key mappings
  const keyMap = [
    { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
    { name: Controls.backward, keys: ['KeyS', 'ArrowDown'] },
    { name: Controls.left, keys: ['KeyA', 'ArrowLeft'] },
    { name: Controls.right, keys: ['KeyD', 'ArrowRight'] },
    { name: Controls.interact, keys: ['KeyE', 'Space'] },
    { name: Controls.rotateLeft, keys: ['KeyQ'] },
    { name: Controls.rotateRight, keys: ['KeyR'] },
    { name: Controls.rotateLookUp, keys: ['Digit1'] },
    { name: Controls.rotateLookDown, keys: ['Digit2'] },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative w-full h-full">
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{
            position: [0, 1.6, 5],
            fov: 75,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "default"
          }}
        >
          <color attach="background" args={["#111111"]} />
          
          <Suspense fallback={null}>
            <LabEnvironment />
            <LabCamera />
            <Preload all />
          </Suspense>
        </Canvas>
        
        <LabInterface />
      </KeyboardControls>
    </div>
  );
}

export default App;
