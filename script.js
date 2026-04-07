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
  per: document.getElementById("per"),
  pbr: document.getElementById("pbr"),
  bpsNote: document.getElementById("bpsNote"),
  relationNote: document.getElementById("relationNote"),
  barRoe: document.getElementById("barRoe"),
  barPer: document.getElementById("barPer"),
  barPbr: document.getElementById("barPbr"),
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

function setText(target, text) {
  if (target) target.textContent = text;
}

function update() {
  const netIncome = Number(els.netIncome.value); // 百万円
  const equity = Number(els.equity.value); // 百万円
  const shares = Number(els.shares.value); // 百万株
  const price = Number(els.price.value); // 円

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
  setText(els.per, Number.isFinite(per) ? `${fmt.format(per)}倍` : "N/A（EPSが0以下）");
  setText(els.pbr, Number.isFinite(pbr) ? `${fmt.format(pbr)}倍` : "N/A");

  setText(
    els.bpsNote,
    Number.isFinite(bps) ? `BPS（1株当たり純資産）= ${fmt.format(bps)}円` : "BPSを計算できません"
  );

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
  setText(els.fPerNum, `株価 ${yen(price)}`);
  setText(els.fPerDen, Number.isFinite(eps) ? `EPS ${yen(eps)}` : "EPS -");
  setText(els.fPbrNum, `株価 ${yen(price)}`);
  setText(els.fPbrDen, Number.isFinite(bps) ? `BPS ${yen(bps)}` : "BPS -");
  setText(els.fBpsNum, `自己資本 ${fmt.format(equity)} 百万円`);
  setText(els.fBpsDen, `発行済株式数 ${fmt.format(shares)} 百万株`);

  setBar(els.barRoe, roe, 20);
  setBar(els.barPer, per, 30);
  setBar(els.barPbr, pbr, 5);
}

function setBar(el, value, benchmark) {
  if (!Number.isFinite(value) || value < 0) {
    el.style.width = "0%";
    return;
  }
  el.style.width = `${Math.min((value / benchmark) * 100, 100)}%`;
}

[els.netIncome, els.equity, els.shares, els.price].forEach((input) => {
  input.addEventListener("input", update);
});

update();
