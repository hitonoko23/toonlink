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
};

const fmt = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 2 });

function percent(value) {
  return `${fmt.format(value)}%`;
}

function yen(value) {
  return `${fmt.format(value)}円`;
}

function update() {
  const netIncome = Number(els.netIncome.value); // 百万円
  const equity = Number(els.equity.value); // 百万円
  const shares = Number(els.shares.value); // 百万株
  const price = Number(els.price.value); // 円

  els.netIncomeValue.textContent = `${fmt.format(netIncome)}`;
  els.equityValue.textContent = `${fmt.format(equity)}`;
  els.sharesValue.textContent = `${fmt.format(shares)}`;
  els.priceValue.textContent = yen(price);

  const roe = (netIncome / equity) * 100;
  const eps = shares === 0 ? NaN : netIncome / shares;
  const bps = shares === 0 ? NaN : equity / shares;
  const per = eps > 0 ? price / eps : NaN;
  const pbr = bps > 0 ? price / bps : NaN;

  els.roe.textContent = Number.isFinite(roe) ? percent(roe) : "-";
  els.eps.textContent = Number.isFinite(eps) ? yen(eps) : "-";
  els.per.textContent = Number.isFinite(per) ? `${fmt.format(per)}倍` : "N/A（EPSが0以下）";
  els.pbr.textContent = Number.isFinite(pbr) ? `${fmt.format(pbr)}倍` : "N/A";

  els.bpsNote.textContent = Number.isFinite(bps)
    ? `BPS（1株当たり純資産）= ${fmt.format(bps)}円`
    : "BPSを計算できません";

  const derivedPbr = Number.isFinite(per) ? per * (roe / 100) : NaN;
  els.relationNote.textContent = Number.isFinite(derivedPbr)
    ? `確認: PBR ≒ PER × ROE（小数）= ${fmt.format(derivedPbr)}倍`
    : "確認: EPSが0以下のため PER・PBR の連動式は表示できません";

  setBar(els.barRoe, roe, 20);
  setBar(els.barPer, per, 30);
  setBar(els.barPbr, pbr, 5);
}

function setBar(barEl, rawValue, benchmark) {
  if (!Number.isFinite(rawValue) || rawValue < 0) {
    barEl.style.width = "0%";
    return;
  }
  const width = Math.min((rawValue / benchmark) * 100, 100);
  barEl.style.width = `${width}%`;
}

[els.netIncome, els.equity, els.shares, els.price].forEach((input) => {
  input.addEventListener("input", update);
});

update();
