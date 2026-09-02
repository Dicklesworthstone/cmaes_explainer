import { ArmPageClient } from "../../components/ArmPageClient";

export default function FrankenRobotsArmPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 p-2 text-slate-100 sm:p-3">
      <h1 className="sr-only">FrankenRobots Arm Lab</h1>
      <ArmPageClient embedded />
    </main>
  );
}
