import { useEffect, useRef } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const children = el.querySelectorAll('[data-animate]');
    children.forEach((child, i) => {
      (child as HTMLElement).style.animationDelay = `${i * 0.15}s`;
      child.classList.add('animate-fade-up');
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden">
      {/* Background glows */}
      <div className="glow-blob w-[500px] h-[500px] bg-accent-blue top-[-10%] left-[-10%]" />
      <div className="glow-blob w-[400px] h-[400px] bg-accent-emerald bottom-[-10%] right-[-10%]" />

      <div ref={heroRef} className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div data-animate className="opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 mb-8">
            <Terminal className="w-4 h-4 text-accent-emerald" />
            <span className="text-sm text-muted-foreground font-medium">Backend Engineer • 5+ Years</span>
          </div>

          {/* Headline */}
          <h1 data-animate className="opacity-0 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            I build scalable backend{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-cyan">
              systems
            </span>{' '}
            and SaaS platforms
          </h1>

          {/* Subtext */}
          <p data-animate className="opacity-0 text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            From database architecture to cloud deployment — I design, build, and scale
            the backend infrastructure that powers real businesses.
          </p>

          {/* CTAs */}
          <div data-animate className="opacity-0 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
            >
              View Projects
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card/50 text-foreground font-semibold hover:bg-card transition-colors"
            >
              Contact Me
            </a>
          </div>

          {/* Tech strip */}
          <div data-animate className="opacity-0 flex flex-wrap gap-3 mt-16 pt-8 border-t border-border">
            {['Node.js', 'PostgreSQL', 'Laravel', 'AWS', 'Docker'].map(tech => (
              <span key={tech} className="px-3 py-1.5 rounded-md bg-card border border-border text-sm text-muted-foreground font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
