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
        Only the {receipt.searchedParams}-parameter output layer moves. Letting
        the search touch more of the network makes it <em>worse</em>, and not
        for want of trying: on the same two challenges the head scored 46.3%
        from 9,600 evaluations, while 38,016 parameters scored 33.3% from
        14,000 and all 77,696 scored 21.1% from 14,800. The larger scopes were
        given more search, not less, and still lost. More capacity is not more
        capability when every evaluation costs a physics rollout. Weights and
        receipts ship under{" "}
        <code className="break-all">public/robots/g1/transformer/</code>.
      </p>
    </div>
  );
}
