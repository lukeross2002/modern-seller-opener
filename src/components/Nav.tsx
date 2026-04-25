import Link from "next/link";

export default function Nav() {
  return (
    <header className="w-full">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6fa0ff] to-[#b197fc] flex items-center justify-center text-black font-black text-[15px] tracking-tight shadow-[0_0_20px_-5px_rgba(177,151,252,0.6)]">
            M<span className="-ml-[3px]">S</span>
          </div>
          <span className="font-semibold tracking-tight">Modern Seller</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[color:var(--muted)]">
          <Link href="/#how" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/#examples" className="hover:text-white transition-colors">Examples</Link>
          <Link href="/#cohort" className="hover:text-white transition-colors">The cohort</Link>
          <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
        </nav>
        <Link href="/tool" className="btn-primary text-sm">
          Try the tool <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}
