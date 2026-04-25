import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[color:var(--muted)]">
        <div className="flex items-center gap-2.5">
          <span className="brand-mark" style={{ width: 24, height: 24, borderRadius: 6 }}>
            <Image src="/modern-seller-logo.png" alt="" width={24} height={24} />
          </span>
          <span>© {new Date().getFullYear()} Modern Seller. Built for B2B reps who refuse to wing the phones.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="https://modernseller.ai" className="hover:text-white transition-colors">modernseller.ai</Link>
          <Link href="/tool" className="hover:text-white transition-colors">Opener tool</Link>
        </div>
      </div>
    </footer>
  );
}
