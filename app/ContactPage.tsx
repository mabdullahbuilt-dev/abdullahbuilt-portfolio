import Link from "next/link";

const origin = "https://abdullahbuilt.top";
const services = [
  ["custom-software-development", "Custom Software Development"],
  ["saas-development", "SaaS Development"],
  ["web-application-development", "Web Application Development"],
  ["api-integration-development", "API Integration Development"],
  ["business-automation", "Business Automation & Internal Tools"],
  ["mvp-product-development", "MVP Product Development"],
  ["ai-application-development", "AI Application & Agent Development"],
  ["product-rescue", "Product Rescue & Stabilization"],
] as const;

export default function ContactPage({ requestedService = "", source = "" }: { requestedService?: string; source?: string }) {
  const url = `${origin}/contact/`;
  const selectedService = services.some(([value]) => value === requestedService) ? requestedService : "";
  const selectedLabel = services.find(([value]) => value === selectedService)?.[1];
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${url}#webpage`,
    url,
    name: "Start a software project",
    isPartOf: { "@id": `${origin}/#website` },
    about: { "@id": `${origin}/#business` },
    dateModified: "2026-09-27",
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <nav className="seo-crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span> / Contact</span></nav>
    <header className="pg-hero pg-hero--contact">
      <div className="pg-hero__copy">
        <p className="ab-eyebrow">PROJECT INQUIRY</p>
        <h1>Tell me what needs to work<span className="pg-hero__dot">.</span></h1>
        <div className="pg-hero__lede"><p>{selectedLabel ? `${selectedLabel} is preselected below. Share the current stage, constraints, and outcome you need.` : "Share the product, current stage, important constraints, and the outcome you need. An early idea is enough to start."}</p></div>
        <div className="pg-hero__actions"><a className="seo-button" href={`mailto:mabdullah.built@gmail.com?subject=${encodeURIComponent(selectedLabel ? `${selectedLabel} inquiry` : "Project inquiry")}`} data-event="email_click">Email Muhammad <span>↗</span></a><a className="seo-text-link" href="https://cal.com/muhammad-abdullah-built/idea-to-product" data-event="book_call_click">Book a free 15-minute fit call ↗</a></div>
      </div>
    </header>
    <section className="seo-contact-layout contact">
      <div>
        <h2>Start with the critical path</h2>
        <p>A useful first message includes who the user is, what they need to do, what exists today, the important systems or constraints, and any timing requirement.</p>
        <ol className="contact__steps" aria-label="What happens next"><li><strong>You send the brief</strong><span>Email or the form — an early idea is enough.</span></li><li><strong>I reply with questions</strong><span>About the user, the workflow, and constraints.</span></li><li><strong>We agree on a first step</strong><span>A fit call, a scope, or a pointer elsewhere.</span></li></ol>
        <a className="seo-contact" href="mailto:mabdullah.built@gmail.com">mabdullah.built@gmail.com</a>
        <p className="seo-note">If direct email delivery is unavailable, the form opens a prepared Gmail message with your project details so nothing is lost.</p>
      </div>
      <form className="contact-form seo-form" id="contactForm">
        <h2>Project inquiry</h2>
        <input className="honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <input type="hidden" name="source" value={source} />
        <label>Name<input name="name" required autoComplete="name" placeholder="Your name" /></label>
        <label>Email<input name="email" type="email" required autoComplete="email" placeholder="you@company.com" /></label>
        <label>Relevant service<select name="service" defaultValue={selectedService}><option value="">Select a service</option>{services.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Current stage<select name="stage" defaultValue=""><option value="">Select the current stage</option><option>Idea or early scope</option><option>Prototype</option><option>Existing product</option><option>Stalled or unstable build</option><option>Defined feature</option></select></label>
        <label>Useful link <span>(optional)</span><input name="projectUrl" type="url" inputMode="url" placeholder="https://" /></label>
        <label>Timeline <span>(optional)</span><input name="timeline" placeholder="For example: 6–8 weeks" /></label>
        <label>Budget range <span>(optional)</span><select name="budget" defaultValue=""><option value="">Prefer not to say yet</option><option>Under $2,500</option><option>$2,500–$5,000</option><option>$5,000–$10,000</option><option>$10,000+</option></select></label>
        <label>What are you building?<textarea name="message" rows={6} required minLength={3} placeholder="Describe the product, important workflow, constraints, and desired outcome" /></label>
        <button type="submit" className="contact-submit">Send message <span aria-hidden="true">↗</span></button>
        <p className="form-status" id="formStatus" role="status" aria-live="polite"></p>
      </form>
    </section>
    <section className="cta" aria-labelledby="meeting-heading"><div className="cta__inner">
      <div><p className="ab-eyebrow">MEETING</p><h2 id="meeting-heading">Prefer to talk through the fit?</h2>
      <p>Book a free 15-minute call on Cal.com. Google Meet or Zoom can be used for the conversation.</p></div>
      <div className="cta__actions"><a className="seo-button" href="https://cal.com/muhammad-abdullah-built/idea-to-product" data-event="book_call_click">Book a 15-minute fit call <span>↗</span></a></div>
    </div></section>
  </>;
}
