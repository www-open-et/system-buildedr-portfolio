import { useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';

interface Project {
  title: string;
  category: string;
  problem: string;
  solution: string;
  architecture: string;
  techStack: string[];
  impact: string;
}

const projects: Project[] = [
  {
    title: 'Enterprise ERP System',
    category: 'Enterprise Software',
    problem:
      'A growing distribution company was managing inventory, billing, and user access across disconnected spreadsheets and legacy tools — leading to data loss, billing errors, and zero visibility into operations.',
    solution:
      'Built a full-featured ERP system with real-time inventory tracking, automated invoicing, role-based access control, and detailed reporting dashboards.',
    architecture:
      'Node.js REST API with Express, PostgreSQL database with complex relational schema (50+ tables), Redis for session management, background job queue for report generation. Deployed on AWS EC2 behind an Nginx reverse proxy.',
    techStack: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'AWS EC2', 'Nginx'],
    impact:
      'Reduced billing errors by 90%, cut inventory reconciliation time from 2 days to 15 minutes, and scaled to support 200+ concurrent users.',
  },
  {
    title: 'Multi-Tenant SaaS Platform',
    category: 'SaaS',
    problem:
      'A startup needed a platform to offer subscription-based services to multiple business clients, each requiring data isolation, custom configurations, and usage-based billing.',
    solution:
      'Designed and built a multi-tenant SaaS platform with tenant-aware data isolation, JWT authentication, Stripe subscription management, and an admin dashboard for platform operators.',
    architecture:
      'Laravel backend with tenant-scoped middleware, PostgreSQL with schema-per-tenant isolation, Stripe API integration for subscriptions and metered billing. Queue workers for async email and webhook processing.',
    techStack: ['Laravel', 'PostgreSQL', 'Stripe API', 'Redis', 'Docker', 'AWS'],
    impact:
      'Onboarded 50+ business tenants within 3 months, handled $200K+ in subscription revenue, and maintained 99.9% uptime.',
  },
  {
    title: 'AWS Cloud Infrastructure',
    category: 'DevOps & Cloud',
    problem:
      'An application running on a single server was experiencing downtime during traffic spikes, had no disaster recovery plan, and deployments required manual SSH access.',
    solution:
      'Architected a production-grade AWS infrastructure with auto-scaling, managed database, secure networking, and CI/CD pipeline for zero-downtime deployments.',
    architecture:
      'AWS EC2 instances in an Auto Scaling Group behind an ALB, RDS PostgreSQL with read replicas, VPC with private/public subnets, IPsec VPN for secure admin access. GitHub Actions CI/CD with blue-green deployments.',
    techStack: ['AWS EC2', 'RDS', 'VPC', 'ALB', 'GitHub Actions', 'IPsec'],
    impact:
      'Eliminated unplanned downtime, reduced deployment time from 45 minutes to 3 minutes, and cut infrastructure costs by 35% through right-sizing.',
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-card/30 hover:bg-card/60 transition-colors">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6 sm:p-8 flex items-start justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-blue mb-2 block">
            {project.category}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">{project.title}</h3>
          <p className="text-muted-foreground leading-relaxed line-clamp-2">{project.problem}</p>
        </div>
        <div className="shrink-0 mt-1 text-muted-foreground">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-6 sm:px-8 pb-8 space-y-6 border-t border-border pt-6">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Solution</h4>
            <p className="text-foreground/90 leading-relaxed">{project.solution}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Architecture</h4>
            <p className="text-foreground/90 leading-relaxed font-mono text-sm">{project.architecture}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map(tech => (
                <span key={tech} className="px-3 py-1 rounded-md bg-secondary border border-border text-sm font-mono text-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Impact</h4>
            <p className="text-accent-emerald font-medium">{project.impact}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <p className="text-sm font-semibold text-accent-blue uppercase tracking-widest mb-4">Projects</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          Real systems, real impact
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mb-12">
          A selection of production systems I've architected and built — each solving complex
          business problems at scale.
        </p>

        <div className="space-y-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
