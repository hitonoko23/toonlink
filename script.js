const els = {
  netIncome: document.getElementById("netIncome"),
  equity: document.getElementById("equity"),
  shares: document.getElementById("shares"),
  price: document.getElementById("price"),
  netIncomeValue: document.getElementById("netIncomeValue"),
  equityValue: document.getElementById("equityValue"),
  sharesValue: document.getElementById("sharesValue"),
  priceValue: document.getElementById("priceValue"),
  roe: document.getElementById("roe"),
  eps: document.getElementById("eps"),
  bps: document.getElementById("bps"),
  per: document.getElementById("per"),
  pbr: document.getElementById("pbr"),
  relationNote: document.getElementById("relationNote"),
  barRoe: document.getElementById("barRoe"),
  barPer: document.getElementById("barPer"),
  barPbr: document.getElementById("barPbr"),
  barBps: document.getElementById("barBps"),
  fRoeNum: document.getElementById("fRoeNum"),
  fRoeDen: document.getElementById("fRoeDen"),
  fEpsNum: document.getElementById("fEpsNum"),
  fEpsDen: document.getElementById("fEpsDen"),
  fPerNum: document.getElementById("fPerNum"),
  fPerDen: document.getElementById("fPerDen"),
  fPbrNum: document.getElementById("fPbrNum"),
  fPbrDen: document.getElementById("fPbrDen"),
  fBpsNum: document.getElementById("fBpsNum"),
  fBpsDen: document.getElementById("fBpsDen"),
};

const fmt = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 2 });
const yen = (value) => `${fmt.format(value)}円`;
const pct = (value) => `${fmt.format(value)}%`;
const setText = (target, text) => target && (target.textContent = text);

function update() {
  const netIncome = Number(els.netIncome.value);
  const equity = Number(els.equity.value);
  const shares = Number(els.shares.value);
  const price = Number(els.price.value);

  setText(els.netIncomeValue, fmt.format(netIncome));
  setText(els.equityValue, fmt.format(equity));
  setText(els.sharesValue, fmt.format(shares));
  setText(els.priceValue, yen(price));

  const roe = (netIncome / equity) * 100;
  const eps = shares > 0 ? netIncome / shares : NaN;
  const bps = shares > 0 ? equity / shares : NaN;
  const per = eps > 0 ? price / eps : NaN;
  const pbr = bps > 0 ? price / bps : NaN;

  setText(els.roe, Number.isFinite(roe) ? pct(roe) : "-");
  setText(els.eps, Number.isFinite(eps) ? yen(eps) : "-");
  setText(els.bps, Number.isFinite(bps) ? yen(bps) : "-");
  setText(els.per, Number.isFinite(per) ? `${fmt.format(per)}倍` : "N/A（EPSが0以下）");
  setText(els.pbr, Number.isFinite(pbr) ? `${fmt.format(pbr)}倍` : "N/A");

  const derivedPbr = Number.isFinite(per) ? per * (roe / 100) : NaN;
  setText(
    els.relationNote,
    Number.isFinite(derivedPbr)
      ? `確認: PBR ≒ PER × ROE（小数）= ${fmt.format(derivedPbr)}倍`
      : "確認: EPSが0以下のため PER・PBR の連動式は表示できません"
  );

  setText(els.fRoeNum, `当期純利益 ${fmt.format(netIncome)} 百万円`);
  setText(els.fRoeDen, `自己資本 ${fmt.format(equity)} 百万円`);
  setText(els.fEpsNum, `当期純利益 ${fmt.format(netIncome)} 百万円`);
  setText(els.fEpsDen, `発行済株式数 ${fmt.format(shares)} 百万株`);
  setText(els.fBpsNum, `自己資本 ${fmt.format(equity)} 百万円`);
  setText(els.fBpsDen, `発行済株式数 ${fmt.format(shares)} 百万株`);
  setText(els.fPerNum, `株価 ${yen(price)}`);
  setText(els.fPerDen, Number.isFinite(eps) ? `EPS ${yen(eps)}` : "EPS -");
  setText(els.fPbrNum, `株価 ${yen(price)}`);
  setText(els.fPbrDen, Number.isFinite(bps) ? `BPS ${yen(bps)}` : "BPS -");

  setResponsiveBar(els.barRoe, roe, 8);
  setResponsiveBar(els.barPer, per, 12);
  setResponsiveBar(els.barPbr, pbr, 1.2);
  setResponsiveBar(els.barBps, bps, 100);
}

function setResponsiveBar(el, value, pivot) {
  if (!Number.isFinite(value) || value < 0) {
    el.style.width = "0%";
    return;
  }
  const width = (value / (value + pivot)) * 100;
  el.style.width = `${Math.min(width, 100)}%`;
}

[els.netIncome, els.equity, els.shares, els.price].forEach((input) => input.addEventListener("input", update));
update();
