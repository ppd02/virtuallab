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
        ? Math.min(state.cameraLookAngle + lookSpeed, 30) 
        : Math.max(state.cameraLookAngle - lookSpeed, -30);
      
      console.log(`Camera look ${direction}. New angle:`, newLookAngle);
      return { cameraLookAngle: newLookAngle };
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
        return {};
      }
      
      if (!sourceEquipment.contents || !targetEquipment.contents) {
        console.log(`Cannot mix chemicals: No contents to mix`);
        return {};
      }
      
      // Update the target equipment with combined contents
      const updatedEquipment = state.equipment.map(e => {
        if (e.id === targetId) {
          return {
            ...e,
            contents: [...e.contents!, ...sourceEquipment.contents!],
            // Change color based on mixing (simplified)
            color: "#" + Math.floor(Math.random()*16777215).toString(16)
          };
        }
        if (e.id === sourceId) {
          return {
            ...e,
            contents: [] // Empty the source
          };
        }
        return e;
      });
      
      console.log(`Mixed chemicals from ${sourceId} into ${targetId}`);
      return { equipment: updatedEquipment };
    }),

    heatEquipment: (equipmentId, temperature) => set((state) => {
      const updatedEquipment = state.equipment.map(e => 
        e.id === equipmentId 
          ? { ...e, temperature } 
          : e
      );
      
      console.log(`Heated equipment ${equipmentId} to ${temperature}°C`);
      return { equipment: updatedEquipment };
    }),

    observeEquipment: (equipmentId) => {
      const equipment = get().equipment.find(e => e.id === equipmentId);
      if (equipment) {
        get().setMessage(`Observing ${equipment.name}: ${equipment.description}`);
        console.log(`Observing equipment ${equipmentId}`);
      }
    }
  }))
);
