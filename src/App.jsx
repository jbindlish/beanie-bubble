import React, { useMemo, useState } from 'react'

const DATA = [
  { id:'princess-diana-bear', name:'Princess (Diana Bear)', img:'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1000w,f_avif,q_auto:eco,dpr_2/rockcms/2022-08/princess-diana-purple-beanie-baby-te-220803-0b9792.jpg', category:'Bear', releaseYear:1997, peakYear:1998, peakPriceUSD:45000, currentPriceUSD:25, rarity:'Hype Icon',
    fun:["This toy was released as commemerative of Princess Diana's death. The shipments were limited - only 12 toys per store, driving up demand immensely. One of the signature Beanie Babies."],
    notes:"The peak was derived from headlines and other potential exaggerated estimates - real prices might have been lower."
  },
  { id:'peanut-royal-blue', name:'Peanut (Royal Blue)', img:'', category:'Elephant', releaseYear:1995, peakYear:1998, peakPriceUSD:3000, currentPriceUSD:40, rarity:'Color Variant',
    fun:["XXXXXXXXXXXXXX"],
    notes:"XXXXXXXXXXXXXX"
  },
  { id:'brownie-cubbie', name:'Brownie/Cubbie', img:'', category:'Bear', releaseYear:1993, peakYear:1997, peakPriceUSD:1500, currentPriceUSD:12, rarity:'Name Change',
    fun:["XXXXXXXXXXXXXX"],
    notes:"XXXXXXXXXXXXXX"
  },
  { id:'patti-magenta', name:'Patti (Magenta)', img:'', category:'Platypus', releaseYear:1993, peakYear:1997, peakPriceUSD:900, currentPriceUSD:10, rarity:'Color Variant',
    fun:["XXXXXXXXXXXXXX"],
    notes:"XXXXXXXXXXXXXX."
  },
  { id:'garcia-bear', name:'Garcia', img:'', category:'Bear', releaseYear:1996, peakYear:1998, peakPriceUSD:1000, currentPriceUSD:18, rarity:'Tie-Dye',
    fun:["XXXXXXXXXXXXXX"],
    notes:"XXXXXXXXXXXXXX"
  },
  { id:'nana-bongo', name:'Nana/Bongo', img:'', category:'Monkey', releaseYear:1995, peakYear:1997, peakPriceUSD:800, currentPriceUSD:9, rarity:'Name Change',
    fun:["XXXXXXXXXXXXXX"],
    notes:"XXXXXXXXXXXXXX"
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
const money = n => n.toLocaleString(undefined, { style:'currency', currency:'USD', maximumFractionDigits:0 });
const pctDrop = (p, c) => p ? Math.max(0, Math.min(100, Math.round(((p - c) / p) * 100))) : 0;

export default function App(){
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('drop');
  const [dir, setDir] = useState('desc');
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(null);

  // page state: 'browse' shows the listing (same UI as before),
  // other values are simple pages: 'categories', 'sell', 'my-ebay', 'learn'
  const [page, setPage] = useState('browse');

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

  // Helper to render the nav button with active state
  const NavBtn = ({ id, children }) => (
    <button
      className={`nav-btn ${id === 'browse' ? 'blue' : id === 'categories' ? 'yellow' : id === 'sell' ? 'red' : id === 'my-ebay' ? 'green' : 'nav-learn'}`}
      onClick={() => setPage(id)}
      aria-current={page === id ? 'page' : undefined}
      style={page === id ? { outline: '3px solid rgba(0,0,0,0.08)' } : {}}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* Header */}
      <div className="header">
        <div className="wrap">
          <div className="header-top">
            <div className="logo" aria-label="eBay throwback">
              <span className="e">e</span><span className="b">b</span><span className="a">a</span><span className="y">y</span>
            </div>
            <div className="slogan">The world&apos;s online marketplace — based in the late 1990s</div>
          </div>
        </div>
        <div className="nav">
          <div className="wrap nav-row">
            <NavBtn id="browse">Browse</NavBtn>
            <NavBtn id="categories">Categories</NavBtn>
            <NavBtn id="sell">Sell</NavBtn>
            <NavBtn id="my-ebay">My eBay</NavBtn>
            <div style={{flex:1}} />
            <div style={{alignSelf:'center'}}>
              <button className="nav-learn" onClick={() => setPage('learn')} style={{background:'transparent', border:'none', cursor:'pointer', color:'#222', textDecoration: page==='learn' ? 'underline' : 'none'}}>Learn</button>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap">
        {/* Page: Browse (original UI) */}
        {page === 'browse' && (
          <>
            {/* Search / Filters Panel */}
            <div className="panel">
              <div className="form-row">
                <label>Search:&nbsp;</label>
                <input className="input" placeholder="Find Beanies…" value={q} onChange={e=>setQ(e.target.value)} />
                <label>&nbsp;Category:&nbsp;</label>
                <select className="select" value={cat} onChange={e=>setCat(e.target.value)}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <label>&nbsp;Sort:&nbsp;</label>
                <select className="select" value={sort} onChange={e=>setSort(e.target.value)}>
                  {sorts.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <button className="btn" onClick={()=>setDir(d => d==='asc'?'desc':'asc')}>Order: {dir.toUpperCase()}</button>
              </div>
            </div>

            {/* Listings Table */}
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th width="180">Photo</th>
                    <th>Title / Details</th>
                    <th width="220">Price</th>
                    <th width="120">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(d => {
                    const drop = pctDrop(d.peakPriceUSD, d.currentPriceUSD);
                    return (
                      <tr key={d.id}>
                        <td>
                          {d.img
                            ? <img className="thumb" src={d.img} alt={d.name} />
                            : <div className="thumb" />}
                        </td>
                        <td>
                          <div className="item-title"><a href="#" onClick={(e)=>{e.preventDefault(); setSel(d); setOpen(true);}}>{d.name}</a>
                            <span className="badge">{d.rarity}</span>
                          </div>
                          <div className="item-meta">{d.category} • Released {d.releaseYear} • Peak year {d.peakYear}</div>
                          <div className="item-meta">
                            <a href="#" onClick={(e)=>{e.preventDefault(); setSel(d); setOpen(true);}}>View description</a>
                          </div>
                        </td>
                        <td className="price-block">
                          <div>Peak: <span className="money">{money(d.peakPriceUSD)}</span></div>
                          <div>Now: <span className="money">{money(d.currentPriceUSD)}</span> &nbsp; <span className="drop">-{drop}%</span></div>
                          <div style={{marginTop:6}}>
                            <div className="bar"><div style={{width:`${Math.max(5, Math.round((d.currentPriceUSD / Math.max(1, d.peakPriceUSD))*100))}%`}} /></div>
                          </div>
                        </td>
                        <td>
                          <div style={{display:'grid', gap:6}}>
                            <button className="btn" onClick={()=>{ setSel(d); setOpen(true); }}>Bid Now</button>
                            <button className="btn" onClick={()=>{ setSel(d); setOpen(true); }}>Details</button>
                            <a href="#" onClick={(e)=>e.preventDefault()}>Watch this item</a>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="footer">
              Jai Bindlish Real History Project — design spin off from late-90s eBay. No affiliation with Ty Inc. or eBay.
            </div>
          </>
        )}

        {/* Page: Categories */}
        {page === 'categories' && (
          <div style={{maxWidth:900, margin:'2rem auto', padding:'0 1rem'}}>
            <h1>Categories</h1>
            <p>Click a category to view items in that category.</p>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:12}}>
              {categories.map(c => (
                <button key={c} className="btn" onClick={() => { setCat(c); setPage('browse'); }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Page: Sell */}
        {page === 'sell' && (
          <div style={{maxWidth:900, margin:'2rem auto', padding:'0 1rem'}}>
            <h1>Sell</h1>
            <p>Placeholder Sell page — describe how to list an item here, or wire up a form to accept a new listing.</p>
            <div style={{marginTop:12}}>
              <button className="btn" onClick={() => alert('Sell flow not implemented in this demo')}>Start listing</button>
            </div>
          </div>
        )}

        {/* Page: My eBay */}
        {page === 'my-ebay' && (
          <div style={{maxWidth:900, margin:'2rem auto', padding:'0 1rem'}}>
            <h1>My eBay</h1>
            <p>Placeholder for My eBay — saved items, bids, and account info would appear here.</p>
          </div>
        )}

        {/* Page: Learn */}
        {page === 'learn' && (
          <article style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem", lineHeight: 1.6 }}>
            <h1>Learn</h1>
            <section>
              <p>
                This is the Learn page — paste your essay here. You can replace this paragraph
                with plain text, JSX elements, images, or formatted sections. For long essays, break into sections using headings (<code>h2</code>, <code>h3</code>) for readability.
              </p>
            </section>
          </article>
        )}
      </div>

      {/* Dialog (keeps working as before) */}
      <dialog className="dialog" open={open} onClose={()=>setOpen(false)}>
        <div className="titlebar">
          {sel ? sel.name : 'Listing'}
        </div>
        <div className="body">
          {sel && (
            <>
              <div style={{display:'grid', gridTemplateColumns:'220px 1fr', gap:12}}>
                <div>
                  {sel.img ? <img className="thumb" style={{width:'100%', height:'auto'}} src={sel.img} alt={sel.name}/> : <div className="thumb" />}
                  <div className="kv" style={{marginTop:8}}>
                    <div className="kv-row"><div className="kv-label">Category</div><div className="kv-val">{sel.category}</div></div>
                    <div className="kv-row"><div className="kv-label">Release Year</div><div className="kv-val">{sel.releaseYear}</div></div>
                    <div className="kv-row"><div className="kv-label">Peak Year</div><div className="kv-val">{sel.peakYear}</div></div>
                    <div className="kv-row"><div className="kv-label">Peak Price</div><div className="kv-val">{money(sel.peakPriceUSD)}</div></div>
                    <div className="kv-row"><div className="kv-label">Current Price</div><div className="kv-val">{money(sel.currentPriceUSD)}</div></div>
                  </div>
                </div>
                <div>
                  <div style={{fontWeight:700, marginBottom:6}}>Description</div>
                  <div style={{marginBottom:8}}>
                    Classic stuffed toy collectible from the late-1990s Beanie Baby fad. Visualize the price collapse from the 90s to now - crase of the Speculative Bubble.
                  </div>

                  <div style={{fontWeight:700, margin:'10px 0 6px'}}>Fun Facts</div>
                  <ul style={{margin:'0 0 0 18px', padding:0}}>
                    {sel.fun.map((f,i)=>(<li key={i} style={{marginBottom:6}}>{f}</li>))}
                  </ul>
                  {sel.notes && <div style={{marginTop:8, color:'#555'}}><b>Note:</b> {sel.notes}</div>}

                  <div style={{fontWeight:700, margin:'12px 0 6px'}}>Price Collapse</div>
                  <div className="bar"><div style={{width:`${Math.max(5, Math.round((sel.currentPriceUSD / Math.max(1, sel.peakPriceUSD))*100))}%`}}/></div>
                </div>
              </div>

              <div style={{marginTop:12, display:'flex', gap:8, justifyContent:'flex-end'}}>
                <button className="btn" onClick={()=>setOpen(false)}>Close</button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  )
}
