import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import OpenerTool from "@/components/OpenerTool";

export const metadata = {
  title: "Opener Generator · Modern Seller",
  description: "Paste a LinkedIn URL, get 3 tailored cold-call openers in seconds — anchored in real research.",
};

export default function ToolPage() {
  return (
    <>
      <Nav />
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10 text-center">
        <div className="pill mb-6">
          <span className="dot" /> OPENER GENERATOR · FREE
        </div>
        <h1
          className="font-bold tracking-[-0.04em]"
          style={{ fontSize: "clamp(2.2rem, 5.2vw, 3.6rem)", lineHeight: 1.02 }}
        >
          Build your <span className="gradient-text">opener.</span>
        </h1>
        <p className="mt-5 text-[17px] md:text-[19px] text-[color:var(--muted-soft)] max-w-2xl mx-auto leading-[1.55]">
          Drop in your prospect&apos;s name and company. We search the live web for fresh signals.
          Three openers, each anchored in a real, dated trigger.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <OpenerTool />
      </section>

      <Footer />
    </>
  );
}
