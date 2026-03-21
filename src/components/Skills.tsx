import { Database, Server, Cloud, Code } from 'lucide-react';

interface SkillGroup {
  title: string;
  icon: React.ElementType;
  color: string;
  skills: string[];
}

const skillGroups: SkillGroup[] = [
  {
    title: 'Backend',
    icon: Code,
    color: 'text-accent-blue',
    skills: ['Node.js / Express', 'Laravel / PHP', 'REST API Design', 'Authentication & Authorization', 'Background Jobs & Queues', 'WebSockets'],
  },
  {
    title: 'Database',
    icon: Database,
    color: 'text-accent-emerald',
    skills: ['PostgreSQL', 'MySQL', 'Redis', 'Schema Design', 'Query Optimization', 'Migrations & Seeding'],
  },
  {
    title: 'DevOps & Cloud',
    icon: Cloud,
    color: 'text-accent-purple',
    skills: ['AWS (EC2, RDS, VPC)', 'Docker', 'CI/CD (GitHub Actions)', 'Nginx', 'IPsec / Networking', 'Server Scaling & Monitoring'],
  },
];

export function Skills() {
  return (
    <section id="skills" className="py-24 lg:py-32 border-t border-border">
      <div className="container mx-auto px-6">
        <p className="text-sm font-semibold text-accent-blue uppercase tracking-widest mb-4">Skills</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-12">
          Technical toolkit
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillGroups.map(({ title, icon: Icon, color, skills }) => (
            <div key={title} className="p-6 rounded-xl border border-border bg-card/30">
              <div className="flex items-center gap-3 mb-6">
                <Icon className={`w-5 h-5 ${color}`} />
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              </div>
              <ul className="space-y-3">
                {skills.map(skill => (
                  <li key={skill} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
