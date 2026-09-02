import { ArmPageClient } from "./ArmPageClient";

/** Shared focused Arm route used by both the website and native Engine export. */
export function FrankenRobotsArmRoute() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 p-2 text-slate-100 sm:p-3">
      <h1 className="sr-only">FrankenRobots Arm Lab</h1>
      <ArmPageClient embedded />
    </main>
  );
}
