import flatReceipt from "../../public/robots/g1/transformer/g1-real-physics-flat-receipt.json";
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
 * The headline pair is scored on BOTH challenges, flat and terrain-with-push,
 * averaged. The flat-only receipt is kept beside it because that is the
 * condition the earlier hand-rolled search reported, and quoting a
 * flat-only number as though it were the general one is the exact
 * apples-to-oranges move this card exists to avoid.
 *
 * Values come from the committed receipts, so the copy cannot drift away from
 * the artifacts it describes.
 */

/** Percentage improvement on an objective where lower is better. */
function gain(base: number, tuned: number): number {
  return (100 * (base - tuned)) / Math.abs(base);
}

export function RealPhysicsResidual() {
  const objectiveGain = gain(
    receipt.tunedControllerObjective,
    receipt.residualObjective,
  );
  const distanceGain =
    (100 *
      (receipt.residualDistanceMeters - receipt.tunedControllerDistanceMeters)) /
    receipt.tunedControllerDistanceMeters;
  const flatGain = gain(
    flatReceipt.tunedControllerObjective,
    flatReceipt.residualObjective,
  );

  const rows = [
    {
      label: "Tuned controller (5,040-D phase residual)",
      objective: receipt.tunedControllerObjective,
      distance: receipt.tunedControllerDistanceMeters,
      steps: 720,
      highlight: false,
    },
    {
      label: "Transformer residual on top of it",
      objective: receipt.residualObjective,
      distance: receipt.residualDistanceMeters,
      steps: receipt.residualCompletedSteps,
      highlight: true,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
      <table className="w-full text-left text-sm text-slate-300">
        <caption className="sr-only">
          Transformer residual versus the tuned controller on real G1 physics,
          averaged over flat and terrain-with-push
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
          {rows.map((row) => (
            <tr
              key={row.label}
              className={row.highlight ? "font-semibold text-emerald-300" : ""}
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
        Lower objective is better. Averaged over both challenges the residual
        improves the tuned controller by{" "}
        <strong className="text-emerald-300">
          {objectiveGain.toFixed(1)}%
        </strong>{" "}
        on the owner&apos;s own verdict and walks{" "}
        <strong className="text-emerald-300">
          {distanceGain.toFixed(0)}% further
        </strong>{" "}
        without falling, from{" "}
        {receipt.evaluations.toLocaleString()} evaluations in{" "}
        {Math.round(receipt.wallclockSeconds)} s on ten CPU cores — no GPU and
        no backprop, which you cannot run through a contact solver anyway. The
        optimiser is this project&apos;s own {receipt.optimizer}, restarted{" "}
        {receipt.restarts} times. On flat ground alone the same search reaches{" "}
        <strong className="text-emerald-300">{flatGain.toFixed(0)}%</strong> and{" "}
        {flatReceipt.residualDistanceMeters.toFixed(2)} m; that is the easier
        condition, so the cross-challenge figure is the one quoted above.
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-400">
        Only the {receipt.searchedParams}-parameter output layer moves in the
        policy above, and how much of the network is worth searching turns out
        to depend on what it is being asked to do. Across both challenges at a
        matched budget the output layer reached 54.7%, the final transformer
        block — 38,016 parameters — reached <strong>71.8%</strong>, and turning
        all 77,696 loose reached 43.2%. On flat ground alone the order
        reverses: the output layer reaches <strong>165.4%</strong> and walks
        1.06 m, while the final block manages 155.2% and only 0.62 m. Extra
        capacity earns its keep on the harder pair and costs distance on the
        easy one, so there is no single answer here to how big a policy should
        be — only a measured one per task. Re-running the output layer and the
        block at 45,000 evaluations, more than three times the budget, returned
        the same figures to the digit: these are ceilings, not snapshots.
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-400">
        The output layer is what ships, because it wins the condition the
        in-browser trainer starts on and is the only scope that trainer can
        resume: a wider policy carries its own trunk, so its head alone means
        nothing without it. An earlier version of this card claimed a wider
        search simply does worse, from a sweep run before the
        transformer&apos;s arithmetic was made portable across targets. Those
        numbers were measured against host maths the browser did not share and
        did not survive re-measurement. Weights and receipts ship under{" "}
        <code className="break-all">public/robots/g1/transformer/</code>.
      </p>
    </div>
  );
}
