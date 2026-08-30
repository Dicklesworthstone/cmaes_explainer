import { G1WalkingFlagship } from "../../../../../app/components/G1WalkingFlagship";
import { FrankenRobotsResearchAnnex } from "../../../../../app/components/FrankenRobotsResearchAnnex";

export default function HumanoidEnginePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 p-2 text-slate-100 sm:p-3">
      <h1 className="sr-only">FrankenRobots Humanoid Lab</h1>
      <G1WalkingFlagship embedded />
      <div className="mt-8">
        <FrankenRobotsResearchAnnex />
      </div>
    </main>
  );
}
