import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-line bg-subtle/40">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-[0.85rem] leading-relaxed text-ink-muted">
              Your AI homework planner. Never wonder what to work on next again.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-14 gap-y-2 sm:grid-cols-3">
            <FooterCol
              title="Product"
              links={[
                { href: "#features", label: "Features" },
                { href: "#how", label: "How it works" },
                { href: "#pricing", label: "Pricing" },
              ]}
            />
            <FooterCol
              title="Get started"
              links={[
                { href: "/app", label: "Open app" },
                { href: "/app", label: "Start free" },
              ]}
            />
            <FooterCol
              title="Company"
              links={[
                { href: "#", label: "About" },
                { href: "#", label: "Privacy" },
                { href: "#", label: "Contact" },
              ]}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-[0.8rem] text-ink-faint sm:flex-row">
          <p>© {new Date().getFullYear()} AcademiaAI. All rights reserved.</p>
          <p>Made for students who have better things to do than plan.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="mb-2.5 text-[0.78rem] font-semibold text-ink">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[0.83rem] text-ink-muted hover:text-brand-600 transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
