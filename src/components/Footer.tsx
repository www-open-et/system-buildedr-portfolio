export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fkadeal Matiwos. All rights reserved.
          </div>
          <div className="text-sm text-muted-foreground">
            Backend Engineer • Systems Builder • SaaS & Infrastructure
          </div>
        </div>
      </div>
    </footer>
  );
}
