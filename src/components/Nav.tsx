import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <header className="w-full">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="brand-mark">
            <Image src="/modern-seller-logo.png" alt="" width={32} height={32} priority />
          </span>
          <span className="font-semibold tracking-tight text-[15px]">Modern Seller</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-[15px] text-[color:var(--muted-soft)]">
          <Link href="/#how" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/#examples" className="hover:text-white transition-colors">Examples</Link>
          <Link href="https://modernseller.ai#luke" className="hover:text-white transition-colors">Meet Luke</Link>
          <Link href="https://modernseller.ai#pricing" className="hover:text-white transition-colors">Tiers</Link>
          <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
        </nav>
        <Link href="/tool" className="btn-nav">
          Open the tool <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}
