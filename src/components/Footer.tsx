import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[color:var(--muted)]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#6fa0ff] to-[#b197fc] flex items-center justify-center text-black font-black text-[11px]">
            M<span className="-ml-[2px]">S</span>
          </div>
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
