import { useEffect, useState } from "react";
import { useLabStore } from "../../lib/stores/useLabStore";
import { useAudio } from "../../lib/stores/useAudio";
import { Card } from "./card";
import { Button } from "./button";
import { Separator } from "./separator";
import { Thermometer, Droplets, Scale } from "lucide-react";

export function EquipmentInfoPanel() {
  const { equipment, selectedEquipment } = useLabStore();
  const { playSuccess, playHit } = useAudio();
  const [selectedItem, setSelectedItem] = useState<ReturnType<typeof useLabStore.getState>["equipment"][0] | null>(null);
  
  // Update the selected item when the selected equipment changes
  useEffect(() => {
    if (selectedEquipment) {
      const item = equipment.find(item => item.id === selectedEquipment);
      setSelectedItem(item || null);
    } else {
      setSelectedItem(null);
    }
  }, [equipment, selectedEquipment]);
  
  if (!selectedItem) return null;
  
  return (
    <Card className="fixed right-4 top-4 w-80 bg-card text-card-foreground">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{selectedItem.name}</h2>
        <p className="text-sm text-muted-foreground">{selectedItem.type}</p>
      </div>
      
      <div className="p-4 space-y-4">
        <p>{selectedItem.description}</p>
        
        <Separator />
        
        {/* Show specific properties based on equipment type */}
        {selectedItem.temperature && (
          <div className="flex items-center gap-2">
            <Thermometer className="text-red-500" />
            <div>
              <p className="text-sm font-medium">Temperature</p>
              <p className="text-sm">{selectedItem.temperature}°C</p>
            </div>
          </div>
        )}
        
        {selectedItem.contents && selectedItem.contents.length > 0 && (
          <div className="flex items-center gap-2">
            <Droplets className="text-blue-500" />
            <div>
              <p className="text-sm font-medium">Contents</p>
              <p className="text-sm">{selectedItem.contents.join(", ")}</p>
            </div>
          </div>
        )}
        
        {selectedItem.type === "scale" && (
          <div className="flex items-center gap-2">
            <Scale className="text-green-500" />
            <div>
              <p className="text-sm font-medium">Measurement</p>
              <p className="text-sm">0.00g</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                useLabStore.getState().grabEquipment(selectedItem.id);
                playHit();
              }}
            >
              {selectedItem.available ? "Grab" : "Return to Table"}
            </Button>
            
            {selectedItem.type === "bunsen_burner" && (
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-500"
                onClick={() => {
                  if (selectedItem.temperature && selectedItem.temperature > 50) {
                    useLabStore.getState().heatEquipment(selectedItem.id, 25);
                    useLabStore.getState().setMessage("Bunsen burner turned off");
                  } else {
                    useLabStore.getState().heatEquipment(selectedItem.id, 200);
                    useLabStore.getState().setMessage("Bunsen burner lit");
                    playHit();
                  }
                }}
              >
                {selectedItem.temperature && selectedItem.temperature > 50 ? "Turn Off" : "Turn On"}
              </Button>
            )}
          </div>
          
          {/* Equipment-specific actions */}
          {(selectedItem.type === "beaker" || selectedItem.type === "test_tube") && (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  // Find available chemicals
                  const chemicals = useLabStore.getState().equipment.filter(
                    e => e.type === "chemical" && e.available && e.contents && e.contents.length > 0
                  );
                  
                  if (chemicals.length > 0) {
                    // Mix the first available chemical
                    useLabStore.getState().mixChemicals(chemicals[0].id, selectedItem.id);
                  } else {
                    useLabStore.getState().setMessage("No chemicals available to add!");
                  }
                }}
              >
                Add Chemical
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  // Clear contents
                  const updatedEquipment = useLabStore.getState().equipment.map(e => 
                    e.id === selectedItem.id 
                      ? { ...e, contents: [], color: "transparent" } 
                      : e
                  );
                  
                  useLabStore.setState({ equipment: updatedEquipment });
                  useLabStore.getState().setMessage(`Emptied ${selectedItem.name}`);
                }}
                disabled={!selectedItem.contents || selectedItem.contents.length === 0}
              >
                Empty
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  // Observe reaction
                  useLabStore.getState().observeEquipment(selectedItem.id);
                }}
              >
                Observe
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  // Find bunsen burner
                  const burner = useLabStore.getState().equipment.find(
                    e => e.type === "bunsen_burner" && e.temperature && e.temperature > 50
                  );
                  
                  if (burner) {
                    // Heat the container
                    useLabStore.getState().heatEquipment(selectedItem.id, 80);
                    useLabStore.getState().setMessage(`Heated ${selectedItem.name} with Bunsen burner`);
                    
                    // Check if this causes a reaction
                    if (selectedItem.contents && selectedItem.contents.length > 1) {
                      // Simulate a reaction
                      setTimeout(() => {
                        const updatedEquipment = useLabStore.getState().equipment.map(e => 
                          e.id === selectedItem.id 
                            ? { 
                                ...e, 
                                contents: ["Reaction Product"], 
                                color: "#ff9800",
                                temperature: 85
                              } 
                            : e
                        );
                        
                        useLabStore.setState({ equipment: updatedEquipment });
                        useLabStore.getState().setMessage("🧪 Chemical reaction occurred! Experiment progressing...");
                        playSuccess();
                        
                        // Add visual notification that persists longer
                        const notification = document.createElement('div');
                        notification.innerHTML = '🧪 Reaction Complete!';
                        notification.style.position = 'fixed';
                        notification.style.top = '50%';
                        notification.style.left = '50%';
                        notification.style.transform = 'translate(-50%, -50%)';
                        notification.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
                        notification.style.color = 'white';
                        notification.style.padding = '20px';
                        notification.style.borderRadius = '10px';
                        notification.style.fontSize = '24px';
                        notification.style.fontWeight = 'bold';
                        notification.style.zIndex = '1000';
                        notification.style.animation = 'pulse 1s infinite';
                        
                        const style = document.createElement('style');
                        style.innerHTML = `
                          @keyframes pulse {
                            0% { transform: translate(-50%, -50%) scale(1); }
                            50% { transform: translate(-50%, -50%) scale(1.2); }
                            100% { transform: translate(-50%, -50%) scale(1); }
                          }
                        `;
                        document.head.appendChild(style);
                        document.body.appendChild(notification);
                        
                        setTimeout(() => {
                          document.body.removeChild(notification);
                        }, 3000);
                        
                        // Check if this completes an experiment step
                        const { activeExperiment, experiments } = useLabStore.getState();
                        if (activeExperiment) {
                          const experiment = experiments.find(e => e.id === activeExperiment);
                          if (experiment) {
                            // Find the first incomplete step that involves heating
                            const incompleteStep = experiment.steps.find(s => 
                              !s.completed && 
                              s.requiredActions.some(a => a.action === "heat" && a.equipmentId === selectedItem.id)
                            );
                            
                            if (incompleteStep) {
                              useLabStore.getState().completeExperimentStep(experiment.id, incompleteStep.id);
                            }
                          }
                        }
                      }, 1500);
                    }
                  } else {
                    useLabStore.getState().setMessage("You need to turn on the Bunsen burner first!");
                  }
                }}
              >
                Heat
              </Button>
            </div>
          )}
          
          {selectedItem.type === "chemical" && (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  // Find available containers
                  const containers = useLabStore.getState().equipment.filter(
                    e => (e.type === "beaker" || e.type === "test_tube") && e.available
                  );
                  
                  if (containers.length > 0) {
                    // Mix with the first available container
                    useLabStore.getState().mixChemicals(selectedItem.id, containers[0].id);
                  } else {
                    useLabStore.getState().setMessage("No containers available to pour into!");
                  }
                }}
                disabled={!selectedItem.contents || selectedItem.contents.length === 0}
              >
                Pour Into
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => useLabStore.getState().observeEquipment(selectedItem.id)}
              >
                Examine
              </Button>
            </div>
          )}
          
          {selectedItem.type === "microscope" && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                useLabStore.getState().setMessage("Looking through microscope... Magnification 400x");
                
                // Simulate microscope viewing
                setTimeout(() => {
                  useLabStore.getState().setMessage("Observed cellular structures");
                  
                  // Check if this completes an experiment step
                  const { activeExperiment, experiments } = useLabStore.getState();
                  if (activeExperiment) {
                    const experiment = experiments.find(e => e.id === activeExperiment);
                    if (experiment) {
                      // Find the first incomplete step that involves observation
                      const incompleteStep = experiment.steps.find(s => 
                        !s.completed && 
                        s.requiredActions.some(a => a.action === "observe" && a.equipmentId === selectedItem.id)
                      );
                      
                      if (incompleteStep) {
                        useLabStore.getState().completeExperimentStep(experiment.id, incompleteStep.id);
                      }
                    }
                  }
                }, 2000);
              }}
            >
              Look Through
            </Button>
          )}
          
          {selectedItem.type === "scale" && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                // Find selected equipment to weigh
                const heldEquipment = useLabStore.getState().heldEquipment;
                if (heldEquipment) {
                  const equipment = useLabStore.getState().equipment.find(e => e.id === heldEquipment);
                  if (equipment) {
                    // Calculate weight based on equipment type and contents
                    let weight = 0;
                    switch (equipment.type) {
                      case "beaker":
                        weight = 50 + (equipment.contents?.length || 0) * 25;
                        break;
                      case "test_tube":
                        weight = 15 + (equipment.contents?.length || 0) * 10;
                        break;
                      case "chemical":
                        weight = 30;
                        break;
                      default:
                        weight = 25;
                    }
                    
                    useLabStore.getState().setMessage(`${equipment.name} weighs ${weight}g`);
                    
                    // Check if this completes an experiment step
                    const { activeExperiment, experiments } = useLabStore.getState();
                    if (activeExperiment) {
                      const experiment = experiments.find(e => e.id === activeExperiment);
                      if (experiment) {
                        // Find the first incomplete step that involves measuring
                        const incompleteStep = experiment.steps.find(s => 
                          !s.completed && 
                          s.requiredActions.some(a => a.action === "measure" && a.equipmentId === selectedItem.id)
                        );
                        
                        if (incompleteStep) {
                          useLabStore.getState().completeExperimentStep(experiment.id, incompleteStep.id);
                        }
                      }
                    }
                  }
                } else {
                  useLabStore.getState().setMessage("Place an object on the scale first!");
                }
              }}
            >
              Weigh Object
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
