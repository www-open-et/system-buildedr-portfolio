import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ArrowDown, ArrowDownToLine, ArrowUpRight, Check, Layers, LayoutGrid, RotateCw, ScanLine } from "lucide-react";
import { CardArtwork, cardVariants, type Side } from "../components/CardArtwork";
import "./business-cards.css";

type View = "Studio" | "Flat artwork" | "Stack" | "In hand" | "On the desk";

export default function BusinessCards() {
  const [selected, setSelected] = useState(0);
  const [side, setSide] = useState<Side>("front");
  const [view, setView] = useState<View>("Studio");
  const [mono, setMono] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const variant = cardVariants[selected];
  function download() {
    const artwork = renderToStaticMarkup(<CardArtwork variant={variant} side={side} bleed monochrome={mono} />);
    const url = URL.createObjectURL(new Blob([`<?xml version="1.0" encoding="UTF-8"?>${artwork}`], { type: "image/svg+xml" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `FKDEAL-${variant.id}-${side}${mono ? "-mono" : ""}-91x61mm-bleed.svg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  return <div className="identity-site">
    <header className="identity-header">
      <a href="/" className="identity-logo">FKDEAL<span>↗</span></a>
      <span className="identity-header-label">THE PERSONAL IDENTITY SYSTEM</span>
      <nav aria-label="Identity navigation"><a href="#collection">The collection</a><a href="#design-notes">Design notes</a><a href="#production" className="identity-header-link">Made to be held <ArrowUpRight size={15} /></a></nav>
    </header>
    <main id="main" className="identity-main">
      <section className="identity-intro">
        <div className="identity-kicker"><span /> A REAL-WORLD INTRODUCTION <span className="identity-edition">VOL. 01 / 2026</span></div>
        <div className="identity-intro-grid"><h1>Different conversations.<br />One <span>identity.</span></h1><div><p>Engineer. Builder. Entrepreneur.<br />Five considered cards for the things I build<br className="desktop-break" /> and the people I build with.</p><a href="#collection">Meet the collection <ArrowDown size={15} /></a></div></div>
        <div className="identity-subline"><span>FKADEAL MATIWOS <span className="subline-divider">/</span> FKDEAL & YAYEHUT</span><span>SMALL FORMAT. LASTING IMPRESSION.</span></div>
      </section>
      <section id="collection" className="identity-collection" aria-label="Interactive business card collection">
        <div className="identity-tabs" role="tablist" aria-label="Card variants">{cardVariants.map((card, i) => <button key={card.id} id={`tab-${card.id}`} role="tab" aria-selected={selected === i} aria-controls="card-panel" onClick={() => { setSelected(i); setDownloaded(false); }}><span>0{i + 1}</span>{card.name}{selected === i && <span className="tab-dot" />}</button>)}</div>
        <div className="identity-workspace" id="card-panel" role="tabpanel" aria-labelledby={`tab-${variant.id}`}>
          <div className="identity-preview">
            <div className="preview-top"><span><span className="preview-dot" /> {view === "Flat artwork" ? "ARTWORK VIEW" : "MATERIAL STUDY"}</span><button aria-pressed={mono} onClick={() => setMono(!mono)}><span className="mono-swatch" /> {mono ? "Black & white" : "Original color"}</button></div>
            <div className={`card-scene scene-${view.toLowerCase().replace(/ /g, "-")}`}>
              {view === "On the desk" && <><div className="desk-notebook"><span>IDEAS INTO<br />REALITY.</span></div><div className="desk-pencil" /></>}
              {view === "In hand" && <svg className="hand-study" viewBox="0 0 600 600" aria-label="Illustrated hand for scale"><path d="M205 600 197 455Q155 398 151 340L119 220Q113 190 132 182Q151 172 161 206L185 278 188 102Q189 69 210 71Q227 72 227 102L237 250 241 76Q244 46 264 50Q283 52 282 83L285 253 297 109Q300 81 321 88Q338 91 333 126L329 286 347 181Q354 151 373 159Q390 165 380 198L368 349Q365 419 334 459L341 600Z" fill="#bd9479" stroke="#a68069" strokeWidth="2" /></svg>}
              {view === "Studio" && <div className="scene-back"><CardArtwork variant={variant} side={side === "front" ? "back" : "front"} monochrome={mono} /></div>}
              <div className="scene-primary"><CardArtwork variant={variant} side={side} monochrome={mono} /></div>
              {view === "In hand" && <span className="study-note">ILLUSTRATED SCALE STUDY</span>}
            </div>
            <div className="preview-bottom"><span>85 × 55 MM <span> / </span> {side.toUpperCase()}</span><button onClick={() => { setSide(side === "front" ? "back" : "front"); setDownloaded(false); }}><RotateCw size={14} /> Flip card</button></div>
          </div>
          <aside className="card-details"><div className="detail-number">01—05 <span>/ THE COLLECTION</span></div><div className="detail-title"><span className="identity-kicker">EDITION 0{selected + 1}</span><h2>{variant.name.replace(" / ", " & ")}</h2><p>{variant.tag}</p></div><div className="detail-rule" /><div className="detail-field"><span>THE INTRODUCTION</span><strong>{variant.id === "yayehut" ? "YAYEHUT" : "Fkadeal Matiwos"}</strong><p>{variant.role}</p></div><div className="detail-field"><span>THE RIGHT CONVERSATION</span><p>{variant.audience}</p></div><div className="detail-colors"><i style={{ background: variant.color }} /><i style={{ background: "#f7f5ee" }} /><i style={{ background: "#242722" }} /><span>{variant.id === "yayehut" ? "A little more possibility." : "Quietly confident."}</span></div><button className="download-artwork" onClick={download}>{downloaded ? <Check size={17} /> : <ArrowDownToLine size={17} />}{downloaded ? "Artwork downloaded" : `Download ${side} artwork`}<ArrowUpRight size={16} /></button><p className="download-caption" role="status">SVG · 3 mm bleed · RGB master</p></aside>
        </div>
        <div className="identity-viewbar"><span><Layers size={15} /> A CHANGE OF PERSPECTIVE</span><div role="group" aria-label="Presentation view">{(["Studio", "Flat artwork", "Stack", "In hand", "On the desk"] as View[]).map(item => <button key={item} aria-pressed={view === item} onClick={() => setView(item)}>{item === "Flat artwork" && <LayoutGrid size={13} />}{item}</button>)}</div><span className="viewbar-note">DESIGNED TO CONNECT ↗</span></div>
      </section>
      <section className="whole-system" aria-labelledby="system-heading"><div className="section-label"><span>01 / THE FAMILY</span><span>SHARED DNA. DISTINCT PURPOSE.</span></div><div className="system-heading"><h2 id="system-heading">One system.<br />Every side of the builder.</h2><p>A familiar signature, wherever the conversation goes.<br />Choose a card to explore its details.</p></div><div className="mini-collection">{cardVariants.map((card, i) => <button key={card.id} onClick={() => { setSelected(i); setView("Studio"); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }}><div><CardArtwork variant={card} /></div><span><small>0{i + 1}</small>{card.name}<ArrowUpRight size={14} /></span></button>)}</div></section>
      <section className="mission-band"><div><span className="identity-kicker">YAYEHUT / A MISSION IN MOTION</span><h2>Local businesses.<br />Bigger possibilities.</h2><p>A marketplace is only as meaningful as the businesses it helps.<br />We’re building for their next chapter.</p><a href="/yayehut/">Discover Yayehut <ArrowUpRight size={17} /></a></div><div className="mission-number"><span>HELPING</span><strong>1,000<sup>↗</sup></strong><p>businesses grow by 2027.</p><small>AN ACTIVE GOAL. A SHARED AMBITION.</small></div></section>
      <section id="design-notes" className="design-notes"><div className="section-label"><span>02 / THE DESIGN LANGUAGE</span><span>LESS, WITH INTENTION.</span></div><div className="notes-grid"><article><span className="note-index">Aa ↗</span><h3>Type does the talking.</h3><p>A strong grotesk wordmark. Open spacing. Clear, legible details. Typography creates the hierarchy, without decoration.</p><span className="note-foot">ARIAL / HELVETICA · PRINT MASTERS</span></article><article><div className="palette"><i /><i /><i /></div><h3>Grounded. With a spark.</h3><p>Ink and warm ivory form the foundation. Yayehut’s soft chartreuse adds a sense of growth. Just enough to be remembered.</p><span className="note-foot">INK #242722 · IVORY #F7F5EE · GROWTH #D5E99E</span></article><article><ScanLine size={49} strokeWidth={1} /><h3>The beginning, not the bio.</h3><p>One introduction. One useful destination. A quiet, high-contrast QR code connects the physical card to the full story.</p><span className="note-foot">REAL QR CODES · FOUR-MODULE QUIET ZONE</span></article></div></section>
      <section id="production" className="production-notes"><div><span className="identity-kicker">03 / MADE TO BE HELD</span><h2>Good on screen.<br />Better on paper.</h2><p>Substantial stock. A tactile finish. Details that hold up<br />long after the first introduction.</p></div><dl><div><dt>Format</dt><dd>85 × 55 mm · landscape</dd></div><div><dt>Stock</dt><dd>400 GSM · premium uncoated or matte</dd></div><div><dt>Production</dt><dd>3 mm bleed · 5 mm safe margin</dd></div><div><dt>Finishing</dt><dd>Square corners · optional wordmark spot UV</dd></div><div><dt>Printer handoff</dt><dd>Convert RGB masters to printer-approved CMYK;<br />outline fonts and proof QR codes at actual size.</dd></div></dl></section>
      <footer className="identity-footer"><a href="/" className="identity-logo">FKDEAL↗</a><span>BUILD TECHNOLOGY. HELP BUSINESSES GROW.</span><a href="https://fkadeal.open.et">Let’s start a conversation <ArrowUpRight size={16} /></a></footer>
    </main>
  </div>;
}

export function YayehutConnect() {
  return <div className="identity-site yayehut-connect"><main id="main"><a href="/cards/" className="identity-logo">YAYEHUT↗</a><span className="identity-kicker">LOCAL MARKETPLACE & DIGITAL COMMERCE</span><h1>Local businesses.<br />Bigger possibilities.</h1><p>Helping 1,000 businesses grow by 2027.</p><a className="connect-primary" href="https://shop.yayehut.com">Explore Marketplace <ArrowUpRight /></a><a className="connect-secondary" href="https://t.me/yayehut">Join Telegram <ArrowUpRight /></a><footer><span>Fkadeal Matiwos · Founder</span><a href="tel:+251932970631">+251 932 970 631</a></footer></main></div>;
}
