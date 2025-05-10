import { useState, useEffect } from "react";
import { useLabStore } from "../../lib/stores/useLabStore";
import { Card } from "./card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Button } from "./button";
import { CheckCircle2, Circle } from "lucide-react";

export function ExperimentPanel() {
  const { experiments, activeExperiment, startExperiment } = useLabStore();
  const [selectedTab, setSelectedTab] = useState<"chemistry" | "physics">("chemistry");
  
  const currentExperiment = activeExperiment 
    ? experiments.find(exp => exp.id === activeExperiment) 
    : null;
  
  // Filter experiments by subject
  const chemistryExperiments = experiments.filter(exp => exp.subject === "chemistry");
  const physicsExperiments = experiments.filter(exp => exp.subject === "physics");
  
  return (
    <Card className="fixed left-4 top-4 w-80 h-[60vh] bg-card text-card-foreground overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Virtual Lab Experiments</h2>
      </div>
      
      <Tabs defaultValue={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="flex-grow flex flex-col">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
          <TabsTrigger value="physics">Physics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chemistry" className="flex-grow overflow-auto p-4 space-y-4">
          {chemistryExperiments.map(experiment => (
            <ExperimentCard 
              key={experiment.id} 
              experiment={experiment} 
              isActive={experiment.id === activeExperiment}
              onStart={() => startExperiment(experiment.id)}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="physics" className="flex-grow overflow-auto p-4 space-y-4">
          {physicsExperiments.map(experiment => (
            <ExperimentCard 
              key={experiment.id} 
              experiment={experiment} 
              isActive={experiment.id === activeExperiment}
              onStart={() => startExperiment(experiment.id)}
            />
          ))}
        </TabsContent>
      </Tabs>
      
      {currentExperiment && (
        <div className="p-4 border-t">
          <h3 className="font-medium mb-2">Current Steps:</h3>
          <ul className="space-y-2 text-sm">
            {currentExperiment.steps.map(step => (
              <li key={step.id} className="flex items-start gap-2">
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                )}
                <span className={step.completed ? "text-green-500" : ""}>{step.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function ExperimentCard({ 
  experiment, 
  isActive, 
  onStart 
}: { 
  experiment: ReturnType<typeof useLabStore>["experiments"][0],
  isActive: boolean,
  onStart: () => void
}) {
  return (
    <Card className={`p-3 ${isActive ? "ring-2 ring-primary" : ""}`}>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{experiment.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            experiment.difficulty === "beginner" 
              ? "bg-green-100 text-green-800" 
              : experiment.difficulty === "intermediate"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}>
            {experiment.difficulty}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground">{experiment.description}</p>
        
        <div className="flex justify-between items-center">
          <Button 
            variant={isActive ? "secondary" : "default"} 
            size="sm"
            onClick={onStart}
          >
            {isActive ? "In Progress" : "Start"}
          </Button>
          
          {experiment.completed && (
            <span className="text-xs text-green-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
