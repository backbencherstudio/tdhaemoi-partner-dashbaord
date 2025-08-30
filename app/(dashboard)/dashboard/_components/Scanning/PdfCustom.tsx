import Image from 'next/image'
import React from 'react'

export default function PdfCustom() {
    return (
        <div>
            {/* Header - fixed */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '110px',
                background: '#fff',
                display: 'flex',
                alignItems: 'flex-start',
                padding: '32px',
                boxSizing: 'border-box',
                zIndex: 10
            }}>
                <Image width={60} height={60} src="/images/pdfLogo.png" alt="Logo" style={{ width: 60, marginRight: 16 }} />
                <div>
                    <div style={{ fontWeight: 600, fontSize: 20 }}>Brugger Theo</div>
                    <div style={{ fontSize: 14 }}>KdNr: 10500</div>
                    <div style={{ fontSize: 14 }}>Geb: 23.07.1997</div>
                    <div style={{ fontSize: 14 }}>Scan: 20.06.2025</div>
                </div>
            </div>
            {/* Footer - fixed */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                background: '#111',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 48px',
                fontSize: 16,
                borderTop: '1px solid #222',
                zIndex: 10
            }}>
                <div>
                    <p>+43 595024330</p>
                </div>
                <div>
                    <p>FeetFirst GmbH</p>
                </div>
                <div>
                    <p>info@feetfirst.com</p>
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                position: 'absolute',
                top: '170px',
                left: 0,
                width: '100%',
                bottom: '70px',
                padding: '0 48px',
                boxSizing: 'border-box',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
            }}>
                {/* Kundendaten */}
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Kundendaten</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                        <div>Email: Mustermann.Max@gmail.com</div>
                        <div>Telefon</div>
                        <div>Wohnort</div>
                    </div>
                    <div>Diagnose:</div>
                </div>
                {/* Bearbeitung & Terminierung */}
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Bearbeitung & Terminierung</div>
                <div style={{ marginBottom: 16 }}>
                    <div>Mitarbeiter: Johannes</div>
                    <div>Auftragsdatum: 01.02.2025</div>
                    <div>Fertigstellung bis: 10.02.2025</div>
                    <div>Abholung: Bremen</div>
                </div>
                <hr style={{ margin: '16px 0' }} />
                {/* Versorgung & Materialien */}
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Versorgung & Materialien</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                        <div style={{ fontWeight: 600 }}>Versorgung:</div>
                        <div>Alltagseinlage</div>
                        <div>Rohling 339821769, mit Pelotte</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 600 }}>Materialien:</div>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                            <li>Rohling: Sporteinlage weiß Flex, Größe 42</li>
                            <li>Pelotte: Nummer 11</li>
                            <li>Zusatz: Kork 3 mm Außenranderhöhung</li>
                        </ul>
                    </div>
                </div>
                <hr style={{ margin: '16px 0' }} />
                {/* Zahlung & Abholung */}
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Zahlung & Abholung</div>
                <div style={{ marginBottom: 16 }}>
                    <div>Einlagenversorgung: Standard 170,00€</div>
                    <div>Fußanalyse: 25,00€</div>
                    <div><span style={{ fontWeight: 600 }}>Gesamtpreis:</span> 195,00€</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <div>Private Bezahlung am: _______________</div>
                    <div>Abgeholt am: _______________________</div>
                </div>
            </div>
        </div>
    )
}
