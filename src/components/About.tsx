import { User, Code, Server } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-accent-blue uppercase tracking-widest mb-4">About</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-8">
            Engineering systems that scale
          </h2>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>
              I'm a backend engineer with over 5 years of experience designing and building
              production systems — from ERP platforms handling thousands of transactions daily
              to multi-tenant SaaS applications serving businesses across industries.
            </p>
            <p>
              My approach is rooted in systems thinking: understanding the full picture from
              database schema design to server infrastructure, then engineering solutions that
              are reliable, maintainable, and built to grow.
            </p>
            <p>
              I work primarily with <strong className="text-foreground">Node.js</strong>,{' '}
              <strong className="text-foreground">PostgreSQL</strong>,{' '}
              <strong className="text-foreground">Laravel</strong>, and{' '}
              <strong className="text-foreground">AWS</strong> — choosing the right tool for each
              problem rather than defaulting to what's trendy.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
          {[
            { icon: User, label: 'Years of Experience', value: '5+' },
            { icon: Code, label: 'Systems Delivered', value: '20+' },
            { icon: Server, label: 'Uptime Maintained', value: '99.9%' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-6 rounded-xl border border-border bg-card/50">
              <Icon className="w-5 h-5 text-accent-emerald mb-4" />
              <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
