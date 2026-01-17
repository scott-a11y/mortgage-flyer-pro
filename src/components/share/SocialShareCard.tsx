import { forwardRef } from "react";
import { FlyerData } from "@/types/flyer";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, TrendingDown, Landmark, Building2, Flag } from "lucide-react";

interface SocialShareCardProps {
    data: FlyerData;
    shareUrl: string;
}

// Helper for soft headshots
function HeadshotImage({
    src,
    alt,
    size,
    positionY = 15,
    positionX = 50
}: {
    src: string;
    alt: string;
    size: number;
    positionY?: number;
    positionX?: number;
}) {
    return (
        <img
            src={src}
            alt={alt}
            crossOrigin="anonymous"
            style={{
                width: size,
                height: size,
                objectFit: 'cover',
                objectPosition: `${positionX}% ${positionY}%`,
                flexShrink: 0,
                borderRadius: size / 2, // Circular
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
            }}
        />
    );
}

const GOLD = "#D4AF37";
const ONYX = "#050505";
const CARD_BG = "#0f0f11";
const GRID_BG = "#0a0a0c";

export const SocialShareCard = forwardRef<HTMLDivElement, SocialShareCardProps>(({ data, shareUrl }, ref) => {
    // Logic for Rate Display - Standardizing format to 3 decimals
    const formatRate = (val: string | undefined) => {
        if (!val) return '0.000';
        return parseFloat(val.replace('%', '')).toFixed(3);
    };

    const rJumbo = formatRate(data.rates.thirtyYearJumbo);
    const rFixed30 = formatRate(data.rates.thirtyYearFixed);
    const rFixed15 = formatRate(data.rates.fifteenYearFixed);
    const rFHA = formatRate(data.rates.fha);
    const rVA = formatRate(data.rates.va);

    // APR values
    const aprJumbo = formatRate(data.rates.thirtyYearJumboAPR);
    const aprFixed30 = formatRate(data.rates.thirtyYearFixedAPR);
    const aprFixed15 = formatRate(data.rates.fifteenYearFixedAPR);
    const aprFHA = formatRate(data.rates.fhaAPR);
    const aprVA = formatRate(data.rates.vaAPR);

    const isConventional = data.rateType === 'conventional';
    const isGovernment = data.rateType === 'government';

    // Left Card
    const label1 = isGovernment ? 'FHA 30-Year' : (isConventional ? '30-Year Fixed' : 'Jumbo Portfolio');
    const value1 = isGovernment ? rFHA : (isConventional ? rFixed30 : rJumbo);
    const apr1 = isGovernment ? aprFHA : (isConventional ? aprFixed30 : aprJumbo);

    // Right Card
    const label3 = isGovernment ? 'VA 30-Year' : (isConventional ? '15-Year Fixed' : '15-Year Acq.');
    const value3 = isGovernment ? rVA : rFixed15;
    const apr3 = isGovernment ? aprVA : aprFixed15;

    const subhead = isGovernment ? 'Government Loan Update' : 'Private Client Market Update';

    // Fallback positions for Scott
    const getX = (name: string, x?: number) => x ?? (name.includes('Scott Little') ? 35 : 50);
    const getY = (name: string, y?: number) => name.includes('Scott Little') ? 15 : (y ?? 15);

    return (
        <div
            style={{
                width: 1080,
                height: 1080,
                background: ONYX,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                fontFamily: 'Inter, system-ui, sans-serif',
                overflow: 'hidden'
            }}
            ref={ref}
        >
            {/* AMBIENT GLOW */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'rgba(212, 175, 55, 0.08)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />

            {/* HEADER */}
            <div style={{ padding: '80px 60px 60px', textAlign: 'center', zIndex: 10 }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 50,
                    marginBottom: 40,
                    background: 'rgba(255,255,255,0.03)'
                }}>
                    <div style={{ width: 8, height: 8, background: GOLD, borderRadius: '50%' }} />
                    <span style={{ color: '#94a3b8', fontSize: 16, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 500 }}>{subhead}</span>
                </div>

                <h1 style={{
                    fontFamily: 'Playfair Display, serif',
                    color: 'white',
                    fontSize: 100,
                    lineHeight: 1.1,
                    margin: 0,
                    letterSpacing: '-0.02em'
                }}>
                    {isGovernment ? (
                        <span>Security & <span style={{ color: '#60a5fa' }}>Stability.</span></span>
                    ) : (
                        <span>Liquidity & <span style={{ color: GOLD }}>Acquisition.</span></span>
                    )}
                </h1>
            </div>

            {/* GRID SECTION */}
            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                background: GRID_BG,
                borderTop: '1px solid rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                {/* LEFT CARD */}
                <div style={{
                    padding: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'center',
                    borderRight: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: '#0a0a0c',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 24,
                        color: isGovernment ? '#60a5fa' : '#94a3b8'
                    }}>
                        {isGovernment ? <Building2 size={32} /> : <ShieldCheck size={32} />}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 18, textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700, marginBottom: 16 }}>{label1}</div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, color: 'white', fontSize: 96, letterSpacing: '-0.05em' }}>{value1}</span>
                        <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 32, color: isGovernment ? '#60a5fa' : GOLD, marginTop: 12 }}>%</span>
                    </div>
                    <div style={{ color: '#666', fontSize: 14, marginTop: 8, letterSpacing: 1 }}>
                        APR {apr1}%
                    </div>
                    <div style={{ color: '#444', fontSize: 18, marginTop: 16 }}>
                        {isGovernment ? "Low down payment options." : "Flexible underwriting for HNW liquidity."}
                    </div>
                </div>

                {/* CENTER CARD (HERO) */}
                <div style={{
                    padding: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.08), transparent)',
                    position: 'relative'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: 0.4 }} />

                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: `1px solid ${GOLD}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 24,
                        color: GOLD
                    }}>
                        <Landmark size={32} />
                    </div>
                    <div style={{ color: GOLD, fontSize: 18, textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700, marginBottom: 16 }}>Bridge Strategy</div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: 'white', fontSize: 48, lineHeight: 1.2 }}>Non-Contingent</div>
                    <div style={{ color: GOLD, fontSize: 18, marginTop: 24, opacity: 0.8 }}>Secure the asset first.</div>
                </div>

                {/* RIGHT CARD */}
                <div style={{
                    padding: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'center',
                    borderLeft: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: '#0a0a0c',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 24,
                        color: isGovernment ? '#ef4444' : '#94a3b8'
                    }}>
                        {isGovernment ? <Flag size={32} /> : <TrendingDown size={32} />}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 18, textTransform: 'uppercase', letterSpacing: 3, fontWeight: 700, marginBottom: 16 }}>{label3}</div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, color: 'white', fontSize: 96, letterSpacing: '-0.05em' }}>{value3}</span>
                        <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 32, color: isGovernment ? '#ef4444' : '#10b981', marginTop: 12 }}>%</span>
                    </div>
                    <div style={{ color: '#666', fontSize: 14, marginTop: 8, letterSpacing: 1 }}>
                        APR {apr3}%
                    </div>
                    <div style={{ color: '#444', fontSize: 18, marginTop: 16 }}>
                        {isGovernment ? "Zero down for veterans." : "Accelerated equity strategy."}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div style={{
                padding: '50px 80px',
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: ONYX
            }}>
                {/* SCOTT */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    {data.broker.headshot && (
                        <HeadshotImage
                            src={data.broker.headshot}
                            alt=""
                            size={120}
                            positionY={getY(data.broker.name, data.broker.headshotPosition)}
                            positionX={getX(data.broker.name, data.broker.headshotPositionX)}
                        />
                    )}
                    <div>
                        <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 32, marginBottom: 4 }}>{data.broker.name}</div>
                        <div style={{ color: GOLD, fontSize: 16, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{data.broker.title}</div>
                        <div style={{ color: '#666', fontSize: 16, marginTop: 4 }}>NMLS #{data.broker.nmls}</div>
                    </div>
                </div>

                {/* QR CODE */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 12, marginBottom: 8 }}>
                        <QRCodeSVG value={shareUrl} size={80} fgColor="white" bgColor="transparent" />
                    </div>
                    <div style={{ color: '#444', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>Scan Me</div>
                </div>

                {/* CELESTE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexDirection: 'row-reverse', textAlign: 'right' }}>
                    {data.realtor.headshot && (
                        <HeadshotImage
                            src={data.realtor.headshot}
                            alt=""
                            size={120}
                            positionY={getY(data.realtor.name, data.realtor.headshotPosition)}
                            positionX={getX(data.realtor.name, data.realtor.headshotPositionX)}
                        />
                    )}
                    <div>
                        <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 32, marginBottom: 4 }}>{data.realtor.name}</div>
                        <div style={{ color: GOLD, fontSize: 16, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{data.realtor.title}</div>
                        <div style={{ color: '#666', fontSize: 16, marginTop: 4 }}>{data.realtor.email}</div>
                    </div>
                </div>
            </div>

            {/* COMPLIANCE */}
            <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center' }}>
                <span style={{ color: '#333', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
                    Equal Housing Opportunity • Rates subject to change • Verified Pro Marketing
                </span>
            </div>
        </div>
    );
});
