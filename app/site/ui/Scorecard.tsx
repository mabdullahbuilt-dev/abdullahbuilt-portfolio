"use client";

import { useState } from "react";

type Rating = "strong" | "partial" | "missing";
const labels: Record<Rating, string> = { strong: "Strong evidence", partial: "Partial", missing: "Missing" };

// A working evaluation scorecard. Criteria are server-rendered; the reader's ratings stay in the page only.
export default function Scorecard({ criteria }: { criteria: { id: string; area: string; question: string; evidence: string; redFlag: string }[] }) {
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const counts = { strong: 0, partial: 0, missing: 0 } as Record<Rating, number>;
  for (const rating of Object.values(ratings)) counts[rating] += 1;
  const rated = Object.keys(ratings).length;
  const verdict = rated < criteria.length ? `${criteria.length - rated} of ${criteria.length} areas not rated yet` : counts.missing > 1 ? "Too many gaps — ask for evidence before committing" : counts.missing === 1 ? "One gap — resolve it in writing before the build starts" : counts.partial > 2 ? "Promising — request a walkthrough of the partial areas" : "Strong evidence across the product boundary";
  return <div className="scorecard">
    <ol className="scorecard__list">
      {criteria.map((item, index) => <li key={item.id} className={`scorecard__row${ratings[item.id] ? ` scorecard__row--${ratings[item.id]}` : ""}`}>
        <div className="scorecard__text">
          <span className="scorecard__area"><b>{String(index + 1).padStart(2, "0")}</b>{item.area}</span>
          <strong>{item.question}</strong>
          <span><em>Evidence to request:</em> {item.evidence}</span>
          <span className="scorecard__flag"><em>Red flag:</em> {item.redFlag}</span>
        </div>
        <fieldset className="scorecard__rate">
          <legend>Rate {item.area}</legend>
          {(Object.keys(labels) as Rating[]).map(rating => <label key={rating} className={`scorecard__option scorecard__option--${rating}`}>
            <input type="radio" name={`score-${item.id}`} value={rating} checked={ratings[item.id] === rating} onChange={() => setRatings(current => ({ ...current, [item.id]: rating }))} />
            <span>{labels[rating]}</span>
          </label>)}
        </fieldset>
      </li>)}
    </ol>
    <div className="scorecard__summary" role="status" aria-live="polite">
      <span className="ab-eyebrow">Your scorecard</span>
      <strong>{verdict}</strong>
      <span className="scorecard__bar" aria-hidden="true">{(Object.keys(labels) as Rating[]).map(rating => <i key={rating} className={`scorecard__seg--${rating}`} style={{ flexGrow: counts[rating] }} />)}<i className="scorecard__seg--empty" style={{ flexGrow: criteria.length - rated }} /></span>
      <span className="scorecard__counts">{counts.strong} strong · {counts.partial} partial · {counts.missing} missing</span>
      {rated > 0 && <button type="button" className="scorecard__reset" onClick={() => setRatings({})}>Reset scorecard</button>}
    </div>
  </div>;
}
