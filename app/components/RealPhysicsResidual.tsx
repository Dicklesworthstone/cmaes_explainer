import receipt from "../../public/robots/g1/transformer/g1-real-physics-receipt.json";

/**
 * The transformer's result on the REAL G1 owner, not the browser stand-in.
 *
 * Every other transformer number on this page is measured in the kinematic
 * stand-in, whose forward speed is a formula with a hard 7.80 m ceiling. This
 * card reports the same architecture searched against the owner the flagship
 * actually uses: articulated-body dynamics, real contact, and the identical
 * multi-factor walking objective CMA-ES minimises above.
 *
 * The search starts from a zero policy head, which on a residual policy is
 * exactly the tuned controller's own behaviour, so the baseline row is not a
 * separate run — it is this same policy before the search moved it. Every
 * accepted step is therefore a measured improvement over the shipped
 * controller rather than a comparison between two differently-tuned things.
 *
 * Values come from the committed receipt, so the copy cannot drift away from
 * the artifact it describes.
 */
export function RealPhysicsResidual() {
  const gainPct =
    (100 * (receipt.tunedControllerObjective - receipt.residualObjective)) /
    Math.abs(receipt.tunedControllerObjective);
  const distancePct =
    (100 *
      (receipt.residualDistanceMeters - receipt.tunedControllerDistanceMeters)) /
    receipt.tunedControllerDistanceMeters;
  const rows = [
    {
      label: "Tuned controller (5,040-D phase residual)",
      objective: receipt.tunedControllerObjective,
      distance: receipt.tunedControllerDistanceMeters,
      steps: 720,
    },
    {
      label: "Transformer residual on top of it",
      objective: receipt.residualObjective,
      distance: receipt.residualDistanceMeters,
      steps: receipt.residualCompletedSteps,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
      <table className="w-full text-left text-sm text-slate-300">
        <caption className="sr-only">
          Transformer residual versus the tuned controller on real G1 physics
        </caption>
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-500">
            <th scope="col" className="pb-2 font-medium">
              Policy
            </th>
            <th scope="col" className="pb-2 text-right font-medium">
              Objective
            </th>
            <th scope="col" className="pb-2 text-right font-medium">
              Distance
            </th>
            <th scope="col" className="pb-2 text-right font-medium">
              Steps
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.label}
              className={index === 1 ? "font-semibold text-emerald-300" : ""}
            >
              <th scope="row" className="py-2 pr-4 font-normal">
                {row.label}
              </th>
              <td className="py-2 text-right tabular-nums">
                {row.objective.toFixed(2)}
              </td>
              <td className="py-2 text-right tabular-nums">
                {row.distance.toFixed(4)} m
              </td>
              <td className="py-2 text-right tabular-nums">{row.steps}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm leading-6 text-slate-400">
        Lower objective is better. The residual improves the tuned controller by{" "}
        <strong className="text-emerald-300">{gainPct.toFixed(1)}%</strong> on
        the owner&apos;s own verdict and walks{" "}
        <strong className="text-emerald-300">
          {distancePct.toFixed(0)}% further
        </strong>{" "}
        without falling, after {receipt.episodes.toLocaleString()} episodes and{" "}
        {Math.round(receipt.wallclockSeconds)} s on one CPU core — no GPU. Only
        the {receipt.searchedParams}-parameter output layer is searched; the
        trunk stays frozen. Weights and receipt:{" "}
        <code className="break-all">
          public/robots/g1/transformer/g1-real-physics-residual.bin
        </code>
        .
      </p>
    </div>
  );
}
