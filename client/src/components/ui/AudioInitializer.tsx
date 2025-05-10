import { useEffect } from "react";
import { useAudio } from "../../lib/stores/useAudio";

export function AudioInitializer() {
  const { setHitSound, setSuccessSound, toggleMute } = useAudio();

  useEffect(() => {
    // Initialize hit sound
    const hitSound = new Audio("/sounds/click.mp3");
    hitSound.preload = "auto";
    setHitSound(hitSound);

    // Initialize success sound
    const successSound = new Audio("/sounds/success.mp3");
    successSound.preload = "auto";
    setSuccessSound(successSound);

    // Unmute sounds
    toggleMute();

    console.log("Audio elements initialized");
  }, [setHitSound, setSuccessSound, toggleMute]);

  return null;
}