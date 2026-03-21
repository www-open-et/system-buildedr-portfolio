import { Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-24 lg:py-32 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-accent-blue uppercase tracking-widest mb-4">Contact</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Let's work together
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            I'm open to freelance projects, contract work, and full-time opportunities.
            If you need a backend engineer who can architect and ship production systems —
            let's talk.
          </p>

          <div className="space-y-4">
            <a
              href="mailto:fkadeal@open.et"
              className="flex items-center justify-between p-5 rounded-xl border border-border bg-card/30 hover:bg-card/60 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-accent-emerald" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="text-foreground font-medium">fkadeal@open.et</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>

            <a
              href="https://linkedin.com/in/fkadeal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-xl border border-border bg-card/30 hover:bg-card/60 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <Linkedin className="w-5 h-5 text-accent-blue" />
                <div>
                  <div className="text-sm text-muted-foreground">LinkedIn</div>
                  <div className="text-foreground font-medium">linkedin.com/in/fkadeal</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>

            <a
              href="https://github.com/fkadeal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-xl border border-border bg-card/30 hover:bg-card/60 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <Github className="w-5 h-5 text-accent-purple" />
                <div>
                  <div className="text-sm text-muted-foreground">GitHub</div>
                  <div className="text-foreground font-medium">github.com/fkadeal</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
