import { useEffect, useState } from "react";
import { Progress } from "./progress";

export function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold mb-8 text-primary">
        Virtual Laboratory
      </h1>
      <div className="w-64">
        <Progress value={progress} className="h-2" />
      </div>
      <p className="mt-4 text-muted-foreground">Loading laboratory environment...</p>
    </div>
  );
}
