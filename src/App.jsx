import React, { useMemo, useState } from 'react'

const DATA = [
  { id: 'princess-diana-bear', name: 'Princess (Diana Bear)', category: 'Bear', releaseYear: 1997, peakYear: 1998, peakPriceUSD: 5000, currentPriceUSD: 25, rarity: 'Hype Icon',
    fun: [
      "At peak, 'first edition' PVC pellets were hyped like royal treasure.",
      "Charity + scarcity narrative supercharged the bubble."
    ],
    notes: "Peak based on headline asks; realized sales were usually far lower."
  },
  { id: 'peanut-royal-blue', name: 'Peanut (Royal Blue)', category: 'Elephant', releaseYear: 1995, peakYear: 1998, peakPriceUSD: 3000, currentPriceUSD: 40, rarity: 'Color Variant',
    fun: [
      "Early darker-blue run drove FOMO; lighter reissue diluted hype."
    ],
    notes: "Variant scarcity narrative amplified perceived rarity."
  },
  { id: 'brownie-cubbie', name: 'Brownie/Cubbie', category: 'Bear', releaseYear: 1993, peakYear: 1997, peakPriceUSD: 1500, currentPriceUSD: 12, rarity: 'Name Change',
    fun: ["Renamed to Cubbie. The price also changed—down."],
    notes: "Early tag generations prized then; today niche interest."
  },
  { id: 'patti-magenta', name: 'Patti (Magenta)', category: 'Platypus', releaseYear: 1993, peakYear: 1997, peakPriceUSD: 900, currentPriceUSD: 10, rarity: 'Color Variant',
    fun: ["Once pricey enough to fund a duck’s bread budget."],
    notes: "Fuchsia vs magenta hair-splitting fueled listings."
  },
  { id: 'garcia-bear', name: 'Garcia', category: 'Bear', releaseYear: 1996, peakYear: 1998, peakPriceUSD: 1000, currentPriceUSD: 18, rarity: 'Tie-Dye',
    fun: ["No two patterns alike—great for 'unique listing' claims."],
    notes: "Perceived uniqueness fed the auction frenzy."
  },
  { id: 'nana-bongo', name: 'Nana/Bongo', category: 'Monkey', releaseYear: 1995, peakYear: 1997, peakPriceUSD: 800, currentPriceUSD: 9, rarity: 'Name Change',
    fun: ["Name changed to Bongo; prices did a downward drumroll."],
    notes: "Tag text variants obsessed collectors; market shrank later."
  },
];

const categories = ['All', ...Array.from(new Set(DATA.map(d => d.category)))];
const sorts = [
  { id: 'name', label: 'Name' },
  { id: 'drop', label: '% Drop (Peak→Now)' },
  { id: 'peak', label: 'Peak Price' },
  { id: 'current', label: 'Current Price' },
  { id: 'year', label: 'Release Year' },
];

const money = n => n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const pctDrop = (p, c) => p ? Math.max(0, Math.min(100, Math.round(((p - c) / p) * 100))) : 0;

export default function App() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('drop');
  const [dir, setDir] = useState('desc');
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(null);

  const rows = useMemo(() => {
    let r = DATA.filter(d => {
      const text = `${d.name} ${d.category} ${d.rarity}`.toLowerCase();
      const matchQ = text.includes(q.toLowerCase());
      const matchC = cat === 'All' || d.category === cat;
      return matchQ && matchC;
    });
    r.sort((a, b) => {
      const da = pctDrop(a.peakPriceUSD, a.currentPriceUSD);
      const db = pctDrop(b.peakPriceUSD, b.currentPriceUSD);
      let va, vb;
      switch (sort) {
        case 'name': va = a.name; vb = b.name; break;
        case 'drop': va = da; vb = db; break;
        case 'peak': va = a.peakPriceUSD; vb = b.peakPriceUSD; break;
        case 'current': va = a.currentPriceUSD; vb = b.currentPriceUSD; break;
        case 'year': va = a.releaseYear; vb = b.releaseYear; break;
        default: va = da; vb = db;
      }
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return r;
  }, [q, cat, sort, dir]);

  const totals = useMemo(() => {
    const peak = rows.reduce((s, d) => s + d.peakPriceUSD, 0);
    const now = rows.reduce((s, d) => s + d.currentPriceUSD, 0);
    const avg = Math.round(rows.reduce((s, d) => s + pctDrop(d.peakPriceUSD, d.currentPriceUSD), 0) / (rows.length || 1));
    return { peak, now, avg };
  }, [rows]);

  return (
    <>
      <header>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div>
            <div className="h1">Beanie Bubble Exchange</div>
            <div className="sub">An eBay-style history project on the 1990s collectible craze</div>
          </div>
        </div>
      </header>

      <main className="container" style={{paddingTop:16}}>
        <div className="card" style={{marginBottom:16}}>
          <div className="toolbar">
            <input placeholder="Search name, category, rarity…" value={q} onChange={e=>setQ(e.target.value)} />
            <select value={cat} onChange={e=>setCat(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{display:'flex',gap:8}}>
              <select value={sort} onChange={e=>setSort(e.target.value)}>
                {sorts.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <button onClick={()=>setDir(d=>d==='asc'?'desc':'asc')}>{dir.toUpperCase()}</button>
            </div>
          </div>
          <div style={{display:'flex',gap:16,marginTop:12,flexWrap:'wrap'}}>
            <div className="badge">Peak Total: {money(totals.peak)}</div>
            <div className="badge">Current Total: {money(totals.now)}</div>
            <div className="badge">Avg Drop: {totals.avg}%</div>
          </div>
        </div>

        <section className="grid">
          {rows.map(d => {
            const drop = pctDrop(d.peakPriceUSD, d.currentPriceUSD);
            return (
              <div key={d.id} className="card">
                <div className="img">IMG</div>
                <div className="row" style={{marginTop:8}}>
                  <div>
                    <div className="title">{d.name}</div>
                    <div className="muted">{d.category} • Released {d.releaseYear}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="muted">Peak</div>
                    <div className="money">{money(d.peakPriceUSD)}</div>
                  </div>
                </div>
                <div className="row" style={{marginTop:6}}>
                  <div className="muted">Now <span className="money">{money(d.currentPriceUSD)}</span></div>
                  <div className="drop">-{drop}%</div>
                </div>
                <div className="actions">
                  <button className="primary" onClick={()=>{ setSel(d); setOpen(true); }}>Open Listing</button>
                  <button onClick={()=>{ setSel(d); setOpen(true); }}>Details</button>
                </div>
              </div>
            )
          })}
        </section>

        <dialog className="dialog" open={open} onClose={()=>setOpen(false)}>
          <div className="body">
            {sel && (
              <>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
                  <div style={{fontSize:20,fontWeight:800}}>{sel.name}</div>
                  <button onClick={()=>setOpen(false)}>Close</button>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:12}}>
                  <div>
                    <div className="img">IMG</div>
                    <div className="kv">
                      <div className="box">
                        <div className="label">Release Year</div>
                        <div className="val">{sel.releaseYear}</div>
                      </div>
                      <div className="box">
                        <div className="label">Peak Year</div>
                        <div className="val">{sel.peakYear}</div>
                      </div>
                      <div className="box">
                        <div className="label">Peak Price</div>
                        <div className="val">{money(sel.peakPriceUSD)}</div>
                      </div>
                      <div className="box">
                        <div className="label">Current Price</div>
                        <div className="val">{money(sel.currentPriceUSD)}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="section">
                      <div style={{fontWeight:700, marginBottom:6}}>Price Collapse</div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,alignItems:'end'}}>
                        <div>
                          <div className="muted">Peak</div>
                          <div className="bar"><div style={{width:'100%'}}></div></div>
                          <div style={{fontWeight:700,marginTop:4}}>{money(sel.peakPriceUSD)}</div>
                        </div>
                        <div>
                          <div className="muted">Today</div>
                          <div className="bar"><div style={{width: `${Math.max(5, Math.round((sel.currentPriceUSD / Math.max(1, sel.peakPriceUSD)) * 100))}%`}}></div></div>
                          <div style={{fontWeight:700,marginTop:4}}>{money(sel.currentPriceUSD)}</div>
                        </div>
                      </div>
                      <div style={{marginTop:8}} className="muted">Drop from peak: <span className="drop">{pctDrop(sel.peakPriceUSD, sel.currentPriceUSD)}%</span></div>
                    </div>

                    <div className="section">
                      <div style={{fontWeight:700, marginBottom:6}}>Fun Facts</div>
                      <ul style={{margin:'0 0 0 18px', padding:0}}>
                        {sel.fun.map((f,i)=>(<li key={i} style={{marginBottom:6}}>{f}</li>))}
                      </ul>
                      {sel.notes && <div className="muted" style={{marginTop:6}}>Note: {sel.notes}</div>}
                    </div>

                    <div className="section">
                      <div style={{fontWeight:700, marginBottom:6}}>Historical Context</div>
                      <div className="muted">
                        Late-1990s collectible craze: scarcity narratives, media attention, and online auctions fueled momentum until supply and skepticism caught up—classic bubble behavior.
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </dialog>

        <footer>
          Student project — replace sample data with your research. No affiliation with Ty Inc. or eBay.
        </footer>
      </main>
    </>
  )
}
