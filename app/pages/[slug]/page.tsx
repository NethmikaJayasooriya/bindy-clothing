import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import BrandLogo from "@/components/BrandLogo";
import { readPublicStore } from "@/lib/server/store-repository";
import { policyBlocks, resolvePolicyContact } from "@/lib/store-policies";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = (await readPublicStore()).pages.find(p => p.slug === slug);
  return page ? { title: `${page.title} | BINDY Clothing`, description: `${page.title} for BINDY Clothing. Read our store information and contact our team for assistance.` } : { robots: { index: false, follow: false } };
}

function PolicyText({ text }: { text: string }) {
  return <>{text.split(/(https:\/\/[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi).map((part, i) => {
    if (/^https:\/\//.test(part)) {
      const url = part.replace(/[.,;:!?]+$/, "");
      return <span key={i}><a href={url} target="_blank" rel="noopener noreferrer" className="underline decoration-gold/60 underline-offset-4 hover:text-[#8E6E34] break-words">{url}</a>{part.slice(url.length)}</span>;
    }
    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(part)) return <a key={i} href={`mailto:${part}`} className="underline decoration-gold/60 underline-offset-4 hover:text-[#8E6E34] break-words">{part}</a>;
    return <span key={i}>{part}</span>;
  })}</>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params, state = await readPublicStore();
  const page = state.pages.find(p => p.slug === slug);
  if (!page) notFound();
  const blocks = policyBlocks(resolvePolicyContact(page.body, state.settings));
  const updated = blocks[0]?.text.startsWith("Last updated:") ? blocks.shift()?.text : undefined;
  const sections = blocks.filter(b => b.heading);
  const related = state.pages.filter(p => ["privacy", "terms", "security", "shipping", "returns"].includes(p.slug));
  const contents = <ul className="space-y-3">{sections.map(section => <li key={section.id}><a href={`#${section.id}`} className="text-xs text-charcoal/70 hover:text-[#8E6E34] leading-5">{section.text}</a></li>)}</ul>;
  return <div className="min-h-screen bg-paper text-charcoal">
    <header className="border-b border-sand/45 bg-paper/95">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between gap-5">
        <Link href="/" aria-label="BINDY home"><BrandLogo showSubtitle={false} size="lg"/></Link>
        <Link href="/collection" className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-[0.16em] hover:text-[#8E6E34]">Back to the collection <ArrowUpRight className="w-4 h-4"/></Link>
      </div>
    </header>
    <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-20 sm:pb-28">
      <div className="border-b border-sand/60 pb-9 sm:pb-12 mb-10 sm:mb-14">
        <p className="text-[10px] font-sans uppercase tracking-[0.28em] text-[#8E6E34] mb-4">BINDY · Client care</p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light leading-tight">{page.title}</h1>
        {updated && <p className="text-xs text-charcoal/60 mt-5">{updated}</p>}
      </div>
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-8 space-y-7">
            {sections.length > 0 && <>
              <details className="lg:hidden border border-sand/60 bg-white/40 p-5 rounded-xl">
                <summary className="text-[10px] uppercase tracking-[0.18em] font-semibold cursor-pointer">On this page</summary>
                <nav aria-label="On this page" className="mt-4">{contents}</nav>
              </details>
              <nav aria-label="On this page" className="hidden lg:block border border-sand/60 bg-white/40 p-5 sm:p-6 rounded-xl">
                <p className="text-[10px] uppercase tracking-[0.18em] font-semibold mb-4">On this page</p>{contents}
              </nav>
            </>}
            <nav aria-label="Store policies" className="flex flex-wrap lg:block gap-x-4 gap-y-3 lg:space-y-3">
              {related.map(p => <Link key={p.slug} aria-current={p.slug === slug ? "page" : undefined} href={`/pages/${p.slug}`} className={`block text-xs ${p.slug === slug ? "text-[#8E6E34] font-semibold" : "text-charcoal/65 hover:text-charcoal"}`}>{p.title}</Link>)}
            </nav>
          </div>
        </aside>
        <article aria-label={page.title} className="lg:col-span-9 min-w-0 max-w-3xl">
          <div className="space-y-6 text-sm sm:text-[15px] leading-[1.95] text-charcoal/80">
            {blocks.map(block => block.heading ? <h2 key={block.id} id={block.id} className="scroll-mt-8 font-serif text-2xl sm:text-3xl font-normal text-charcoal pt-5 first:pt-0 leading-tight">{block.text}</h2> : <p key={block.id} className="whitespace-pre-line"><PolicyText text={block.text}/></p>)}
          </div>
          {page.slug === "returns" && <Link href="/returns/start" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-charcoal text-white rounded-full text-sm">Request a return or exchange <ArrowUpRight className="w-4 h-4"/></Link>}
          <div className="mt-12 pt-7 border-t border-sand/60 flex flex-col sm:flex-row gap-4 justify-between text-xs">
            <Link href="/contact" className="inline-flex items-center gap-2 text-[#8E6E34]">Questions? Contact our team <ArrowUpRight className="w-3.5 h-3.5"/></Link>
            <Link href="/" className="inline-flex items-center gap-2 text-charcoal/60"><ArrowLeft className="w-3.5 h-3.5"/>Back to BINDY</Link>
          </div>
        </article>
      </div>
    </main>
    <Footer/>
  </div>;
}
