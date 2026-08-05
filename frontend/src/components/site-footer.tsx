import { Link } from "@tanstack/react-router";
import { InkUnderline } from "@/components/ink";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold">
            SCRIBE <span className="text-accent">Connect</span>
          </p>
          <InkUnderline className="mt-1 h-3 w-36" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A steady hand on an important day. Connecting candidates with verified scribes,
            transport help and community support.
          </p>
        </div>
        <nav aria-label="Product">
          <h2 className="text-sm font-semibold">Product</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/request" className="hover:text-accent">
                Request a scribe
              </Link>
            </li>
            <li>
              <Link to="/matching" className="hover:text-accent">
                Matching status
              </Link>
            </li>
            <li>
              <Link to="/verify" className="hover:text-accent">
                OTP verification
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-accent">
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Join">
          <h2 className="text-sm font-semibold">Join in</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/signup" className="hover:text-accent">
                Become a volunteer
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-accent">
                Register as a candidate
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-accent">
                Contribute or donate
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold">Support</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              Helpline: <span className="font-mono">1800 000 4321</span>
            </li>
            <li>help@scribeconnect.org</li>
            <li>Available in 12 languages</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SCRIBE Connect · Built accessibility-first · WCAG 2.2 AA
      </div>
    </footer>
  );
}