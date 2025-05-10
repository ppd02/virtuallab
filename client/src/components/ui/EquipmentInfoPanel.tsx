import { useEffect, useState } from "react";
import { useLabStore } from "../../lib/stores/useLabStore";
import { Card } from "./card";
import { Button } from "./button";
import { Separator } from "./separator";
import { Thermometer, Droplets, Scale } from "lucide-react";

export function EquipmentInfoPanel() {
  const { equipment, selectedEquipment } = useLabStore();
  const [selectedItem, setSelectedItem] = useState<ReturnType<typeof useLabStore>["equipment"][0] | null>(null);
  
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
        
        <div className="flex justify-between">
          <Button size="sm" variant="outline">
            Interact
          </Button>
          
          {selectedItem.type === "bunsen_burner" && (
            <Button size="sm" variant="outline" className="text-red-500">
              {selectedItem.temperature && selectedItem.temperature > 50 ? "Turn Off" : "Turn On"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
