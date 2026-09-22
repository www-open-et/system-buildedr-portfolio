import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  Printer,
  Check,
  Copy,
  Terminal,
  Layers,
  Workflow,
  CreditCard,
  Server,
} from "lucide-react";
import profile from "./content/profile.json";
import portrait from "./assets/fkadeal-headshot.jpg";

type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingMinutes: number;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};
const posts = Object.values(
  import.meta.glob<Post>("./content/posts/*.json", {
    eager: true,
    import: "default",
  }),
).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
const icons = [Workflow, CreditCard, Layers, Server];
const expertiseWork: Record<string, string[]> = {
  ai: [
    "lawgical-intake-automation",
    "lawgical-signals",
    "document-processing-management-ai-drafting",
  ],
  payments: ["birrlink-payments"],
  saas: [
    "yayehut-marketplace",
    "student-information-academic-operations",
    "unhcr-operational-reporting-case-workflows",
    "oda-award-voting",
  ],
  cloud: [
    "edufaris-api-infrastructure",
    "hibo-megazen-infrastructure",
    "faris-chat-ai-infrastructure",
    "oda-award-voting",
  ],
};
const nav = [
  ["/work/", "Work"],
  ["/expertise/", "Expertise"],
  ["/about/", "About"],
  ["/writing/", "Writing"],
];
const fits = [
  {
    id: "ai",
    label: "Automate a workflow",
    title: "AI that does the work. Systems that keep it on track.",
    text: "From signed webhooks to durable jobs, voice AI, and CRM handoffs. Build the workflow around the model, not just a demo around an API.",
    slug: "lawgical-intake-automation",
  },
  {
    id: "payments",
    label: "Connect payments",
    title: "The transaction is only the beginning.",
    text: "Payment channels, callback verification, state synchronization, and reconciliation. Connect the customer experience to the financial record.",
    slug: "birrlink-payments",
  },
  {
    id: "saas",
    label: "Build a SaaS product",
    title: "One product. Many tenants. Clear boundaries.",
    text: "A coherent experience across frontend, API, data isolation, and deployment. A full-stack partner for the decisions between those layers.",
    slug: "yayehut-marketplace",
  },
  {
    id: "cloud",
    label: "Make delivery reliable",
    title: "Your product needs a dependable place to run.",
    text: "Infrastructure support for education APIs, AI services, and business applications. Experience spans FARIS projects and independent consultancy, with Docker and delivery pipelines connecting code to running services.",
    slug: "edufaris-api-infrastructure",
  },
  {
    id: "documents",
    label: "Work with documents and AI",
    title: "From source documents to useful workflows.",
    text: "Document processing, management interfaces, and AI-assisted drafting. Consultancy experience spans Python processing workflows and Next.js/React interfaces for permissions, uploads, and sharing.",
    slug: "document-processing-management-ai-drafting",
  },
  {
    id: "academic",
    label: "Build an academic system",
    title: "Academic workflows, connected end to end.",
    text: "Student registration, grade validation, graduation processes, and administrative exports. Consultancy across Nuxt/Vue interfaces and Laravel APIs.",
    slug: "student-information-academic-operations",
  },
];

function Tags({ items }: { items: string[] }) {
  return (
    <div className="tags">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}
function ProjectCard({
  project,
  index,
}: {
  project: (typeof profile.projects)[number];
  index: number;
}) {
  return (
    <a className="project-card" href={`/work/${project.slug}/`}>
      <div className="card-top">
        <span className="mono">
          {String(index + 1).padStart(2, "0")} / {project.company}
        </span>
        <ArrowUpRight size={22} />
      </div>
      <div className="project-visual" aria-hidden="true">
        <span>
          {{
            Payments: "PAY",
            "Full-Stack SaaS": "SYS",
            "Academic Systems": "EDU",
            "Document & AI Workflows": "DOC",
            "Operational Reporting": "OPS",
            "Infrastructure Engineering": "INFRA",
            "Full Development & Infrastructure": "VOTE",
            "Web Application": "CMS",
          }[project.category] || "AI"}
        </span>
        <div className="signal-lines">
          <i />
          <i />
          <i />
          <i />
        </div>
        <small>{project.flow.slice(0, 3).join(" / ")}</small>
      </div>
      <p className="eyebrow">{project.category}</p>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <span className="text-link">
        Explore the engineering <ArrowRight size={17} />
      </span>
    </a>
  );
}
function PostCard({ post }: { post: Post }) {
  return (
    <a className="post-card" href={`/writing/${post.slug}/`}>
      <div className="mono">
        {post.category} <span>/ {post.readingMinutes} min read</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.description}</p>
      <span className="text-link">
        Read the note <ArrowUpRight size={17} />
      </span>
    </a>
  );
}
function Heading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-heading">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      {children && <div className="intro">{children}</div>}
    </header>
  );
}
function ContactCTA() {
  return (
    <section className="contact-banner">
      <div>
        <p className="eyebrow">Have a meaningful problem?</p>
        <h2>
          Let's build what
          <br />
          comes next.
        </h2>
      </div>
      <a className="button button-dark" href="/contact/">
        Start a conversation <ArrowUpRight size={20} />
      </a>
    </section>
  );
}
function FitFinder() {
  const [selected, setSelected] = useState(0);
  const fit = fits[selected];
  return (
    <section className="fit-section" aria-labelledby="fit-heading">
      <div>
        <p className="eyebrow">A little less guessing</p>
        <h2 id="fit-heading">
          What are you
          <br />
          working on?
        </h2>
        <p>Find the experience most relevant to your next challenge.</p>
        <div
          className="fit-options"
          aria-label="Choose your engineering challenge"
        >
          {fits.map((item, i) => (
            <button
              key={item.id}
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
            >
              {item.label}
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
      </div>
      <div className="fit-result" aria-live="polite">
        <span className="mono">RELEVANT EXPERIENCE / 0{selected + 1}</span>
        <Workflow size={42} strokeWidth={1} />
        <h3>{fit.title}</h3>
        <p>{fit.text}</p>
        <a className="text-link" href={`/work/${fit.slug}/`}>
          See related work <ArrowRight size={18} />
        </a>
        <a
          className="fit-contact"
          href={`mailto:${profile.email}?subject=${encodeURIComponent(`Let's discuss: ${fit.label}`)}`}
        >
          Talk through my project <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}
function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> {profile.location} / Working across
            boundaries
          </p>
          <h1>
            Complex systems.
            <br />
            Clear thinking.
            <br />
            <span>Real-world impact.</span>
          </h1>
          <p className="hero-description">
            I'm {profile.name}, a senior software engineer and consultant
            connecting <strong>AI, payments, and cloud infrastructure</strong>{" "}
            to the products people actually use.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="/work/">
              Explore my work <ArrowUpRight size={19} />
            </a>
            <a className="text-link" href="/contact/">
              Let's talk <ArrowRight size={18} />
            </a>
          </div>
          <div className="hero-proof">
            <div>
              <strong>~10 years</strong>
              <span>in the industry</span>
            </div>
            <div>
              <strong>110,000 users</strong>
              <span>ODA Award · voting day</span>
            </div>
          </div>
        </div>
        <div className="hero-art">
          <div className="portrait-wrap">
            <img
              src={portrait}
              alt="Fkadeal Matiwos, senior software engineer based in Addis Ababa"
              width="640"
              height="640"
              {...{ fetchpriority: "high" }}
            />
            <div className="portrait-caption">
              <span>ENGINEER. BUILDER. SYSTEMS THINKER.</span>
              <ArrowUpRight size={22} />
            </div>
          </div>
          <div className="system-label">
            <span className="status-dot" />
            <span>
              Connecting the dots.
              <br />
              <strong>Shipping the system.</strong>
            </span>
            <Terminal size={25} />
          </div>
          <span className="art-coordinate mono">09.03 N / 38.74 E</span>
        </div>
      </section>
      <div className="discipline-strip">
        <span>AI AUTOMATION</span>
        <i /> <span>PAYMENT SYSTEMS</span>
        <i />
        <span>FULL-STACK PRODUCTS</span>
        <i />
        <span>CLOUD & DEVOPS</span>
      </div>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Selected engineering</p>
            <h2>
              Not just screens.
              <br />
              Systems behind them.
            </h2>
          </div>
          <a className="text-link" href="/work/">
            All selected work <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="project-grid">
          {profile.projects
            .filter((project) =>
              [
                "lawgical-intake-automation",
                "birrlink-payments",
                "oda-award-voting",
              ].includes(project.slug),
            )
            .slice(0, 3)
            .map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
        </div>
      </section>
      <section className="point-of-view">
        <p className="eyebrow">My point of view</p>
        <h2>
          The interesting work happens
          <br />
          where systems <em>meet.</em>
        </h2>
        <div>
          <p>
            A payment provider and an accounting ledger. An AI call and a
            case-management system. A new product and the infrastructure that
            keeps it running.
          </p>
          <p>
            That's where I work best: taking ownership of the connections, the
            failure modes, and the details that turn a promising idea into
            useful software.
          </p>
          <a className="text-link" href="/about/">
            Meet the engineer <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <FitFinder />
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Engineering notebook</p>
            <h2>Thinking in public.</h2>
          </div>
          <a className="text-link" href="/writing/">
            All writing <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="post-grid">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
function About() {
  return (
    <>
      <Heading
        label="The person behind the systems"
        title="An engineer, not a single-stack label."
      >
        <p>{profile.summary}</p>
      </Heading>
      <section className="about-layout">
        <img
          className="about-portrait"
          src={portrait}
          width="640"
          height="640"
          alt="Portrait of Fkadeal Matiwos"
        />
        <div>
          <p className="eyebrow">How I work</p>
          <h2>
            Follow the problem.
            <br />
            Own the connections.
          </h2>
          <p>
            I work across product interfaces, backend services, and the
            infrastructure underneath. My focus is not using the most tools.
            It's making the pieces work together, and leaving the next engineer
            a system they can understand.
          </p>
          <p>
            That perspective has taken me through payments at BirrLink,
            legal-tech automation at Lawgical, and infrastructure for EduFaris
            API and Faris Chat / AI Services at FARIS. At ETM, I contributed to
            UNHCR operational reporting and case workflows.
          </p>
          <p>
            My independent consultancy spans student-information systems,
            document processing and AI-assisted drafting, Hibo Megazen
            infrastructure, and full development and infrastructure for ODA
            Award, which handled 110,000 users on voting day.
          </p>
          <a className="button button-outline" href="/resume/">
            View recruiter brief <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">
          Selected experience / Some engagements overlap
        </p>
        <h2>A career across layers.</h2>
        <div className="timeline">
          {profile.experience.map((job) => (
            <article key={job.company}>
              <span className="mono">{job.period}</span>
              <div>
                <h3>{job.company}</h3>
                <h4>{job.role}</h4>
                <p>{job.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section faq">
        <p className="eyebrow">A few useful answers</p>
        <h2>Before we talk.</h2>
        {profile.faqs.map((faq) => (
          <details key={faq.question}>
            <summary>
              {faq.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </section>
      <ContactCTA />
    </>
  );
}
function Expertise() {
  return (
    <>
      <Heading
        label="Capabilities / From application to operation"
        title="Depth at the intersections."
      >
        <p>
          Senior software engineering and consultancy in {profile.location}. AI
          automation, payments, academic and document systems, and cloud
          infrastructure—with project evidence for each area.
        </p>
      </Heading>
      <div className="expertise-list">
        {profile.expertise.map((item, i) => {
          const Icon = icons[i];
          return (
            <section key={item.id} id={item.id}>
              <div className="expertise-number">
                <Icon size={32} strokeWidth={1.4} />
                <span className="mono">0{i + 1}</span>
              </div>
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <Tags items={item.skills} />
                <nav
                  className="related-work"
                  aria-label={`${item.title} project evidence`}
                >
                  {profile.projects
                    .filter((project) =>
                      expertiseWork[item.id]?.includes(project.slug),
                    )
                    .map((project) => (
                      <a
                        key={project.slug}
                        className="text-link"
                        href={`/work/${project.slug}/`}
                      >
                        {project.title} <ArrowUpRight size={18} />
                      </a>
                    ))}
                </nav>
              </div>
            </section>
          );
        })}
      </div>
      <section className="section">
        <p className="eyebrow">Working together</p>
        <h2>Less handoff. More ownership.</h2>
        <div className="process-grid">
          {[
            [
              "01 / Understand",
              "Start with the real constraints",
              "Map the workflow, existing architecture, team needs, and risks before reaching for a framework.",
            ],
            [
              "02 / Build",
              "Deliver across boundaries",
              "Connect the interface, API, data, and infrastructure with explicit contracts and a useful feedback loop.",
            ],
            [
              "03 / Operate",
              "Make failure understandable",
              "Think through retries, access control, observability, deployment, and the handover, not just the happy path.",
            ],
          ].map(([label, title, text]) => (
            <article key={label}>
              <span className="mono">{label}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <FitFinder />
      <ContactCTA />
    </>
  );
}
function Work() {
  return (
    <>
      <Heading
        label="Selected work / Real integration problems"
        title="Built across boundaries."
      >
        <p>
          {profile.projects.length} selected projects across AI automation,
          payments, full-stack products, and infrastructure. Explore company
          contributions and independent consultancy, with roles and technical
          scope explained in each case study.
        </p>
      </Heading>
      <div className="project-grid work-grid">
        {profile.projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
      <ContactCTA />
    </>
  );
}
function Project({ project }: { project: (typeof profile.projects)[number] }) {
  return (
    <>
      <a className="back-link" href="/work/">
        All selected work <ArrowUpRight size={16} />
      </a>
      <Heading
        label={`${project.company} / ${project.category}`}
        title={project.title}
      >
        <p>{project.summary}</p>
      </Heading>
      <div className="case-layout">
        <aside>
          <p className="eyebrow">Engineering context</p>
          <strong>{project.company}</strong>
          <p>{project.category}</p>
          <p className="eyebrow">Project technologies</p>
          <Tags items={project.stack} />
          <a className="text-link" href="/contact/">
            Discuss similar work <ArrowUpRight size={16} />
          </a>
        </aside>
        <article className="prose">
          <h2>The challenge</h2>
          <p>{project.challenge}</p>
          <h2>The engineering approach</h2>
          <ul>
            {project.approach.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <h2>The system, at a glance</h2>
          <ol className="flow">
            {project.flow.map((step, i) => (
              <li key={step}>
                <span className="mono">0{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <h2>What this work connects</h2>
          <p>{project.outcome}</p>
          <p className="editorial-note">
            Selected contributions, not a claim of sole authorship.
            Client-specific configurations and operational data are
            intentionally excluded.
          </p>
        </article>
      </div>
      <ContactCTA />
    </>
  );
}
function Writing() {
  const [query, setQuery] = useState("");
  const terms = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((term) => term.replace(/s$/, ""));
  const filtered = posts.filter((post) => {
    const text =
      `${post.title} ${post.description} ${post.category} ${post.sections.map((section) => `${section.heading} ${section.paragraphs.join(" ")} ${section.bullets?.join(" ") || ""}`).join(" ")}`.toLowerCase();
    return terms.every((term) => text.includes(term));
  });
  return (
    <>
      <Heading
        label="Engineering notebook"
        title="Notes from the system layer."
      >
        <p>
          Practical thinking about reliable AI workflows, payment integrations,
          tenant boundaries, and maintainable delivery. These notes complement
          my company and consultancy work with reusable engineering guidance.
        </p>
      </Heading>
      <div className="writing-toolbar">
        <label htmlFor="writing-search">
          Find a topic
          <input
            id="writing-search"
            type="search"
            placeholder="Try payments, AI, or tenants"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <a className="text-link" href="/feed.xml">
          Subscribe via RSS <ArrowUpRight size={17} />
        </a>
      </div>
      <p className="sr-only" aria-live="polite">
        {filtered.length} notes found
      </p>
      <div className="post-grid">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="empty-state">
          No notes match that search. Try a broader topic or clear the search.
        </p>
      )}
      <ContactCTA />
    </>
  );
}
function Article({ post }: { post: Post }) {
  return (
    <>
      <a className="back-link" href="/writing/">
        All engineering notes <ArrowUpRight size={16} />
      </a>
      <Heading
        label={`${post.category} / ${post.readingMinutes} min read`}
        title={post.title}
      >
        <p>{post.description}</p>
      </Heading>
      <div className="article-meta">
        <a href="/about/">{profile.name}</a>
        <time dateTime={post.date}>
          {new Date(`${post.date}T00:00:00Z`).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          })}
        </time>
      </div>
      <div className="case-layout">
        <aside>
          <p className="eyebrow">In this note</p>
          <nav className="toc" aria-label="Article contents">
            {post.sections.map((section, i) => (
              <a href={`#section-${i + 1}`} key={section.heading}>
                {section.heading}
              </a>
            ))}
          </nav>
        </aside>
        <article className="prose">
          {post.sections.map((section, i) => (
            <section id={`section-${i + 1}`} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <div className="author-box">
            <strong>From the engineering notebook of {profile.name}</strong>
            <p>
              Senior software engineer and consultant in {profile.location}. AI
              automation, payments, business applications, and cloud
              infrastructure.
            </p>
            <a className="text-link" href="/about/">
              More about my work <ArrowUpRight size={17} />
            </a>
          </div>
        </article>
      </div>
      <ContactCTA />
    </>
  );
}
function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [topic, setTopic] = useState("AI automation");
  const [brief, setBrief] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <>
      <Heading
        label="Good work starts with a conversation"
        title="What's the challenge?"
      >
        <p>
          Looking for a senior engineer or consultancy support? Let's discuss AI
          and document workflows, payments, academic or business systems, full
          application development, or infrastructure delivery.
        </p>
      </Heading>
      <section className="contact-layout">
        <div className="contact-direct">
          <p className="eyebrow">The direct route</p>
          <a className="email-link" href={`mailto:${profile.email}`}>
            {profile.email}
            <ArrowUpRight size={25} />
          </a>
          <button className="copy-button" onClick={copyEmail}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Email copied" : "Copy email"}
          </button>
          <span role="status">
            {copyError
              ? `Copy unavailable. Email: ${profile.email}`
              : copied
                ? "Ready to paste into your email client."
                : ""}
          </span>
          <div className="contact-location">
            <span className="status-dot" />
            <div>
              <strong>{profile.location}</strong>
              <p>
                East Africa Time / UTC+3
                <br />
                Remote engineering conversations welcome.
              </p>
            </div>
          </div>
          <a
            className="social-link"
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin size={20} />
            LinkedIn
            <ArrowUpRight size={17} />
          </a>
          <a
            className="social-link"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={20} />
            GitHub
            <ArrowUpRight size={17} />
          </a>
          <a className="social-link" href="/resume/">
            <Printer size={20} />
            Recruiter brief
            <ArrowUpRight size={17} />
          </a>
        </div>
        <form
          className="brief-builder"
          onSubmit={(event) => {
            event.preventDefault();
            window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Engineering conversation: ${topic}`)}&body=${encodeURIComponent(`Hi Fkadeal,\n\nI'm reaching out about ${topic.toLowerCase()}.\n\n${brief}\n\nBest,\n`)}`;
          }}
        >
          <p className="eyebrow">A useful first message</p>
          <h2>Start with the context.</h2>
          <label htmlFor="topic">
            I'd like to discuss
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              {[
                "AI automation",
                "Payment integrations",
                "SaaS / full-stack development",
                "Cloud & infrastructure",
                "Document management & AI-assisted drafting",
                "Academic & student-information systems",
                "Reporting & case workflows",
                "Full development & infrastructure consultancy",
                "A senior engineering role",
                "Something else",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label htmlFor="brief">
            A little about the opportunity
            <textarea
              id="brief"
              rows={5}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              maxLength={1800}
              placeholder="The problem, your current stack, and what a good outcome looks like..."
              required
            />
          </label>
          <button className="button button-dark" type="submit">
            Open email draft <Mail size={18} />
          </button>
          <p className="form-note">
            Opens your email app. Nothing is submitted or stored on this
            website. Please don't include credentials or sensitive customer
            data.
          </p>
        </form>
      </section>
    </>
  );
}
function Resume() {
  return (
    <div className="resume">
      <div className="resume-toolbar">
        <a className="text-link" href="/about/">
          Back to profile <ArrowUpRight size={16} />
        </a>
        <button className="button button-dark" onClick={() => window.print()}>
          Print / save PDF <Printer size={18} />
        </button>
      </div>
      <Heading
        label="Recruiter brief / Selected experience"
        title={profile.name}
      >
        <p>{profile.role}</p>
      </Heading>
      <p className="resume-contact">
        {profile.location} /{" "}
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <br />
        <a href={profile.url}>{profile.url}</a> /{" "}
        <a href={profile.linkedin}>LinkedIn</a> /{" "}
        <a href={profile.github}>GitHub</a>
      </p>
      <p>{profile.summary}</p>
      <h2>Core expertise</h2>
      <div className="resume-skills">
        {profile.expertise.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.skills.join(" / ")}</p>
          </div>
        ))}
      </div>
      <h2>Selected experience</h2>
      {profile.experience.map((job) => (
        <section className="resume-job" key={job.company}>
          <span className="mono">{job.period}</span>
          <h3>
            {job.company} / {job.role}
          </h3>
          <p>{job.description}</p>
        </section>
      ))}
      <h2>Selected project portfolio</h2>
      {profile.projects.map((p) => (
        <section className="resume-job" key={p.slug}>
          <h3>
            <a href={`/work/${p.slug}/`}>{p.title}</a>
          </h3>
          <p className="mono">
            {p.company} / {p.category}
          </p>
          <p>{p.summary}</p>
        </section>
      ))}
    </div>
  );
}
function NotFound() {
  return (
    <Heading label="404 / Unknown route" title="This connection doesn't exist.">
      <p>
        The page may have moved.{" "}
        <a className="text-link" href="/">
          Return to the homepage <ArrowRight size={18} />
        </a>
      </p>
    </Heading>
  );
}

export default function App({
  path = typeof window === "undefined" ? "/" : window.location.pathname,
}: {
  path?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const route = path === "/" ? "/" : `${path.replace(/\/+$/, "")}/`;
  const project = profile.projects.find(
    (item) => route === `/work/${item.slug}/`,
  );
  const post = posts.find((item) => route === `/writing/${item.slug}/`);
  const page =
    route === "/" ? (
      <Home />
    ) : route === "/about/" ? (
      <About />
    ) : route === "/expertise/" ? (
      <Expertise />
    ) : route === "/work/" ? (
      <Work />
    ) : route === "/writing/" ? (
      <Writing />
    ) : route === "/contact/" ? (
      <Contact />
    ) : route === "/resume/" ? (
      <Resume />
    ) : project ? (
      <Project project={project} />
    ) : post ? (
      <Article post={post} />
    ) : (
      <NotFound />
    );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a href="/" className="brand" aria-label="Fkadeal Matiwos home">
          fkadl<span className="brand-dot">.</span>
          <span className="brand-caption">SOFTWARE ENGINEER</span>
        </a>
        <button
          className="menu-button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav
          id="main-nav"
          className={menuOpen ? "main-nav is-open" : "main-nav"}
          aria-label="Main navigation"
        >
          {nav.map(([href, label]) => (
            <a
              key={href}
              href={href}
              aria-current={route.startsWith(href) ? "page" : undefined}
            >
              {label}
            </a>
          ))}
          <a
            className="nav-contact"
            href="/contact/"
            aria-current={route === "/contact/" ? "page" : undefined}
          >
            Let's talk <ArrowUpRight size={17} />
          </a>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        {page}
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <a className="brand" href="/">
            fkadl<span className="brand-dot">.</span>
          </a>
          <p>
            Thoughtful engineering.
            <br />
            From Addis Ababa, to wherever good work happens.
          </p>
          <div>
            <a
              href={profile.github}
              aria-label="GitHub profile"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={21} />
            </a>
            <a
              href={profile.linkedin}
              aria-label="LinkedIn profile"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={21} />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email Fkadeal">
              <Mail size={21} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{profile.name} / Built with intention.</span>
          <div>
            <a href="/resume/">Recruiter brief</a>
            <a href="/llms.txt">For AI readers</a>
            <a href="/feed.xml">RSS</a>
          </div>
        </div>
      </footer>
    </>
  );
}
