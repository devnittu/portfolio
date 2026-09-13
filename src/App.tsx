import { FormEvent, useEffect, useRef, useState } from "react";
import { starter, type Capability, type Project, type Site } from "./data";
const STORE = "nitin-portfolio-v2";
const get = (): Site => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (!saved || typeof saved !== "object") return starter;
    const capabilities =
      Array.isArray(saved.capabilities) &&
      saved.capabilities.some((item: { name?: string }) => item.name === "Databases")
        ? saved.capabilities
        : starter.capabilities;
    return {
      ...starter,
      ...saved,
      resume: saved.resume === "#" ? "" : saved.resume,
      projects: Array.isArray(saved.projects)
        ? saved.projects.map((project: Partial<Project>) => ({
            ...project,
            image: typeof project.image === "string" ? project.image : "",
          }))
        : starter.projects,
      capabilities,
    };
  } catch {
    return starter;
  }
};
const icon = (name: string) =>
  name === "linkedin" ? (
    <svg viewBox="0 0 24 24">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.36 8.02h4.28V22H.36V8.02zM7.31 8.02h4.1v1.91h.06c.57-1.08 1.97-2.22 4.05-2.22 4.33 0 5.13 2.85 5.13 6.55V22h-4.27v-6.83c0-1.63-.03-3.73-2.27-3.73-2.27 0-2.62 1.77-2.62 3.61V22H7.31V8.02z" />
    </svg>
  ) : (
    <b>{name}</b>
  );
const ext = (url: string) => (url.startsWith("mailto:") ? undefined : "_blank");
export default function App() {
  const [site, setSite] = useState<Site>(get);
  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(site));
    } catch {
      // Private browsing or blocked site storage should not break the public page.
    }
  }, [site]);
  return location.pathname.startsWith("/admin") ? (
    <Admin site={site} setSite={setSite} />
  ) : (
    <Portfolio site={site} />
  );
}
function Portfolio({ site }: { site: Site }) {
  return (
    <div className="site">
      <nav>
        <a className="wordmark" href="#top">
          {site.name}
          <i>.</i>
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href={`mailto:${site.email}`}>Contact</a>
        </div>
        <a className="nav-cta" href={`mailto:${site.email}`}>
          Let's talk ↗
        </a>
      </nav>
      <main id="top">
        <section className="landing">
          <div className="landing-meta">
            <span>PORTFOLIO / 2026</span>
            <span>{site.location}</span>
          </div>
          <div className="landing-grid">
            <div className="landing-copy">
              <p className="role">JAVA · BACKEND · AI/ML</p>
              <h1>
                {site.title.split("\n").map((line, i) => (
                  <span key={line} className={i === 1 ? "accent" : ""}>
                    {line}
                  </span>
                ))}
              </h1>
              <p className="statement">{site.statement}</p>
              <a className="round-link" href="#work">
                Explore work <b>↓</b>
              </a>
            </div>
            <div className="index-art">
              <span>01</span>
              <div className="ring ring-one" />
              <div className="ring ring-two" />
              <strong>
                BUILD
                <br />
                WITH
                <br />
                <i>intent.</i>
              </strong>
            </div>
          </div>
        </section>
        <section className="ticker">
          <span>AVAILABLE FOR INTERNSHIPS</span>
          <span>•</span>
          <span>OPEN TO COLLABORATION</span>
          <span>•</span>
          <span>BACKEND ENGINEERING</span>
          <span>•</span>
        </section>
        <section id="work" className="work">
          <div className="section-label">01 / Selected work</div>
          <div className="work-intro">
            <h2>
              Projects with
              <br />
              <em>purpose.</em>
            </h2>
            <p>
              Selected work in backend engineering, systems and AI-enabled
              applications.
            </p>
          </div>
          <ProjectCarousel projects={site.projects} />
        </section>
        <section id="about" className="about">
          <div className="about-side">
            <span>02 / About me</span>
            <p>{site.location}</p>
          </div>
          <div>
            <h2>
              Learning the
              <br />
              <em>long way round.</em>
            </h2>
            <p className="bio">{site.bio}</p>
            <div className="skills">
              <span>Toolkit</span>
              <p>{site.skills}</p>
            </div>
          </div>
        </section>
        <section className="capabilities">
          <div className="section-label">03 / What I build</div>
          <div className="capability-grid">
            {site.capabilities.map((group) => (
              <article className="capability-panel" key={group.name}>
                <div className="capability-heading">
                  <span>{group.number}</span>
                  <span>{group.name}</span>
                </div>
                <h3>{group.name}</h3>
                <p>{group.description}</p>
                <div className="capability-tools">
                  {group.tools.map((tool) => (
                    <div className="capability-tool" key={tool.name}>
                      <img
                        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tool.icon}`}
                        alt=""
                      />
                      <span>{tool.name}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="contact">
          <span>04 / Contact</span>
          <h2>
            Have a problem
            <br />
            worth <em>solving?</em>
          </h2>
          <a href={`mailto:${site.email}`}>
            {site.email} <b>↗</b>
          </a>
          <div className="socials">
            <Social label="GH" href={site.github} />
            <Social label="linkedin" href={site.linkedin} />
            <Social label="LC" href={site.leetcode} />
            {site.resume && <Social label="CV" href={site.resume} />}
          </div>
        </section>
      </main>
      <footer>
        <span>
          {site.name} © {new Date().getFullYear()}
        </span>
        <span>Designed & built with intent.</span>
      </footer>
    </div>
  );
}
function ProjectCarousel({ projects }: { projects: Project[] }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => {
    track.current?.scrollBy({ left: direction * 420, behavior: "smooth" });
  };
  return (
    <div className="project-carousel">
      <div className="carousel-controls" aria-label="Project navigation">
        <button type="button" onClick={() => scroll(-1)} aria-label="Previous projects">
          ←
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label="Next projects">
          →
        </button>
      </div>
      <div className="project-track" ref={track}>
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index + 1} key={project.id} />
        ))}
      </div>
    </div>
  );
}
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`project-card card-${index % 3}`}>
      <div className="project-art">
        {project.image ? (
          <img src={project.image} alt={`${project.name} preview`} />
        ) : (
          <>
            <span>{String(index).padStart(2, "0")}</span>
            <b>{project.category.split("/")[0]}</b>
          </>
        )}
      </div>
      <div className="project-info">
        <div>
          <span>
            {project.category} / {project.year}
          </span>
          <h3>{project.name}</h3>
        </div>
        <p>{project.description}</p>
        <div className="project-links">
          {project.github && (
            <a href={project.github} target={ext(project.github)} rel="noreferrer">
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
function Social({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} target={ext(href)} rel="noreferrer" aria-label={label}>
      {icon(label)}
    </a>
  );
}
function Admin({ site, setSite }: { site: Site; setSite: (s: Site) => void }) {
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(sessionStorage.getItem("admin-v2") === "yes");
  const [draft, setDraft] = useState(site);
  const update = (key: keyof Site, val: any) =>
    setDraft((d) => ({ ...d, [key]: val }));
  if (!ok)
    return (
      <main className="login">
        <span>Nitin portfolio editor</span>
        <h1>Admin access.</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pass === import.meta.env.VITE_ADMIN_PASSWORD) {
              sessionStorage.setItem("admin-v2", "yes");
              setOk(true);
            } else alert("Incorrect password");
          }}
        >
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button>Enter →</button>
        </form>
        <p>Set VITE_ADMIN_PASSWORD in your local .env file.</p>
      </main>
    );
  const save = (e: FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORE, JSON.stringify(draft));
      setSite(draft);
      alert("Saved. Open / to view your updated portfolio.");
    } catch {
      alert("Unable to save in this browser. Check that site storage is enabled.");
    }
  };
  const editProject = (i: number, key: keyof Project, v: string) =>
    setDraft((d) => {
      const n = structuredClone(d);
      (n.projects[i] as any)[key] = v;
      return n;
    });
  const addProject = () =>
    setDraft((d) => ({
      ...d,
      projects: [
        ...d.projects,
        {
          id: crypto.randomUUID(),
          name: "New project",
          category: "Full-stack",
          year: String(new Date().getFullYear()),
          description: "Describe what you built and why.",
          github: "",
          image: "",
        },
      ],
    }));
  const moveProject = (from: number, to: number) =>
    setDraft((d) => {
      if (to < 0 || to >= d.projects.length) return d;
      const projects = [...d.projects];
      const [project] = projects.splice(from, 1);
      projects.splice(to, 0, project);
      return { ...d, projects };
    });
  const readFile = (file: File, onLoad: (value: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => onLoad(String(reader.result));
    reader.readAsDataURL(file);
  };
  const editCapability = (i: number, key: keyof Capability, value: string) =>
    setDraft((d) => {
      const n = structuredClone(d);
      (n.capabilities[i] as any)[key] = value;
      return n;
    });
  const editTool = (
    capabilityIndex: number,
    toolIndex: number,
    key: "name" | "icon",
    value: string,
  ) =>
    setDraft((d) => {
      const n = structuredClone(d);
      n.capabilities[capabilityIndex].tools[toolIndex][key] = value;
      return n;
    });
  return (
    <div className="admin">
      <aside>
        <b>{draft.name}.</b>
        <span>Content manager</span>
        <a href="#profile">Profile</a>
        <a href="#projects">Projects</a>
        <a href="#links">Links</a>
        <a href="#settings">Settings</a>
        <a href="#capabilities">Capabilities</a>
        <button
          onClick={() => {
            sessionStorage.removeItem("admin-v2");
            setOk(false);
          }}
        >
          Log out
        </button>
      </aside>
      <form onSubmit={save}>
        <header>
          <div>
            <span>Admin / editor</span>
            <h1>Make it yours.</h1>
          </div>
          <button className="save">Save changes</button>
        </header>
        <fieldset id="profile">
          <legend>Profile & homepage</legend>
          <Fields
            values={draft}
            onChange={update}
            keys={["name", "title", "statement", "bio", "location", "skills"]}
          />
        </fieldset>
        <fieldset id="links">
          <legend>Links & contact</legend>
          <Fields
            values={draft}
            onChange={update}
            keys={["email", "github", "linkedin", "leetcode", "resume"]}
          />
          <label className="file-upload">
            Upload resume PDF
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) readFile(file, (value) => update("resume", value));
              }}
            />
          </label>
          <p>Use the URL field for a hosted resume or upload a PDF for this browser.</p>
        </fieldset>
        <fieldset id="projects">
          <legend>Projects</legend>
          <p>
            Update the description and GitHub URL for each project shown on your
            public portfolio.
          </p>
          <button type="button" className="add" onClick={addProject}>
            + Add project
          </button>
          {draft.projects.map((p, i) => (
            <div className="edit-project" key={p.id}>
              <div>
                <b>Project {String(i + 1).padStart(2, "0")}</b>
                <div className="project-order">
                  <button type="button" onClick={() => moveProject(i, i - 1)} disabled={i === 0}>
                    Move up
                  </button>
                  <button type="button" onClick={() => moveProject(i, i + 1)} disabled={i === draft.projects.length - 1}>
                    Move down
                  </button>
                </div>
                {draft.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        projects: d.projects.filter((_, x) => x !== i),
                      }))
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
              {(
                ["name", "category", "year", "description", "github"] as (keyof Project)[]
              ).map((k) => (
                <label key={k}>
                  {k}
                  <textarea
                    value={p[k] || ""}
                    onChange={(e) => editProject(i, k, e.target.value)}
                  />
                </label>
              ))}
              <label className="file-upload">
                Project image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) readFile(file, (value) => editProject(i, "image", value));
                  }}
                />
              </label>
              {p.image && <img className="admin-image-preview" src={p.image} alt="Project preview" />}
            </div>
          ))}
        </fieldset>
        <fieldset id="capabilities">
          <legend>Capabilities</legend>
          <p>Edit the sections and tools shown in the public capabilities panel.</p>
          {draft.capabilities.map((capability, capabilityIndex) => (
            <div className="edit-capability" key={`${capability.number}-${capabilityIndex}`}>
              <div className="capability-edit-heading">
                <b>{capability.number}</b>
                <input
                  value={capability.name}
                  onChange={(e) => editCapability(capabilityIndex, "name", e.target.value)}
                  aria-label={`${capability.number} capability name`}
                />
              </div>
              <label>
                description
                <textarea
                  value={capability.description}
                  onChange={(e) => editCapability(capabilityIndex, "description", e.target.value)}
                />
              </label>
              <div className="capability-tool-editor">
                {capability.tools.map((tool, toolIndex) => (
                  <div className="tool-edit-row" key={`${tool.name}-${toolIndex}`}>
                    <input
                      value={tool.name}
                      onChange={(e) => editTool(capabilityIndex, toolIndex, "name", e.target.value)}
                      aria-label="Tool name"
                    />
                    <input
                      value={tool.icon}
                      onChange={(e) => editTool(capabilityIndex, toolIndex, "icon", e.target.value)}
                      aria-label="Devicon path"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          capabilities: d.capabilities.map((item, index) =>
                            index === capabilityIndex
                              ? { ...item, tools: item.tools.filter((_, i) => i !== toolIndex) }
                              : item,
                          ),
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      capabilities: d.capabilities.map((item, index) =>
                        index === capabilityIndex
                          ? { ...item, tools: [...item.tools, { name: "New tool", icon: "" }] }
                          : item,
                      ),
                    }))
                  }
                >
                  + Add tool
                </button>
              </div>
            </div>
          ))}
        </fieldset>
        <fieldset id="settings">
          <legend>Site controls</legend>
          <p>
            Add each project description and its GitHub URL here. Visitors can
            click the GitHub link to open the repository. Save changes stores
            edits in this browser; your admin password is managed from
            <code>.env</code>, never from this page.
          </p>
        </fieldset>
      </form>
    </div>
  );
}
function Fields({
  values,
  onChange,
  keys,
}: {
  values: Site;
  onChange: (k: keyof Site, v: string) => void;
  keys: (keyof Site)[];
}) {
  return (
    <div className="field-grid">
      {keys.map((k) => (
        <label key={k}>
          {k}
          <textarea
            value={values[k] as string}
            onChange={(e) => onChange(k, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}
