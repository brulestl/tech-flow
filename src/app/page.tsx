import React from "react";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import SaveButton from "@/components/ui/SaveButton";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Continue your learning journey where you left off
        </p>
      </div>
      
      <DashboardGrid />
      
      {/* Floating action button for quick save - mobile & desktop */}
      <SaveButton />
    </div>
  );
}
