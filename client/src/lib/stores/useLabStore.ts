import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export type LabEquipment = {
  id: string;
  name: string;
  type: "beaker" | "test_tube" | "bunsen_burner" | "microscope" | "scale" | "chemical";
  position: THREE.Vector3;
  rotation: THREE.Euler;
  description: string;
  available: boolean;
  interactive: boolean;
  contents?: string[];
  temperature?: number;
  color?: string;
};

export type ExperimentStep = {
  id: string;
  description: string;
  requiredEquipment: string[];
  requiredActions: {
    action: "mix" | "heat" | "cool" | "measure" | "observe";
    equipmentId: string;
    targetIds?: string[];
    value?: number;
  }[];
  hint?: string;
  completed: boolean;
};

export type Experiment = {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  subject: "chemistry" | "physics";
  steps: ExperimentStep[];
  completed: boolean;
  active: boolean;
};

type LabStoreState = {
  // Navigation
  playerPosition: THREE.Vector3;
  playerRotation: number;
  cameraLookAngle: number;
  
  // Equipment
  equipment: LabEquipment[];
  selectedEquipment: string | null;
  heldEquipment: string | null;
  
  // Experiments
  experiments: Experiment[];
  activeExperiment: string | null;
  
  // Information panels
  showExperimentPanel: boolean;
  showEquipmentInfo: boolean;
  showControls: boolean;
  
  // UI State
  message: string | null;
  
  // 3D scene helpers
  interactionPoints: THREE.Vector3[];

  // Actions
  movePlayer: (direction: "forward" | "backward" | "left" | "right") => void;
  rotatePlayer: (direction: "left" | "right") => void;
  lookUpDown: (direction: "up" | "down") => void;
  setPlayerRotation: (rotation: number) => void;  // Direct rotation control
  setCameraLookAngle: (angle: number) => void;    // Direct look angle control
  selectEquipment: (equipmentId: string | null) => void;
  grabEquipment: (equipmentId: string | null) => void;
  placeEquipment: (position: THREE.Vector3) => void;
  startExperiment: (experimentId: string) => void;
  completeExperimentStep: (experimentId: string, stepId: string) => void;
  toggleExperimentPanel: () => void;
  toggleEquipmentInfo: () => void;
  toggleControls: () => void;
  setMessage: (message: string | null) => void;
  mixChemicals: (sourceId: string, targetId: string) => void;
  heatEquipment: (equipmentId: string, temperature: number) => void;
  observeEquipment: (equipmentId: string) => void;
  arrangeEquipmentForExperiment: (experimentId: string) => void; // New method to arrange equipment
};

export const useLabStore = create<LabStoreState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    playerPosition: new THREE.Vector3(0, 1.6, 5),
    playerRotation: 0,
    cameraLookAngle: 0,
    equipment: [],
    selectedEquipment: null,
    heldEquipment: null,
    experiments: [],
    activeExperiment: null,
    showExperimentPanel: false,
    showEquipmentInfo: false,
    showControls: true,
    message: null,
    interactionPoints: [],

    // Actions
    movePlayer: (direction) => set((state) => {
      const speed = 0.1;
      const playerRotationRad = state.playerRotation * (Math.PI / 180);
      let newPosition = new THREE.Vector3().copy(state.playerPosition);

      switch (direction) {
        case "forward":
          newPosition.x -= Math.sin(playerRotationRad) * speed;
          newPosition.z -= Math.cos(playerRotationRad) * speed;
          break;
        case "backward":
          newPosition.x += Math.sin(playerRotationRad) * speed;
          newPosition.z += Math.cos(playerRotationRad) * speed;
          break;
        case "left":
          newPosition.x -= Math.cos(playerRotationRad) * speed;
          newPosition.z += Math.sin(playerRotationRad) * speed;
          break;
        case "right":
          newPosition.x += Math.cos(playerRotationRad) * speed;
          newPosition.z -= Math.sin(playerRotationRad) * speed;
          break;
      }

      // Simple boundary check to keep player within the lab
      const boundaryLimit = 10;
      newPosition.x = Math.max(Math.min(newPosition.x, boundaryLimit), -boundaryLimit);
      newPosition.z = Math.max(Math.min(newPosition.z, boundaryLimit), -boundaryLimit);

      console.log(`Player moved ${direction}. New position:`, newPosition);
      return { playerPosition: newPosition };
    }),

    rotatePlayer: (direction) => set((state) => {
      const rotationSpeed = 3;
      const newRotation = direction === "left" 
        ? state.playerRotation - rotationSpeed 
        : state.playerRotation + rotationSpeed;
      
      console.log(`Player rotated ${direction}. New rotation:`, newRotation);
      return { playerRotation: newRotation };
    }),

    lookUpDown: (direction) => set((state) => {
      const lookSpeed = 2;
      const newLookAngle = direction === "up" 
        ? Math.min(state.cameraLookAngle + lookSpeed, 45) 
        : Math.max(state.cameraLookAngle - lookSpeed, -45);
      
      console.log(`Camera look ${direction}. New angle:`, newLookAngle);
      return { cameraLookAngle: newLookAngle };
    }),
    
    setPlayerRotation: (rotation) => set(() => {
      console.log(`Direct player rotation set to:`, rotation);
      return { playerRotation: rotation };
    }),
    
    setCameraLookAngle: (angle) => set(() => {
      console.log(`Direct camera look angle set to:`, angle);
      return { cameraLookAngle: angle };
    }),

    selectEquipment: (equipmentId) => set((state) => {
      console.log(`Selected equipment: ${equipmentId || 'none'}`);
      return { selectedEquipment: equipmentId };
    }),

    grabEquipment: (equipmentId) => set((state) => {
      if (!equipmentId) {
        return { heldEquipment: null };
      }

      const equipment = state.equipment.find(e => e.id === equipmentId);
      if (!equipment || !equipment.available) {
        console.log(`Cannot grab equipment ${equipmentId}: Not available`);
        return {};
      }

      // Update equipment availability
      const updatedEquipment = state.equipment.map(e => 
        e.id === equipmentId ? { ...e, available: false } : e
      );

      console.log(`Grabbed equipment: ${equipmentId}`);
      return { 
        heldEquipment: equipmentId,
        equipment: updatedEquipment
      };
    }),

    placeEquipment: (position) => set((state) => {
      if (!state.heldEquipment) {
        return {};
      }

      // Update equipment position and make it available again
      const updatedEquipment = state.equipment.map(e => 
        e.id === state.heldEquipment 
          ? { 
              ...e, 
              position: position.clone(),
              available: true 
            } 
          : e
      );

      console.log(`Placed equipment ${state.heldEquipment} at position:`, position);
      return { 
        heldEquipment: null,
        equipment: updatedEquipment
      };
    }),

    startExperiment: (experimentId) => set((state) => {
      // Reset all experiments to inactive
      const updatedExperiments = state.experiments.map(exp => ({
        ...exp,
        active: exp.id === experimentId
      }));

      console.log(`Started experiment: ${experimentId}`);
      return { 
        experiments: updatedExperiments,
        activeExperiment: experimentId,
        showExperimentPanel: true
      };
    }),

    completeExperimentStep: (experimentId, stepId) => set((state) => {
      const updatedExperiments = state.experiments.map(exp => {
        if (exp.id !== experimentId) return exp;
        
        const updatedSteps = exp.steps.map(step => 
          step.id === stepId ? { ...step, completed: true } : step
        );
        
        // Check if all steps are completed
        const allCompleted = updatedSteps.every(step => step.completed);
        
        return {
          ...exp,
          steps: updatedSteps,
          completed: allCompleted
        };
      });

      console.log(`Completed step ${stepId} for experiment ${experimentId}`);
      return { experiments: updatedExperiments };
    }),

    toggleExperimentPanel: () => set((state) => ({ 
      showExperimentPanel: !state.showExperimentPanel 
    })),

    toggleEquipmentInfo: () => set((state) => ({ 
      showEquipmentInfo: !state.showEquipmentInfo 
    })),

    toggleControls: () => set((state) => ({ 
      showControls: !state.showControls 
    })),

    setMessage: (message) => set({ message }),

    mixChemicals: (sourceId, targetId) => set((state) => {
      // Find the source and target equipment
      const sourceEquipment = state.equipment.find(e => e.id === sourceId);
      const targetEquipment = state.equipment.find(e => e.id === targetId);
      
      if (!sourceEquipment || !targetEquipment) {
        console.log(`Cannot mix chemicals: Equipment not found`);
        get().setMessage("Error: Could not find equipment to mix");
        return {};
      }
      
      // Check if source has contents
      if (!sourceEquipment.contents || sourceEquipment.contents.length === 0) {
        console.log(`Cannot mix chemicals: Source has no contents`);
        get().setMessage(`${sourceEquipment.name} is empty`);
        return {};
      }
      
      // Create updated equipment array
      const updatedEquipment = state.equipment.map(item => {
        if (item.id === targetId) {
          // Add source contents to target
          const newContents = [
            ...(item.contents || []),
            ...(sourceEquipment.contents || [])
          ];
          
          // Determine color based on mixture
          let color = item.color || sourceEquipment.color || "#a0c8ff";
          if (newContents.length > 1) {
            // Simple color mixing logic
            if (newContents.includes("Acid") && newContents.includes("Base")) {
              color = "#32a852"; // Green for neutralization
            } else if (newContents.includes("Copper Sulfate") && newContents.includes("Sodium Hydroxide")) {
              color = "#1e3799"; // Blue for copper hydroxide
            } else if (newContents.includes("Potassium Iodide") && newContents.includes("Lead Nitrate")) {
              color = "#f9ca24"; // Yellow for lead iodide
            } else {
              // Default mixture color
              color = "#9c88ff";
            }
          }
          
          return {
            ...item,
            contents: newContents,
            color
          };
        }
        
        if (item.id === sourceId && sourceEquipment.type === "chemical") {
          // Chemicals don't get emptied (represent bottles that still have more)
          return item;
        } else if (item.id === sourceId) {
          // Empty the source container
          return {
            ...item,
            contents: [],
            color: "transparent"
          };
        }
        
        return item;
      });
      
      // Set success message
      const message = `Mixed ${sourceEquipment.name} into ${targetEquipment.name}`;
      
      // Check if this completes an experiment step
      const { activeExperiment, experiments } = state;
      if (activeExperiment) {
        const experiment = experiments.find(e => e.id === activeExperiment);
        if (experiment) {
          // Find the first incomplete step that involves mixing
          const incompleteStep = experiment.steps.find(s => 
            !s.completed && 
            s.requiredActions.some(a => 
              a.action === "mix" && 
              (a.equipmentId === sourceId || a.equipmentId === targetId) &&
              (a.targetIds?.includes(sourceId) || a.targetIds?.includes(targetId))
            )
          );
          
          if (incompleteStep) {
            setTimeout(() => {
              get().completeExperimentStep(experiment.id, incompleteStep.id);
            }, 500);
          }
        }
      }
      
      console.log(`Mixed chemicals from ${sourceId} into ${targetId}`);
      return { equipment: updatedEquipment, message };
    }),

    heatEquipment: (equipmentId, temperature) => set((state) => {
      const equipment = state.equipment.find(e => e.id === equipmentId);
      if (!equipment) {
        return {};
      }
      
      const updatedEquipment = state.equipment.map(e => 
        e.id === equipmentId 
          ? { ...e, temperature } 
          : e
      );
      
      // Check if this is a bunsen burner being turned on/off
      if (equipment.type === "bunsen_burner") {
        // No special effects for bunsen burner itself
      } 
      // If it's another type of equipment being heated
      else if (temperature > 50) {
        // Check if there's a chemical reaction due to heat
        if (equipment.contents && equipment.contents.length > 1) {
          // For some specific combinations, trigger a reaction
          const contents = equipment.contents.sort().join(",");
          
          if (contents.includes("Acid") && contents.includes("Base")) {
            // Simulate a neutralization reaction
            setTimeout(() => {
              const reactionEquipment = state.equipment.map(e => 
                e.id === equipmentId 
                  ? { 
                      ...e, 
                      contents: ["Neutral Solution"], 
                      color: "#b2bec3",
                      temperature: temperature 
                    } 
                  : e
              );
              
              set({ 
                equipment: reactionEquipment,
                message: "Neutralization reaction occurred! Acid and base formed a salt and water." 
              });
            }, 2000);
          } 
          else if (contents.includes("Copper Sulfate") && contents.includes("Sodium Hydroxide")) {
            // Simulate copper hydroxide precipitation
            setTimeout(() => {
              const reactionEquipment = state.equipment.map(e => 
                e.id === equipmentId 
                  ? { 
                      ...e, 
                      contents: ["Copper Hydroxide Precipitate"], 
                      color: "#0984e3",
                      temperature: temperature 
                    } 
                  : e
              );
              
              set({ 
                equipment: reactionEquipment,
                message: "Precipitation reaction! Blue copper hydroxide precipitate formed." 
              });
            }, 2000);
          }
          else {
            // Generic reaction
            setTimeout(() => {
              const reactionEquipment = state.equipment.map(e => 
                e.id === equipmentId 
                  ? { 
                      ...e, 
                      contents: ["Reaction Product"], 
                      color: "#fdcb6e",
                      temperature: temperature 
                    } 
                  : e
              );
              
              set({ 
                equipment: reactionEquipment,
                message: "Chemical reaction occurred due to heating!" 
              });
            }, 2000);
          }
        }
      }
      
      // Check if this completes an experiment step
      const { activeExperiment, experiments } = state;
      if (activeExperiment) {
        const experiment = experiments.find(e => e.id === activeExperiment);
        if (experiment) {
          // Find the first incomplete step that involves heating
          const incompleteStep = experiment.steps.find(s => 
            !s.completed && 
            s.requiredActions.some(a => 
              a.action === "heat" && 
              a.equipmentId === equipmentId &&
              (!a.value || temperature >= a.value)
            )
          );
          
          if (incompleteStep) {
            setTimeout(() => {
              get().completeExperimentStep(experiment.id, incompleteStep.id);
            }, 1000);
          }
        }
      }
      
      console.log(`Heated equipment ${equipmentId} to ${temperature}°C`);
      return { equipment: updatedEquipment };
    }),

    observeEquipment: (equipmentId) => set((state) => {
      const equipment = state.equipment.find(e => e.id === equipmentId);
      if (!equipment) {
        return {};
      }
      
      let message = `Observing ${equipment.name}: ${equipment.description}`;
      
      // Add more specific observation details based on equipment type
      if (equipment.type === "microscope") {
        message = "Through the microscope: Observing cellular structures at 400x magnification.";
      } else if (equipment.type === "beaker" || equipment.type === "test_tube") {
        if (equipment.contents && equipment.contents.length > 0) {
          if (equipment.contents.length === 1) {
            message = `${equipment.name} contains ${equipment.contents[0]}`;
          } else {
            message = `${equipment.name} contains a mixture of ${equipment.contents.join(' and ')}`;
          }
          
          if (equipment.temperature && equipment.temperature > 50) {
            message += ` (heated to ~${equipment.temperature}°C)`;
          }
        } else {
          message = `${equipment.name} is empty`;
        }
      } else if (equipment.type === "chemical") {
        if (equipment.contents && equipment.contents.length > 0) {
          message = `${equipment.name}: Contains ${equipment.contents[0]}`;
        }
      }
      
      // Check if this completes an experiment step
      const { activeExperiment, experiments } = state;
      if (activeExperiment) {
        const experiment = experiments.find(e => e.id === activeExperiment);
        if (experiment) {
          // Find the first incomplete step that involves observation
          const incompleteStep = experiment.steps.find(s => 
            !s.completed && 
            s.requiredActions.some(a => a.action === "observe" && a.equipmentId === equipmentId)
          );
          
          if (incompleteStep) {
            setTimeout(() => {
              get().completeExperimentStep(experiment.id, incompleteStep.id);
            }, 1000);
          }
        }
      }
      
      console.log(`Observing equipment ${equipmentId}`);
      return { message };
    }),
    
    arrangeEquipmentForExperiment: (experimentId) => set((state) => {
      const experiment = state.experiments.find(exp => exp.id === experimentId);
      if (!experiment) return {};
      
      console.log(`Arranging equipment for experiment: ${experiment.name}`);
      
      // Get all required equipment IDs for this experiment
      const requiredEquipmentIds = new Set<string>();
      experiment.steps.forEach(step => {
        step.requiredEquipment.forEach(id => requiredEquipmentIds.add(id));
      });
      
      // Position equipment on the lab bench
      const updatedEquipment = state.equipment.map(item => {
        // If this equipment is needed for the experiment
        if (requiredEquipmentIds.has(item.id)) {
          // Set a specific position based on equipment type
          const basePosition = new THREE.Vector3(0, 1, -3); // Center of lab bench
          
          switch (item.type) {
            case "beaker":
              // Beakers toward the front of the bench
              return {
                ...item,
                position: new THREE.Vector3(
                  basePosition.x + (Math.random() * 2 - 1), // Random x position along bench
                  basePosition.y,
                  basePosition.z + 0.3 // Toward the front
                ),
                available: true,
                interactive: true
              };
              
            case "test_tube":
              // Test tubes to the right side
              return {
                ...item,
                position: new THREE.Vector3(
                  basePosition.x + 1.5 + (Math.random() * 0.5), // Right side
                  basePosition.y,
                  basePosition.z + (Math.random() * 0.6 - 0.3) // Random z position
                ),
                available: true,
                interactive: true
              };
              
            case "chemical":
              // Chemicals to the left side
              return {
                ...item,
                position: new THREE.Vector3(
                  basePosition.x - 1.5 - (Math.random() * 0.5), // Left side
                  basePosition.y + 0.2, // Slightly elevated
                  basePosition.z + (Math.random() * 0.6 - 0.3) // Random z position
                ),
                available: true,
                interactive: true
              };
              
            case "bunsen_burner":
              // Bunsen burner in the center back
              return {
                ...item,
                position: new THREE.Vector3(
                  basePosition.x - 0.5,
                  basePosition.y - 0.1, // Slightly lower
                  basePosition.z - 0.5 // Toward the back
                ),
                available: true,
                interactive: true
              };
              
            case "microscope":
              // Microscope in the center
              return {
                ...item,
                position: new THREE.Vector3(
                  basePosition.x + 0.5,
                  basePosition.y,
                  basePosition.z - 0.3 // Slightly back
                ),
                available: true,
                interactive: true
              };
              
            case "scale":
              // Scale to the right back
              return {
                ...item,
                position: new THREE.Vector3(
                  basePosition.x + 2,
                  basePosition.y,
                  basePosition.z - 0.5 // Toward the back
                ),
                available: true,
                interactive: true
              };
              
            default:
              return item;
          }
        }
        
        // For equipment not needed in this experiment, move them to storage
        return {
          ...item,
          position: new THREE.Vector3(
            -6 + Math.random() * 2, // Random position in storage
            1.5 + (item.type === "chemical" ? 0.5 : 0), // On shelf
            -8 + Math.random() * 1 // Back wall shelf
          ),
          available: false,
          interactive: false // Not interactive when in storage
        };
      });
      
      // Set a message about the experiment
      get().setMessage(`Prepared equipment for: ${experiment.name}`);
      
      return { equipment: updatedEquipment };
    })
  }))
);
