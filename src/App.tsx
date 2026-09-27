import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

// ─── Gold palette tokens ──────────────────────────────────────────────────────
const G = {
  gold:     '#C9A45C',
  goldDark: '#9A7428',
  goldLight:'#DDB97A',
  goldDim:  'rgba(185,145,70,0.09)',
  goldBorder:'rgba(185,145,70,0.18)',
  goldGlow: '0 4px 18px rgba(185,145,70,0.30)',
  gradBtn:  'linear-gradient(135deg, #C9A45C 0%, #DDB97A 100%)',
  gradBtnSm:'linear-gradient(135deg, #BF9445 0%, #C9A45C 100%)',
  pageBg:   '#FEFDF8',
  surface:  '#FFFFFF',
  border:   'rgba(185,145,70,0.14)',
  borderMid:'rgba(0,0,0,0.07)',
  textPri:  '#1A1410',
  textSec:  '#6B5C3E',
  textTer:  '#A89070',
}

type Screen = 'marketplace' | 'dashboard' | 'pricing'
type SpaceCard = {
  id: number; name: string; location: string; venueType: string; type: string
  price: number; sqft: number; img: string; rating: number
  available: boolean; footfall: number; matchScore: number; neighborhood: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const spaces: SpaceCard[] = [
  {
    id: 1, name: 'Lumière Beauty Studio', location: 'Bandra West, Mumbai', neighborhood: 'Bandra',
    venueType: 'Premium Salon', type: 'Entry Shelf Unit', price: 850, sqft: 24,
    img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop&auto=format',
    rating: 4.9, available: true, footfall: 420, matchScore: 94,
  },
  {
    id: 2, name: 'Aura Wellness Studio', location: 'Kala Ghoda, Mumbai', neighborhood: 'Kala Ghoda',
    venueType: 'Fitness Studio', type: 'Lobby Display Wall', price: 1200, sqft: 48,
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&auto=format',
    rating: 4.7, available: true, footfall: 380, matchScore: 87,
  },
  {
    id: 3, name: 'The Canvas Room', location: 'Fort, Mumbai', neighborhood: 'Fort',
    venueType: 'Gallery', type: 'Window Counter', price: 1400, sqft: 32,
    img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format',
    rating: 4.8, available: true, footfall: 290, matchScore: 91,
  },
  {
    id: 4, name: 'Filter Coffee Co.', location: 'Lower Parel, Mumbai', neighborhood: 'Lower Parel',
    venueType: 'Cafes', type: 'Counter Display', price: 550, sqft: 12,
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&auto=format',
    rating: 4.6, available: false, footfall: 310, matchScore: 71,
  },
  {
    id: 5, name: 'Nexus Collective', location: 'Worli, Mumbai', neighborhood: 'Worli',
    venueType: 'Co-working', type: 'Back Wall Panel', price: 980, sqft: 60,
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&auto=format',
    rating: 4.9, available: true, footfall: 350, matchScore: 88,
  },
  {
    id: 6, name: 'Koi Salon & Spa', location: 'Juhu, Mumbai', neighborhood: 'Juhu',
    venueType: 'Premium Salon', type: 'Entry Shelf Unit', price: 750, sqft: 20,
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop&auto=format',
    rating: 4.5, available: true, footfall: 260, matchScore: 65,
  },
  {
    id: 7, name: 'Syntax Café', location: 'Powai, Mumbai', neighborhood: 'Powai',
    venueType: 'Cafes', type: 'Display Wall', price: 980, sqft: 36,
    img: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&h=400&fit=crop&auto=format',
    rating: 4.8, available: true, footfall: 320, matchScore: 82,
  },
]

const venueFilterMap: Record<string, string> = {
  'Cafes': 'Cafes', 'Premium Salons': 'Premium Salon',
  'Fitness Studios': 'Fitness Studio', 'Galleries': 'Gallery', 'Co-working': 'Co-working',
}

type Booking = {
  id: number; brand: string; category: string
  venueName: string; spaceType: string
  from: string; to: string
  gross: number; commission: number; net: number
  model: string; status: string; brandRating: number | null
}

const bookings: Booking[] = [
  { id: 1, brand: 'Hana Skincare', category: 'Beauty', venueName: 'Lumière Beauty Studio', spaceType: 'Entry Shelf Unit', from: 'Oct 14', to: 'Oct 21', gross: 5950, commission: 893, net: 5057, model: 'Fixed', status: 'Pending', brandRating: null },
  { id: 2, brand: 'Maison Vélo', category: 'Activewear', venueName: 'Aura Wellness Studio', spaceType: 'Lobby Display Wall', from: 'Oct 18', to: 'Nov 1', gross: 16800, commission: 2184, net: 14616, model: 'Fixed', status: 'Pending', brandRating: null },
  { id: 3, brand: 'Aurum Jewels', category: 'Jewellery', venueName: 'The Canvas Room Gallery', spaceType: 'Window Counter', from: 'Oct 22', to: 'Oct 29', gross: 9800, commission: 1470, net: 8330, model: 'Revenue Share', status: 'Approved', brandRating: 4.7 },
  { id: 4, brand: 'Birchwood Goods', category: 'Home Décor', venueName: 'Nexus Collective', spaceType: 'Back Wall Panel', from: 'Nov 3', to: 'Nov 17', gross: 13720, commission: 2058, net: 11662, model: 'Fixed', status: 'Pending', brandRating: null },
  { id: 5, brand: 'Seedlink Labs', category: 'Wellness', venueName: 'Koi Salon & Spa', spaceType: 'Entry Shelf Unit', from: 'Nov 10', to: 'Nov 14', gross: 3750, commission: 563, net: 3187, model: 'Fixed', status: 'Approved', brandRating: 4.9 },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

function venueTypeAccent(vt: string): { bg: string; color: string } {
  const map: Record<string, { bg: string; color: string }> = {
    'Premium Salon':  { bg: 'rgba(168,85,247,0.09)',  color: '#7c3aed' },
    'Fitness Studio': { bg: 'rgba(16,185,129,0.09)',  color: '#059669' },
    'Gallery':        { bg: 'rgba(14,165,233,0.09)',  color: '#0284c7' },
    'Cafes':          { bg: 'rgba(185,145,70,0.12)',  color: '#9A7428' },
    'Co-working':     { bg: 'rgba(99,102,241,0.09)',  color: '#4338ca' },
  }
  return map[vt] ?? { bg: 'rgba(0,0,0,0.05)', color: '#666' }
}

// ─── Logo component ───────────────────────────────────────────────────────────

function Logo({ size = 44 }: { size?: number }) {
  return (
    <img
      src="/src/assets/logo-gold.png"
      alt="SpaceFragment"
      style={{
        width: size, height: size * 1.15,
        objectFit: 'contain', borderRadius: 8,
      }}
    />
  )
}

// ─── Wordmark ─────────────────────────────────────────────────────────────────

function Wordmark() {
  return (
    <span className="font-bold text-base tracking-tight" style={{ color: G.textPri }}>
      SPACE<span style={{ color: G.gold }}>FRAGMENT</span>
    </span>
  )
}

// ─── Gold star ───────────────────────────────────────────────────────────────

const GoldStar = () => <span style={{ color: G.gold }}>★</span>

// ─── Floorplan ───────────────────────────────────────────────────────────────

function Floorplan({ space }: { space: SpaceCard }) {
  const isWindow  = space.type.includes('Window')
  const isWall    = space.type.includes('Wall') || space.type.includes('Shelf') || space.type.includes('Lobby')
  const isCounter = space.type.includes('Counter') && !isWindow

  const footfallDays = [
    { d: 'M', v: 68 }, { d: 'T', v: 74 }, { d: 'W', v: 82 },
    { d: 'T', v: 91 }, { d: 'F', v: 100 }, { d: 'S', v: 88 }, { d: 'S', v: 60 },
  ]

  return (
    <div className="w-full flex flex-col items-center p-7 gap-6">
      <div className="w-full max-w-xs flex items-center justify-between">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: G.textTer }}>
          Floor Plan / {space.name}
        </p>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: G.goldDim, border: `1px solid ${G.goldBorder}`, color: G.goldDark }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          {space.matchScore}% AI Match
        </div>
      </div>

      <svg viewBox="0 0 320 260" className="w-full max-w-xs" style={{ maxHeight: 240 }}>
        <rect x="10" y="10" width="300" height="240" rx="4" fill="#FAF9F2" stroke="rgba(185,145,70,0.20)" strokeWidth="1.5" />
        <rect x="130" y="10" width="60" height="4" fill="rgba(185,145,70,0.10)" />
        <path d="M130 14 Q160 44 190 14" fill="none" stroke="rgba(185,145,70,0.15)" strokeWidth="1" strokeDasharray="3 2" />
        {[[40,80],[115,80],[40,145],[115,145]].map(([x,y],i) => (
          <rect key={i} x={x} y={y} width="55" height="35" rx="3" fill="rgba(185,145,70,0.06)" stroke="rgba(185,145,70,0.18)" strokeWidth="1" />
        ))}
        <rect x="210" y="70" width="80" height="140" rx="3" fill="rgba(185,145,70,0.04)" stroke="rgba(185,145,70,0.14)" strokeWidth="1" />
        <text x="250" y="145" textAnchor="middle" fill="rgba(185,145,70,0.40)" fontSize="8" fontFamily="JetBrains Mono">service</text>
        {[40,95].map(x => [75,140].map(y => (
          <circle key={`${x}-${y}`} cx={x+27} cy={y-8} r="5" fill="rgba(185,145,70,0.05)" stroke="rgba(185,145,70,0.14)" strokeWidth="1" />
        )))}
        {isWindow && <>
          <rect x="10" y="15" width="110" height="32" rx="2" fill="rgba(185,145,70,0.15)" stroke={G.gold} strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 6px rgba(185,145,70,0.4))` }} />
          <text x="65" y="35" textAnchor="middle" fill={G.goldDark} fontSize="8" fontFamily="JetBrains Mono" fontWeight="500">WINDOW COUNTER</text>
        </>}
        {isWall && <>
          <rect x="15" y="15" width="8" height="220" rx="2" fill="rgba(185,145,70,0.18)" stroke={G.gold} strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 6px rgba(185,145,70,0.4))` }} />
          <text x="19" y="130" fill={G.goldDark} fontSize="7" fontFamily="JetBrains Mono" fontWeight="500" transform="rotate(-90, 19, 130)">DISPLAY WALL</text>
        </>}
        {isCounter && <>
          <rect x="190" y="195" width="110" height="45" rx="2" fill="rgba(185,145,70,0.15)" stroke={G.gold} strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 6px rgba(185,145,70,0.4))` }} />
          <text x="245" y="222" textAnchor="middle" fill={G.goldDark} fontSize="8" fontFamily="JetBrains Mono" fontWeight="500">COUNTER DISPLAY</text>
        </>}
        <rect x="15" y="235" width="8" height="8" rx="1" fill={G.gold} opacity="0.7" />
        <text x="27" y="243" fill={G.textTer} fontSize="7" fontFamily="JetBrains Mono">SpaceFragment Zone</text>
      </svg>

      {/* Zone metrics */}
      <div className="w-full max-w-xs rounded-xl overflow-hidden"
        style={{ background: G.surface, border: G.goldBorder.replace('0.18', '0.16') ? `1px solid ${G.goldBorder}` : '', boxShadow: '0 2px 8px rgba(185,145,70,0.08)' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: G.border }}>
          <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: G.textTer }}>Zone Metrics</p>
        </div>
        {([
          ['Zone Type',          space.type,                                 false],
          ['Venue Category',     space.venueType,                            false],
          ['Square Footage',     `${space.sqft} sq ft`,                      false],
          ['Daily Rate',         `₹${space.price.toLocaleString('en-IN')}`,  false],
          ['Avg Daily Footfall', `${space.footfall} visitors`,               false],
          ['SF Platform Fee',    '13% on booking value',                     true],
        ] as [string,string,boolean][]).map(([k, v, dim]) => (
          <div key={k} className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${G.border}` }}>
            <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: G.textTer }}>{k}</span>
            <span className="text-sm font-semibold" style={{ color: dim ? G.textTer : G.textPri }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Footfall bars */}
      <div className="w-full max-w-xs rounded-xl p-5"
        style={{ background: G.surface, border: `1px solid ${G.goldBorder}`, boxShadow: '0 2px 8px rgba(185,145,70,0.08)' }}>
        <p className="text-[10px] font-mono uppercase tracking-wider mb-4" style={{ color: G.textTer }}>Weekly Footfall Pattern</p>
        <div className="flex items-end gap-1.5 h-14">
          {footfallDays.map(({ d, v }) => (
            <div key={d} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-sm" style={{
                height: `${v * 0.48}px`,
                background: v > 85 ? G.gradBtn : 'rgba(185,145,70,0.12)',
              }} />
              <span className="text-[9px] font-mono" style={{ color: G.textTer }}>{d}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] mt-3 font-mono" style={{ color: 'rgba(185,145,70,0.5)' }}>
          Peak: Fri – Sat · {Math.round(space.footfall * 1.18)} avg · Source: SF Footfall Index
        </p>
      </div>
    </div>
  )
}

// ─── Contract Modal ───────────────────────────────────────────────────────────

function ContractModal({ space, onClose }: { space: SpaceCard; onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [signed, setSigned] = useState(false)
  const [sigText, setSigText] = useState('')
  const [model, setModel] = useState<'fixed' | 'revshare'>('fixed')

  const steps = ['Dates & Pricing', 'Legal Agreement', 'Payment Escrow']
  const duration = 7
  const gross = space.price * duration
  const fee = model === 'fixed' ? Math.round(gross * 0.13) : 0
  const revShareNote = '4% of recorded in-store revenue'

  const panelStyle = {
    background: 'rgba(185,145,70,0.04)',
    border: `1px solid ${G.border}`,
    borderRadius: 12,
    padding: '20px',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(254,253,248,0.90)', backdropFilter: 'blur(16px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl"
        style={{ background: G.surface, border: `1px solid ${G.goldBorder}`, boxShadow: `0 24px 64px rgba(185,145,70,0.14), 0 2px 8px rgba(0,0,0,0.06)` }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: G.border }}>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: G.textTer }}>Sub-Lease Agreement · SpaceFragment</p>
            <h2 className="text-lg font-bold" style={{ color: G.textPri }}>Digital Licensing Contract</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
            style={{ background: G.goldDim, color: G.textSec }}>×</button>
        </div>

        {/* Steps */}
        <div className="px-7 py-4 border-b" style={{ borderColor: G.border }}>
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: i <= step ? G.gold : 'rgba(185,145,70,0.10)', color: i <= step ? '#fff' : G.textTer }}>{i + 1}</div>
                  <span className="text-xs" style={{ color: i <= step ? G.textPri : G.textTer }}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className="flex-1 h-px" style={{ background: i < step ? G.gold : G.border }} />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-7 py-5 space-y-4">
          {/* Parties */}
          <div style={panelStyle}>
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: G.textTer }}>Parties</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs mb-1" style={{ color: G.textSec }}>Licensor (Host)</p>
                <p className="font-semibold" style={{ color: G.textPri }}>{space.name}</p>
                <p className="text-xs" style={{ color: G.textSec }}>{space.location}</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: G.textSec }}>Licensee (Seeker)</p>
                <p className="font-semibold" style={{ color: G.textPri }}>Your Brand Pvt. Ltd.</p>
                <p className="text-xs" style={{ color: G.textSec }}>D2C Brand · GST Verified</p>
              </div>
            </div>
          </div>

          {/* Pricing model */}
          <div style={panelStyle}>
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: G.textTer }}>Pricing Model</p>
            <div className="flex gap-3">
              {([['fixed', 'Fixed-Duration Booking', '13% SF commission'], ['revshare', 'Revenue Share', '4% of in-store sales']] as const).map(([v, label, sub]) => (
                <button key={v} onClick={() => setModel(v)} className="flex-1 rounded-xl p-4 text-left transition-all"
                  style={{
                    background: model === v ? G.goldDim : 'rgba(255,255,255,0.6)',
                    border: model === v ? `1px solid ${G.gold}` : `1px solid ${G.border}`,
                  }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: model === v ? G.gold : 'rgba(185,145,70,0.3)' }}>
                      {model === v && <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.gold }} />}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: model === v ? G.goldDark : G.textPri }}>{label}</span>
                  </div>
                  <p className="text-xs pl-5" style={{ color: G.textSec }}>{sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Lease terms */}
          <div style={panelStyle}>
            <p className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: G.textTer }}>Lease Terms</p>
            {[
              ['Space Type', space.type],
              ['Venue Category', space.venueType],
              ['Usable Area', `${space.sqft} sq ft`],
              ['Duration', `${duration} days (Oct 14 – Oct 21, 2026)`],
              ['Daily License Fee', `₹${space.price.toLocaleString('en-IN')}`],
              ['Subtotal', `₹${(space.price * duration).toLocaleString('en-IN')}`],
              model === 'fixed' ? ['SF Platform Fee (13%)', `₹${fee.toLocaleString('en-IN')}`] : ['SF Facilitation Fee (4%)', revShareNote],
              ['Payment Method', 'Escrow via SpaceFragment Pay'],
              ['GST (18%)', 'Applicable on SF fee'],
              ['Insurance', 'SF Blanket Policy SFB-2026'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b last:border-0 text-sm"
                style={{ borderColor: G.border }}>
                <span className="text-xs" style={{ color: G.textSec }}>{k}</span>
                <span className="font-medium text-xs"
                  style={{ color: k.includes('Fee') ? G.goldDark : G.textPri }}>{v}</span>
              </div>
            ))}
            {model === 'fixed' && (
              <div className="flex items-center justify-between pt-3 mt-1" style={{ borderTop: `1px solid ${G.border}` }}>
                <span className="font-semibold text-xs" style={{ color: G.textPri }}>Total Payable</span>
                <span className="font-bold text-xs" style={{ color: G.gold }}>₹{(gross + fee).toLocaleString('en-IN')} + GST</span>
              </div>
            )}
          </div>

          {/* Clauses */}
          <div className="rounded-xl p-5 text-xs leading-relaxed space-y-2"
            style={{ background: 'rgba(185,145,70,0.03)', border: `1px solid ${G.border}`, color: G.textSec }}>
            <p className="font-mono uppercase tracking-widest text-[10px] mb-2" style={{ color: G.textTer }}>Standard Clauses, LVT-IN-2026</p>
            {[
              ['License Grant', 'Licensor grants Licensee a non-exclusive, revocable license to use the designated SpaceFragment Zone solely for product display during the term. No permanent fixtures or structural modifications permitted.'],
              ['Conduct', 'Licensee shall comply with all applicable health, fire, and local municipal codes and shall not impede the Host\'s primary business operations.'],
              ['Insurance', 'SpaceFragment blanket policy (SFB-2026) covers property damage up to ₹25,00,000. Personal injury liability rests with Licensee.'],
              ['Termination', 'Either party may terminate with 48-hour written notice. Escrowed funds are released per Refund Schedule (Appendix A).'],
              ['Governing Law', 'Governed by the laws of India, exclusive jurisdiction in Mumbai, Maharashtra.'],
              ['Electronic Signature', 'Legally binding under the Information Technology Act, 2000.'],
            ].map(([title, body], i) => (
              <p key={i}>{i+1}. <strong style={{ color: G.textSec }}>{title}.</strong> {body}</p>
            ))}
          </div>

          {/* Signature */}
          <div className="rounded-xl p-5 space-y-3"
            style={{ border: `1px solid ${G.goldBorder}`, background: G.goldDim }}>
            <p className="text-xs font-mono tracking-widest uppercase" style={{ color: G.goldDark }}>Digital Signature</p>
            <input type="text" placeholder="Type your full legal name to sign"
              value={sigText} onChange={e => setSigText(e.target.value)}
              className="w-full bg-transparent border-b py-2 focus:outline-none"
              style={{ borderColor: sigText ? G.gold : G.border, fontFamily: 'cursive', fontSize: 18, color: G.textPri }} />
            <p className="text-xs" style={{ color: G.textTer }}>Legally binding under the IT Act, 2000.</p>
          </div>
        </div>

        <div className="px-7 py-5 border-t flex items-center justify-between" style={{ borderColor: G.border }}>
          <button onClick={() => setStep(s => Math.min(s + 1, 2))}
            className="text-sm" style={{ color: G.textSec }}>
            {step < 2 ? 'Next Step →' : ''}
          </button>
          <button disabled={!sigText || signed} onClick={() => sigText && setSigned(true)}
            className="px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: signed ? G.goldDim : G.gradBtn,
              color: signed ? G.goldDark : '#fff',
              boxShadow: sigText && !signed ? G.goldGlow : 'none',
            }}>
            {signed ? '✓ Lease Executed' : 'Sign & Execute Lease'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Marketplace ──────────────────────────────────────────────────────────────

function Marketplace({ onOpenContract }: { onOpenContract: (s: SpaceCard) => void }) {
  const [selected, setSelected] = useState<SpaceCard>(spaces[0])
  const [filter, setFilter] = useState('All Venues')

  const venueFilters = ['All Venues', 'Cafes', 'Premium Salons', 'Fitness Studios', 'Galleries', 'Co-working']
  const filtered = filter === 'All Venues' ? spaces : spaces.filter(s => s.venueType === venueFilterMap[filter])

  return (
    <div className="flex flex-col h-screen" style={{ background: G.pageBg }}>
      {/* Nav */}
      <header className="px-6 py-4 flex items-center gap-4 z-10 border-b"
        style={{ background: G.surface, borderColor: G.border, boxShadow: `0 1px 8px rgba(185,145,70,0.08)` }}>
        <div className="flex items-center gap-2.5 mr-4">
          <Logo size={44} />
          <Wordmark />
        </div>
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1 max-w-2xl flex items-center gap-2 rounded-xl px-4 py-2.5"
            style={{ background: G.pageBg, border: `1px solid ${G.border}` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G.textTer} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input className="flex-1 bg-transparent text-sm focus:outline-none" style={{ color: G.textPri }} placeholder="Mumbai, MH" />
            <div className="w-px h-4" style={{ background: G.border }} />
            <input className="bg-transparent text-sm focus:outline-none w-28" style={{ color: G.textPri }} placeholder="Oct 14 to Oct 21" />
            <div className="w-px h-4" style={{ background: G.border }} />
            <select className="bg-transparent text-sm focus:outline-none cursor-pointer" style={{ color: G.textSec }}>
              <option>All Types</option><option>Window Counter</option><option>Display Wall</option>
            </select>
          </div>
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: G.gradBtn, color: '#fff', boxShadow: G.goldGlow }}>Search</button>
        </div>
        <div className="flex items-center gap-3 ml-2">
          <button className="text-xs" style={{ color: G.textSec }}>Host a Space</button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
            style={{ background: G.goldDim, border: `1px solid ${G.goldBorder}`, color: G.goldDark }}>YB</div>
        </div>
      </header>

      {/* Stats bar */}
      <div className="px-6 py-2.5 flex items-center gap-6 border-b" style={{ background: 'rgba(185,145,70,0.05)', borderColor: G.border }}>
        {[
          { label: '500+', sub: 'Host Venues' }, { label: '2,000+', sub: 'Active Brands' },
          { label: '8', sub: 'Mumbai Hubs' }, { label: '81%', sub: 'Host Sub-Lease Intent' },
          { label: '87%', sub: 'Consumer Pop-up Intent' },
        ].map(({ label, sub }) => (
          <div key={sub} className="flex items-center gap-1.5">
            <span className="text-xs font-bold" style={{ color: G.gold }}>{label}</span>
            <span className="text-xs" style={{ color: G.textTer }}>{sub}</span>
            <div className="w-px h-3 ml-4" style={{ background: G.border }} />
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: G.goldDim, border: `1px solid ${G.goldBorder}` }}>
          <GoldStar />
          <span className="text-xs" style={{ color: G.textSec }}>Unlock AI match scores: </span>
          <span className="text-xs font-semibold" style={{ color: G.goldDark }}>Brand Pro ₹999/mo →</span>
        </div>
      </div>

      {/* Filter pills */}
      <div className="px-6 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide border-b"
        style={{ background: G.surface, borderColor: G.border }}>
        {venueFilters.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: filter === t ? G.goldDim : 'rgba(185,145,70,0.04)',
              border: filter === t ? `1px solid ${G.gold}` : `1px solid ${G.border}`,
              color: filter === t ? G.goldDark : G.textSec,
            }}>{t}</button>
        ))}
        <div className="ml-auto text-xs whitespace-nowrap" style={{ color: G.textTer }}>{filtered.length} venues · Mumbai</div>
      </div>

      {/* Split view */}
      <div className="flex flex-1 overflow-hidden">
        {/* Card grid */}
        <div className="w-[52%] overflow-y-auto scrollbar-hide p-5">
          <div className="grid grid-cols-2 gap-4">
            {filtered.map(space => {
              const accent = venueTypeAccent(space.venueType)
              const isSel = selected.id === space.id
              return (
                <div key={space.id} onClick={() => setSelected(space)}
                  className="card-hover rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    background: G.surface,
                    border: isSel ? `1.5px solid ${G.gold}` : `1px solid ${G.border}`,
                    boxShadow: isSel ? `0 4px 20px rgba(185,145,70,0.18)` : '0 1px 4px rgba(185,145,70,0.06)',
                  }}>
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden" style={{ background: '#F0ECD8' }}>
                    <img src={space.img} alt={space.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(26,20,16,0.32) 100%)' }} />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                      style={{ background: space.available ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', backdropFilter: 'blur(4px)' }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: space.available ? '#059669' : '#ef4444' }} />
                      <span style={{ color: space.available ? '#059669' : '#ef4444' }}>{space.available ? 'Available' : 'Booked'}</span>
                    </div>
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(185,145,70,0.85)', color: '#fff' }}>
                      {space.matchScore}% match
                    </div>
                    {isSel && (
                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: G.gold, color: '#fff' }}>Selected</div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-semibold text-sm leading-tight truncate" style={{ color: G.textPri }}>{space.name}</h3>
                        <p className="text-xs mt-0.5 truncate" style={{ color: G.textTer }}>{space.location}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold" style={{ color: G.gold }}>₹{space.price.toLocaleString('en-IN')}</p>
                        <p className="text-xs" style={{ color: G.textTer }}>per day</p>
                      </div>
                    </div>
                    <div className="mb-2.5">
                      <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: accent.bg, color: accent.color }}>{space.venueType}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t" style={{ borderColor: G.border }}>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: G.goldDim, color: G.textSec }}>{space.type}</span>
                      <div className="flex items-center gap-1 text-xs" style={{ color: G.textSec }}>
                        <GoldStar /><span style={{ color: G.textPri }}>{space.rating}</span>
                        <span style={{ color: G.border }}>·</span>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={G.textTer} strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                        <span>{space.footfall}/day</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Floorplan panel */}
        <div className="w-[48%] border-l flex flex-col overflow-hidden" style={{ background: 'rgba(185,145,70,0.03)', borderColor: G.border }}>
          <div className="flex items-center justify-between px-6 py-4 border-b"
            style={{ background: G.surface, borderColor: G.border }}>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="font-bold" style={{ color: G.textPri }}>{selected.name}</h2>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: venueTypeAccent(selected.venueType).bg, color: venueTypeAccent(selected.venueType).color }}>
                  {selected.venueType}
                </span>
              </div>
              <p className="text-xs" style={{ color: G.textTer }}>{selected.location}</p>
            </div>
            <button onClick={() => onOpenContract(selected)} disabled={!selected.available}
              className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-30"
              style={{ background: G.gradBtn, color: '#fff', boxShadow: selected.available ? G.goldGlow : 'none' }}>
              {selected.available ? 'Lease This Space →' : 'Space Unavailable'}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <Floorplan space={selected} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  const [hostBoost, setHostBoost] = useState<string | null>(null)
  const [brandPlan, setBrandPlan] = useState<string | null>(null)

  const card = (highlight?: boolean) => ({
    background: highlight ? 'rgba(185,145,70,0.05)' : G.surface,
    border: highlight ? `1.5px solid ${G.gold}` : `1px solid ${G.border}`,
    boxShadow: highlight ? `0 4px 20px rgba(185,145,70,0.12)` : '0 1px 6px rgba(185,145,70,0.06)',
    borderRadius: 16, padding: '24px',
  })

  return (
    <div className="min-h-screen p-8 pb-24" style={{ background: G.pageBg }}>
      <div className="flex items-center gap-3 mb-10">
        <Logo size={44} /><Wordmark />
        <span className="mx-2" style={{ color: G.border }}>·</span>
        <span className="text-sm" style={{ color: G.textSec }}>Transparent Pricing</span>
      </div>

      <div className="max-w-4xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-2" style={{ color: G.textPri }}>Simple, Transparent Fees</h1>
        <p className="text-sm max-w-lg" style={{ color: G.textSec }}>SpaceFragment charges no hidden costs. We earn only when you earn — a single platform fee on successful bookings, with no lock-in.</p>

        <div className="grid grid-cols-3 gap-5 mt-8">
          {[
            { label: 'Fixed Booking Commission', value: '12–15%', sub: 'On total booking value. Charged to the Seeker (brand). Default model for all listings.', icon: '📋' },
            { label: 'Revenue Share Facilitation', value: '3–5%', sub: 'Alternative to fixed fee. 4% of recorded in-store sales, settled via SF Pay at month-end.', icon: '📈' },
            { label: 'Legal Add-on', value: '₹1,499', sub: 'Optional lawyer-reviewed custom clauses to the standard LVT-IN-2026 template.', icon: '⚖️' },
          ].map(({ label, value, sub, icon }) => (
            <div key={label} style={card()}>
              <div className="text-2xl mb-3">{icon}</div>
              <p className="text-xs uppercase tracking-wider font-mono mb-2" style={{ color: G.textTer }}>{label}</p>
              <p className="text-3xl font-bold mb-2" style={{ color: G.gold }}>{value}</p>
              <p className="text-xs leading-relaxed" style={{ color: G.textSec }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-10" style={{ ...card(), padding: '28px' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: G.textTer }}>Platform Break-Even Tracker</p>
            <h3 className="font-bold text-lg" style={{ color: G.textPri }}>Break-even at 300 Leases / Month</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: G.gold }}>218</p>
            <p className="text-xs" style={{ color: G.textSec }}>leases this month</p>
          </div>
        </div>
        <div className="h-3 rounded-full mb-2" style={{ background: 'rgba(185,145,70,0.10)' }}>
          <div className="h-full rounded-full" style={{ width: '72.7%', background: G.gradBtn }} />
        </div>
        <div className="flex justify-between text-xs font-mono" style={{ color: G.textSec }}>
          <span>0</span><span style={{ color: G.gold }}>218 / 300 · 72.7%</span><span>300 (break-even)</span>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5" style={{ borderTop: `1px solid ${G.border}` }}>
          {[
            { label: 'Fixed Costs', value: '₹1,95,000', sub: 'Salaries + Legal Retainers' },
            { label: 'Avg Revenue/Lease', value: '₹650', sub: 'Blended platform take' },
            { label: 'Net at 300 Leases', value: '₹50,000', sub: 'Monthly operating profit' },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: G.textTer }}>{label}</p>
              <p className="text-lg font-bold" style={{ color: G.textPri }}>{value}</p>
              <p className="text-xs" style={{ color: G.textSec }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8">
        {/* Brand plans */}
        <div>
          <h2 className="font-bold text-lg mb-1" style={{ color: G.textPri }}>Brand Seeker Plans</h2>
          <p className="text-xs mb-5" style={{ color: G.textSec }}>Analytics, priority matching, and featured discovery.</p>
          <div className="space-y-4">
            {[
              { name: 'Starter', price: '₹999', period: '/month', features: ['Up to 3 active bookings', 'AI match score access', 'Basic footfall analytics', 'Email support'], cta: 'Get Starter' },
              { name: 'Growth', price: '₹1,999', period: '/month', features: ['Unlimited bookings', 'Priority in search results', 'Advanced footfall + demographics', 'Revenue dashboard', 'Dedicated onboarding call', 'Legal add-ons at 50% off'], cta: 'Get Growth', highlight: true },
            ].map(({ name, price, period, features, cta, highlight }) => (
              <div key={name} style={card(highlight)}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {highlight && <span className="text-xs px-2 py-0.5 rounded-full font-semibold mb-2 inline-block" style={{ background: G.gold, color: '#fff' }}>Most Popular</span>}
                    <p className="font-bold" style={{ color: G.textPri }}>{name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold" style={{ color: highlight ? G.gold : G.textPri }}>{price}</span>
                    <span className="text-xs" style={{ color: G.textTer }}>{period}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-5">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs" style={{ color: G.textSec }}>
                      <span style={{ color: G.gold }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setBrandPlan(name)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: brandPlan === name ? G.goldDim : highlight ? G.gradBtn : 'rgba(185,145,70,0.08)',
                    color: brandPlan === name ? G.goldDark : highlight ? '#fff' : G.textSec,
                  }}>{brandPlan === name ? '✓ Selected' : cta}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Host boosts */}
        <div>
          <h2 className="font-bold text-lg mb-1" style={{ color: G.textPri }}>Host Listing Boosts</h2>
          <p className="text-xs mb-5" style={{ color: G.textSec }}>Featured placement to fill dead zones faster.</p>
          <div className="space-y-4">
            {[
              { name: 'Spotlight', price: '₹499', period: '/week', features: ['Featured badge on listing', 'Top of neighbourhood results', '3× more profile views (avg)', 'Performance report'], cta: 'Boost for ₹499' },
              { name: 'Premium Spotlight', price: '₹1,499', period: '/week', features: ['Everything in Spotlight', 'Homepage carousel placement', 'Instagram story feature (SF page)', 'Direct brand matching emails', 'Priority booking notifications'], cta: 'Boost for ₹1,499', highlight: true },
            ].map(({ name, price, period, features, cta, highlight }) => (
              <div key={name} style={card(highlight)}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {highlight && <span className="text-xs px-2 py-0.5 rounded-full font-semibold mb-2 inline-block" style={{ background: G.gold, color: '#fff' }}>Best Value</span>}
                    <p className="font-bold" style={{ color: G.textPri }}>{name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold" style={{ color: highlight ? G.gold : G.textPri }}>{price}</span>
                    <span className="text-xs" style={{ color: G.textTer }}>{period}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-5">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs" style={{ color: G.textSec }}>
                      <span style={{ color: G.gold }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setHostBoost(name)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: hostBoost === name ? G.goldDim : highlight ? G.gradBtn : 'rgba(185,145,70,0.08)',
                    color: hostBoost === name ? G.goldDark : highlight ? '#fff' : G.textSec,
                  }}>{hostBoost === name ? '✓ Selected' : cta}</button>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl p-5 space-y-3" style={{ background: G.surface, border: `1px solid ${G.border}` }}>
            <p className="text-xs font-mono uppercase tracking-wider" style={{ color: G.textTer }}>Primary Survey, Mumbai, Sep 2026</p>
            {[
              { stat: '81%', label: 'of venue owners willing to sub-lease unused corners' },
              { stat: '87%', label: 'of consumers have purchased from a temporary pop-up' },
            ].map(({ stat, label }) => (
              <div key={stat} className="flex items-center gap-3">
                <span className="text-lg font-bold" style={{ color: G.gold }}>{stat}</span>
                <span className="text-xs" style={{ color: G.textSec }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* P&L */}
      <div className="max-w-4xl mx-auto mt-10" style={{ ...card(), padding: '28px' }}>
        <p className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: G.textTer }}>Monthly P&L Projection · 100 Active Hosts Target</p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm font-semibold mb-4" style={{ color: G.textSec }}>Revenue Breakdown: ₹3,25,000</p>
            {[
              { label: 'Booking Commissions', value: 2_25_000, pct: 69 },
              { label: 'Subscriptions & Boosts', value: 75_000, pct: 23 },
              { label: 'Legal Add-ons', value: 25_000, pct: 8 },
            ].map(({ label, value, pct }) => (
              <div key={label} className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: G.textSec }}>{label}</span>
                  <span style={{ color: G.textPri }}>₹{value.toLocaleString('en-IN')} <span style={{ color: G.textTer }}>({pct}%)</span></span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(185,145,70,0.10)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: G.gradBtn }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold mb-4" style={{ color: G.textSec }}>Expense Breakdown: ₹2,75,000</p>
            {[
              { label: 'Salaries', value: 1_20_000, pct: 44 },
              { label: 'Marketing & Onboarding', value: 80_000, pct: 29 },
              { label: 'Tech & Hosting', value: 40_000, pct: 15 },
              { label: 'Legal Retainers', value: 35_000, pct: 13 },
            ].map(({ label, value, pct }) => (
              <div key={label} className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: G.textSec }}>{label}</span>
                  <span style={{ color: G.textPri }}>₹{value.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(185,145,70,0.10)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'rgba(185,145,70,0.30)' }} />
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${G.border}` }}>
              <span className="text-sm font-bold" style={{ color: G.textPri }}>Net Operating Profit</span>
              <span className="text-lg font-bold" style={{ color: '#059669' }}>₹50,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const [navActive, setNavActive] = useState('Overview')
  const [bookingState, setBookingState] = useState(bookings.map(b => b.status))
  const [brandRatings, setBrandRatings] = useState(bookings.map(b => b.brandRating))
  const [boostActive, setBoostActive] = useState(false)

  const navItems = ['Overview', 'Space Inventory', 'Booking Requests', 'Revenue']
  const navIcons: Record<string, JSX.Element> = {
    'Overview':         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    'Space Inventory':  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
    'Booking Requests': <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    'Revenue':          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  }

  const totalGross      = bookings.reduce((a, b) => a + b.gross, 0)
  const totalCommission = bookings.reduce((a, b) => a + b.commission, 0)
  const totalNet        = bookings.reduce((a, b) => a + b.net, 0)

  return (
    <div className="flex h-screen" style={{ background: G.pageBg }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r"
        style={{ background: G.surface, borderColor: G.border }}>
        <div className="p-5 pb-4 border-b" style={{ borderColor: G.border }}>
          <div className="flex items-center gap-2.5">
            <Logo size={40} />
            <div>
              <Wordmark />
              <p className="text-xs mt-0.5" style={{ color: G.textTer }}>Host Portal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(label => (
            <button key={label} onClick={() => setNavActive(label)}
              className={`nav-link w-full text-left ${navActive === label ? 'active' : ''}`}>
              <span className="w-4 text-center">{navIcons[label]}</span>{label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: G.border }}>
          <div className="rounded-xl p-4 space-y-2" style={{ background: G.goldDim, border: `1px solid ${G.goldBorder}` }}>
            <p className="text-xs font-bold" style={{ color: G.goldDark }}>⚡ Boost Listings</p>
            <p className="text-xs leading-relaxed" style={{ color: G.textSec }}>Featured placement from ₹499/wk. 3× more views.</p>
            <button onClick={() => setBoostActive(true)}
              className="w-full text-xs py-1.5 rounded-lg font-semibold"
              style={{
                background: boostActive ? 'rgba(16,185,129,0.12)' : G.gradBtn,
                color: boostActive ? '#059669' : '#fff',
              }}>{boostActive ? '✓ Active: Premium Spotlight' : 'Activate Boost →'}</button>
          </div>
        </div>
        <div className="p-4 border-t" style={{ borderColor: G.border }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: G.goldDim, border: `1px solid ${G.goldBorder}`, color: G.goldDark }}>MK</div>
            <div>
              <p className="text-sm font-semibold" style={{ color: G.textPri }}>Meera Kulkarni</p>
              <p className="text-xs" style={{ color: G.textTer }}>Host · Verified ✓</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto scrollbar-hide p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: G.textPri }}>Host Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: G.textSec }}>Thursday, 24 September 2026</p>
          </div>
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: G.gradBtn, color: '#fff', boxShadow: G.goldGlow }}>+ Add Space</button>
        </div>

        {/* KPI widgets */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          {[
            { label: 'Total Secondary Revenue', value: fmt(totalNet), sub: '+18.4% this quarter', positive: true,
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
            { label: 'Active Micro-Leases', value: '7', sub: '2 expiring this week', positive: false,
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
            { label: 'Upcoming Pop-ups', value: '3', sub: 'Next: Oct 14, Hana Skincare', positive: true,
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          ].map(({ label, value, sub, positive, icon }) => (
            <div key={label} className="rounded-2xl p-7 space-y-4"
              style={{ background: G.surface, border: `1px solid ${G.border}`, boxShadow: '0 2px 10px rgba(185,145,70,0.08)' }}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider leading-snug" style={{ color: G.textSec }}>{label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: G.goldDim }}>{icon}</div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight" style={{ color: G.textPri }}>{value}</p>
                <p className="text-xs mt-1.5" style={{ color: positive ? '#059669' : '#d97706' }}>{sub}</p>
              </div>
              <svg viewBox="0 0 120 30" className="w-full h-6" style={{ opacity: 0.5 }}>
                <polyline points="0,25 20,18 40,22 60,10 80,14 100,8 120,5" fill="none" stroke={G.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>

        {/* P&L strip */}
        <div className="rounded-2xl p-5 mb-6 flex items-center gap-6"
          style={{ background: G.surface, border: `1px solid ${G.border}`, boxShadow: '0 1px 6px rgba(185,145,70,0.06)' }}>
          <p className="text-xs font-mono uppercase tracking-wider flex-shrink-0" style={{ color: G.textTer }}>This Month P&L</p>
          {[
            { label: 'Gross Bookings',         value: fmt(totalGross),             color: G.textPri },
            { label: 'SF Commission (13%)',     value: `− ${fmt(totalCommission)}`, color: '#b45309' },
            { label: 'Your Net Revenue',        value: fmt(totalNet),               color: '#059669' },
            { label: 'SF Break-even Progress',  value: '218 / 300 leases',          color: G.gold },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex-1 pl-5 first:pl-0" style={{ borderLeft: `1px solid ${G.border}` }}>
              <p className="text-xs mb-1" style={{ color: G.textSec }}>{label}</p>
              <p className="font-bold text-sm" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Bookings table */}
        <div className="rounded-2xl overflow-hidden mb-5"
          style={{ background: G.surface, border: `1px solid ${G.border}`, boxShadow: '0 2px 10px rgba(185,145,70,0.08)' }}>
          <div className="px-7 py-5 border-b flex items-center justify-between" style={{ borderColor: G.border }}>
            <div>
              <h2 className="font-bold text-base" style={{ color: G.textPri }}>Incoming Booking Requests</h2>
              <p className="text-xs mt-1" style={{ color: G.textSec }}>Approve applications and rate brand conduct after completion</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: G.goldDim, color: G.goldDark }}>
              {bookingState.filter(s => s === 'Pending').length} Pending
            </span>
          </div>

          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(185,145,70,0.04)' }}>
                {['Brand & Category', 'Venue / Space Type', 'Dates', 'Model', 'Net to You', 'Rating', 'Action'].map(h => (
                  <th key={h} className="text-left px-6 py-3.5 text-[11px] font-semibold uppercase tracking-widest"
                    style={{ color: G.textTer }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id} className="transition-colors" style={{ borderTop: `1px solid ${G.border}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(185,145,70,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: G.goldDim, border: `1px solid ${G.goldBorder}`, color: G.goldDark }}>
                        {b.brand.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: G.textPri }}>{b.brand}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: G.textTer }}>{b.category}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-medium leading-tight" style={{ color: G.textPri }}>{b.venueName}</p>
                    <p className="text-[11px] mt-0.5 font-mono" style={{ color: G.textTer }}>{b.spaceType}</p>
                  </td>

                  <td className="px-6 py-4 text-xs font-mono whitespace-nowrap" style={{ color: G.textSec }}>
                    {b.from}<span style={{ color: G.border, margin: '0 4px' }}>→</span>{b.to}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{
                      background: b.model === 'Revenue Share' ? 'rgba(99,102,241,0.09)' : G.goldDim,
                      color: b.model === 'Revenue Share' ? '#4338ca' : G.textSec,
                    }}>{b.model}</span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-bold" style={{ color: G.gold }}>₹{b.net.toLocaleString('en-IN')}</p>
                  </td>

                  <td className="px-6 py-4">
                    {brandRatings[i] !== null ? (
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className="text-sm" style={{ color: s <= Math.round(brandRatings[i]!) ? G.gold : 'rgba(185,145,70,0.18)' }}>★</span>
                        ))}
                        <span className="text-xs ml-1.5" style={{ color: G.textTer }}>{brandRatings[i]}</span>
                      </div>
                    ) : bookingState[i] === 'Approved' ? (
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <button key={s}
                            onClick={() => setBrandRatings(prev => prev.map((r, j) => j === i ? s : r))}
                            className="text-sm transition-colors"
                            style={{ color: 'rgba(185,145,70,0.20)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = G.gold)}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(185,145,70,0.20)')}>★</button>
                        ))}
                      </div>
                    ) : <span className="text-xs font-mono" style={{ color: 'rgba(185,145,70,0.30)' }}>—</span>}
                  </td>

                  <td className="px-6 py-4">
                    {bookingState[i] === 'Approved' ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#059669' }} />
                        <span className="text-xs font-semibold" style={{ color: '#059669' }}>Approved</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setBookingState(prev => prev.map((s, j) => j === i ? 'Approved' : s))}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold"
                          style={{ background: G.gradBtn, color: '#fff', boxShadow: '0 2px 8px rgba(185,145,70,0.25)' }}>
                          Approve
                        </button>
                        <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={{ border: `1px solid ${G.border}`, color: G.textSec }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.40)'; e.currentTarget.style.color = '#dc2626' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.color = G.textSec }}>
                          Decline
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-2xl p-7" style={{ background: G.surface, border: `1px solid ${G.border}`, boxShadow: '0 2px 10px rgba(185,145,70,0.08)' }}>
            <h3 className="font-semibold text-sm mb-5" style={{ color: G.textPri }}>Space Utilization</h3>
            <div className="space-y-4">
              {[
                { name: 'Entry Shelf Unit · Lumière Beauty', pct: 86 },
                { name: 'Lobby Display Wall · Aura Wellness', pct: 72 },
                { name: 'Window Counter · The Canvas Room', pct: 58 },
              ].map(({ name, pct }) => (
                <div key={name}>
                  <div className="flex justify-between text-xs mb-2" style={{ color: G.textSec }}>
                    <span>{name}</span><span className="font-mono" style={{ color: G.textPri }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(185,145,70,0.10)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: G.gradBtn }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-7" style={{ background: G.surface, border: `1px solid ${G.border}`, boxShadow: '0 2px 10px rgba(185,145,70,0.08)' }}>
            <h3 className="font-semibold text-sm mb-5" style={{ color: G.textPri }}>Recent Activity</h3>
            <div className="space-y-3.5">
              {[
                { text: 'Aurum Jewels lease approved, Canvas Room', time: '1h ago', type: 'approve' },
                { text: 'New booking: Maison Vélo → Aura Wellness Studio', time: '4h ago', type: 'request' },
                { text: 'Payment received, Seedlink Labs (rev-share)', time: '1d ago', type: 'payment' },
                { text: 'Nexus Collective Back Wall listed, Worli', time: '2d ago', type: 'list' },
                { text: 'Lumière Beauty Studio onboarded, Bandra', time: '3d ago', type: 'list' },
              ].map(({ text, time, type }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                    background: type === 'approve' ? '#059669' : type === 'payment' ? G.gold : 'rgba(185,145,70,0.25)'
                  }} />
                  <span className="flex-1 text-xs" style={{ color: G.textSec }}>{text}</span>
                  <span className="text-xs flex-shrink-0 font-mono" style={{ color: G.textTer }}>{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [contractSpace, setContractSpace] = useState<SpaceCard | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  const currentScreen = (location.pathname.slice(1) || 'marketplace') as Screen

  return (
    <div className="min-h-screen" style={{ background: G.pageBg }}>
      {/* Bottom nav pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${G.border}`,
          borderRadius: 9999,
          boxShadow: `0 8px 32px rgba(185,145,70,0.18), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)`,
          padding: '6px 6px',
          display: 'flex', alignItems: 'center', gap: 2,
        }}>
        {([['marketplace', 'Discover Spaces'], ['dashboard', 'Host Dashboard'], ['pricing', 'Pricing & Plans']] as [Screen, string][]).map(([s, label]) => (
          <button key={s} onClick={() => navigate(s === 'marketplace' ? '/' : `/${s}`)}
            className="px-5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap"
            style={{
              background: currentScreen === s ? G.gradBtn : 'transparent',
              color: currentScreen === s ? '#fff' : G.textSec,
              boxShadow: currentScreen === s ? G.goldGlow : 'none',
            }}>{label}</button>
        ))}
      </div>

      <Routes>
        <Route path="/" element={<Marketplace onOpenContract={setContractSpace} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={<Marketplace onOpenContract={setContractSpace} />} />
      </Routes>

      {contractSpace && <ContractModal space={contractSpace} onClose={() => setContractSpace(null)} />}
    </div>
  )
}
