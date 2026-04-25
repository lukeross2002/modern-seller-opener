import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import OpenerTool from "@/components/OpenerTool";
import Link from "next/link";

export const metadata = {
  title: "Opener Generator · Modern Seller",
  description: "Paste a prospect, get 5 tailored cold-call openers in seconds.",
};

export default function ToolPage() {
  return (
    <>
      <Nav />
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10 text-center">
        <div className="pill mb-6">
          <span className="dot" /> Opener Generator · Free
        </div>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight">
          Build your <span className="gradient-text">opener.</span>
        </h1>
        <p className="mt-5 text-lg text-[color:var(--muted)] max-w-2xl mx-auto leading-relaxed">
          Drop in the prospect. We&apos;ll write 5 tailored openers in the Modern Seller voice — each with the
          tactical reason it works.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <OpenerTool />
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-10">
        <div className="card text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-60" style={{
            background: "radial-gradient(ellipse at bottom, rgba(177,151,252,0.18), transparent 65%)",
          }} />
          <div className="relative">
            <p className="eyebrow mb-2">Ready for the rest of the playbook?</p>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
              Openers are 10 seconds. <span className="gradient-text">The cohort is the other 9 minutes 50.</span>
            </h3>
            <div className="mt-6">
              <Link href="https://modernseller.ai" className="btn-primary">
                See the cohort <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
