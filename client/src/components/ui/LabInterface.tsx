import { useState, useEffect } from "react";
import { useLabStore } from "../../lib/stores/useLabStore";
import { useAudio } from "../../lib/stores/useAudio";
import { ExperimentPanel } from "./ExperimentPanel";
import { EquipmentInfoPanel } from "./EquipmentInfoPanel";
import { ExperimentManager } from "../laboratory/ExperimentManager";

export default function LabInterface() {
  const { 
    showExperimentPanel, 
    showEquipmentInfo, 
    showControls,
    toggleExperimentPanel, 
    toggleEquipmentInfo, 
    toggleControls,
    selectedEquipment,
    message
  } = useLabStore();
  
  const { isMuted, toggleMute } = useAudio();
  const [showMessage, setShowMessage] = useState(false);
  
  // Handle messages with timing
  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  return (
    <>
      {/* Invisible experiment manager to handle experiment logic */}
      <ExperimentManager />
      
      {/* Top message bar */}
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-md transition-all duration-300 ${
          showMessage ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {message}
      </div>
      
      {/* Control panel */}
      <div className="fixed bottom-4 left-4 right-4 flex justify-between z-10">
        <div className="flex flex-col gap-2">
          <button
            onClick={toggleExperimentPanel}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md"
          >
            {showExperimentPanel ? "Hide Experiments" : "Show Experiments"}
          </button>
          
          <button
            onClick={toggleEquipmentInfo}
            className={`bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md ${
              !selectedEquipment ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!selectedEquipment}
          >
            {showEquipmentInfo ? "Hide Equipment Info" : "Show Equipment Info"}
          </button>
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={toggleMute}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-md"
          >
            {isMuted ? "Unmute Sound" : "Mute Sound"}
          </button>
          
          <button
            onClick={toggleControls}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-md"
          >
            {showControls ? "Hide Controls" : "Show Controls"}
          </button>
        </div>
      </div>
      
      {/* Controls help */}
      {showControls && (
        <div className="fixed top-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-md max-w-xs">
          <h3 className="text-lg font-bold mb-2">Controls</h3>
          <ul className="text-sm space-y-1">
            <li>WASD or Arrow Keys: Move</li>
            <li>Q/R: Rotate left/right</li>
            <li>1/2: Look up/down</li>
            <li>E or Space: Interact</li>
            <li>Click: Select equipment</li>
          </ul>
        </div>
      )}
      
      {/* Experiment panel */}
      {showExperimentPanel && <ExperimentPanel />}
      
      {/* Equipment info panel */}
      {showEquipmentInfo && selectedEquipment && <EquipmentInfoPanel />}
      
      {/* Crosshair */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1" />
          <line x1="10" y1="4" x2="10" y2="16" stroke="white" strokeWidth="1" />
          <line x1="4" y1="10" x2="16" y2="10" stroke="white" strokeWidth="1" />
        </svg>
      </div>
    </>
  );
}
