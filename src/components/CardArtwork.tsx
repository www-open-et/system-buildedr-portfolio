import { QRCodeSVG } from "qrcode.react";

export const cardVariants = [
  { id: "founder", name: "Founder / Business", tag: "For the next big conversation.", role: "Founder & Technology Builder", line: "Digital products · Platforms · Infrastructure", statement: "Build. Ship. Grow.", audience: "Founders, investors, business owners & future partners", color: "#242722" },
  { id: "technology", name: "Technology", tag: "Depth, without the noise.", role: "Software Engineer", line: "Cloud · DevOps · Full Stack · Systems", statement: "Build reliable systems.", audience: "Engineers, CTOs & technical collaborators", color: "#e8e9e3" },
  { id: "yayehut", name: "Yayehut", tag: "A small card. A bigger mission.", role: "Local marketplace & digital commerce", line: "Helping 1,000 businesses grow by 2027.", statement: "Sell. Get discovered. Grow.", audience: "Merchants, creators & growing local businesses", color: "#d5e99e" },
  { id: "fintech", name: "Fintech / Payments", tag: "Confidence in every connection.", role: "Payment & Cloud Infrastructure", line: "Payment systems · APIs · Cloud · Infrastructure", statement: "Technology for connected", audience: "Banking leaders, payment companies & infrastructure partners", color: "#344342" },
  { id: "personal", name: "Personal / Networking", tag: "An introduction, simply made.", role: "Software Engineer · Builder", line: "", statement: "Fkadeal Matiwos", audience: "New acquaintances, conferences & everyday connections", color: "#eeeae1" },
] as const;
export type CardVariant = typeof cardVariants[number];
export type Side = "front" | "back";

export function CardArtwork({ variant, side = "front", bleed = false, monochrome = false }: { variant: CardVariant; side?: Side; bleed?: boolean; monochrome?: boolean }) {
  const yay = variant.id === "yayehut";
  const dark = (variant.id === "founder" || variant.id === "fintech") && side === "front";
  const bg = monochrome ? (dark ? "#111111" : "#ffffff") : side === "back" ? "#f7f5ee" : variant.color;
  const ink = dark ? "#f7f5ee" : "#242722";
  const muted = dark ? "#c1c6b9" : "#64685e";
  const destination = yay ? "https://fkadeal.open.et/yayehut/" : "https://fkadeal.open.et";
  const personal = variant.id === "personal";
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox={bleed ? "-30 -30 910 610" : "0 0 850 550"} width={bleed ? "91mm" : "85mm"} height={bleed ? "61mm" : "55mm"} role="img" aria-label={`${variant.name} card, ${side}`}>
    <title>{`${variant.name} — ${side}`}</title>
    <rect x="-30" y="-30" width="910" height="610" fill={bg} />
    <g fontFamily="Arial, Helvetica, sans-serif" fill={ink}>
      {side === "front" ? <>
        <text x="55" y="91" fontSize="36" fontWeight="750" letterSpacing="-1.8">{yay ? "YAYEHUT" : "FKDEAL"}<tspan fill={dark && !monochrome ? "#d5e99e" : ink}>↗</tspan></text>
        <text x="795" y="82" textAnchor="end" fill={muted} fontFamily="monospace" fontSize="12" letterSpacing="2">{yay ? "A MISSION IN MOTION" : personal ? "ALWAYS BUILDING" : "ENGINEER. BUILDER."}</text>
        {yay ? <>
          <text x="55" y="140" fontSize="20">Local marketplace &amp; digital commerce</text>
          <text x="55" y="225" fontSize="19">Helping</text>
          <text x="45" y="366" fontSize="165" fontWeight="700" letterSpacing="-12">1,000<tspan fontSize="32" letterSpacing="0" dx="20" dy="-88">↗</tspan></text>
          <text x="55" y="414" fontSize="29" letterSpacing="-.6">businesses grow by 2027.</text>
          <path d="M55 458H795" stroke={ink} strokeOpacity=".22" />
          <text x="55" y="495" fontFamily="monospace" fontSize="12" letterSpacing="1.4">LOCAL AMBITION. LASTING IMPACT.</text>
          <text x="795" y="495" textAnchor="end" fontSize="16">shop.yayehut.com</text>
        </> : personal ? <>
          <text x="47" y="340" fontSize="146" fontWeight="750" letterSpacing="-9">FKDEAL<tspan fontSize="100">↗</tspan></text>
          <text x="55" y="494" fontFamily="monospace" fontSize="13" letterSpacing="2">CURIOUS BY DEFAULT.</text>
          <text x="795" y="494" textAnchor="end" fontSize="16">fkadeal.open.et</text>
        </> : <>
          <text x="55" y="298" fontSize="49" fontWeight="600" letterSpacing="-1.7">Fkadeal Matiwos</text>
          <text x="57" y="343" fontSize="23">{variant.role}</text>
          <text x="57" y="389" fontSize="18" fill={muted}>{variant.line}</text>
          <path d="M55 450H795" stroke={ink} strokeOpacity=".22" />
          <text x="55" y="495" fontSize="16">fkadeal.open.et</text>
          <text x="795" y="495" textAnchor="end" fontSize="16">{variant.id === "founder" ? "+251 932 970 631" : variant.id === "technology" ? "LET’S BUILD SOMETHING." : "BUILT ON TRUST."}</text>
        </>}
      </> : <>
        <text x="55" y="87" fontSize="25" fontWeight="700" letterSpacing="-1">{yay ? "YAYEHUT" : "FKDEAL"}↗</text>
        <text x="55" y="194" fontSize={yay || variant.id === "fintech" ? "35" : "43"} fontWeight="600" letterSpacing="-1.5">{variant.statement}</text>
        {variant.id === "fintech" && <text x="55" y="239" fontSize="35" fontWeight="600" letterSpacing="-1">financial systems.</text>}
        {variant.id === "founder" && <><text x="55" y="268" fontSize="21">Yayehut</text><text x="55" y="296" fontSize="17" fill={muted}>Digital marketplace</text></>}
        {personal && <text x="55" y="234" fontSize="22" fill={muted}>{variant.role}</text>}
        {variant.id === "technology" && <><text x="55" y="277" fontSize="17">GitHub / github.com/fkadeal</text><text x="55" y="312" fontSize="17">LinkedIn / linkedin.com/in/fkadeal</text></>}
        {yay && <>
          <text x="55" y="265" fontSize="13" fill={muted}>EXPLORE THE MARKETPLACE</text><text x="55" y="294" fontSize="21">shop.yayehut.com</text>
          <text x="55" y="342" fontSize="13" fill={muted}>JOIN THE COMMUNITY</text><text x="55" y="371" fontSize="21">t.me/yayehut</text>
          <text x="55" y="416" fontSize="16">+251 932 970 631</text>
        </>}
        {!yay && <text x="55" y="402" fontSize="23">fkadeal.open.et <tspan fontSize="22">↗</tspan></text>}
        <g transform={`translate(${personal ? 580 : 610}, 278)`}>
          <QRCodeSVG value={destination} size={personal ? 215 : 185} level="M" marginSize={4} bgColor="#ffffff" fgColor="#161916" />
        </g>
        <path d="M55 463H550" stroke={ink} strokeOpacity=".18" />
        <text x="55" y="498" fontSize="14" fill={muted}>{yay ? "Fkadeal Matiwos · Founder" : "GOOD THINGS START WITH A CONVERSATION."}</text>
        {!personal && <text x="702" y="490" textAnchor="middle" fontSize="11" letterSpacing="1" fill={muted}>{yay ? "EXPLORE & CONNECT" : "LET’S CONNECT"}</text>}
      </>}
    </g>
  </svg>;
}
