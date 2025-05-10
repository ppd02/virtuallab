import { useState, useEffect } from "react";
import { useLabStore } from "../../lib/stores/useLabStore";
import { useAudio } from "../../lib/stores/useAudio";

export function ExperimentManager() {
  const { 
    activeExperiment, 
    experiments, 
    equipment, 
    selectedEquipment, 
    heldEquipment,
    completeExperimentStep,
    setMessage
  } = useLabStore();
  const { playSuccess } = useAudio();
  
  // Track experiment progress
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  
  // Get the active experiment data
  const currentExperiment = activeExperiment 
    ? experiments.find(exp => exp.id === activeExperiment) 
    : null;
  
  // Check for completed steps
  useEffect(() => {
    if (!currentExperiment) return;
    
    // For each uncompleted step, check if requirements are met
    currentExperiment.steps.forEach(step => {
      // Skip already completed steps or already checked steps
      if (step.completed || checkedSteps[step.id]) return;
      
      // Check if all required equipment is available
      const equipmentReady = step.requiredEquipment.every(equipId => {
        const equip = equipment.find(e => e.id === equipId);
        return equip && equip.available;
      });
      
      if (!equipmentReady) return;
      
      // Check if all required actions are completed
      // This is a simplified version - in a real app, we'd track actions more thoroughly
      const actionsCompleted = step.requiredActions.every(action => {
        switch (action.action) {
          case "mix":
            // Check if source and target have been mixed
            const sourceEquip = equipment.find(e => e.id === action.equipmentId);
            const targetEquip = equipment.find(e => e.id === action.targetIds?.[0]);
            
            // Very simple check - in a real app, we'd check chemical compositions
            return sourceEquip && targetEquip && 
                   sourceEquip.contents?.length === 0 &&
                   targetEquip.contents?.length > 0;
            
          case "heat":
            // Check if equipment has been heated to required temperature
            const heatedEquip = equipment.find(e => e.id === action.equipmentId);
            return heatedEquip && heatedEquip.temperature && 
                   heatedEquip.temperature >= (action.value || 50);
            
          case "observe":
            // Assume observation was done if equipment was selected
            return selectedEquipment === action.equipmentId;
            
          default:
            return false;
        }
      });
      
      if (actionsCompleted) {
        // Mark step as completed
        completeExperimentStep(currentExperiment.id, step.id);
        setCheckedSteps(prev => ({ ...prev, [step.id]: true }));
        
        // Show success message
        setMessage(`Step completed: ${step.description}`);
        playSuccess();
        
        console.log(`Completed experiment step: ${step.id}`);
      }
    });
    
  }, [
    currentExperiment, 
    equipment, 
    selectedEquipment, 
    heldEquipment, 
    checkedSteps, 
    completeExperimentStep, 
    setMessage, 
    playSuccess
  ]);
  
  return null;
}
