import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { WeBuildLogo } from './we-build-logo';
import { WE_BUILD_AUSTRALIA_PROFILE } from '@/data/webuild-australia';

interface FooterProps {
  onGoToCareers?: () => void;
  onGoToServices?: () => void;
  onGoToProjects?: () => void;
  onGoToVerify?: () => void;
  onGoToVerifyQr?: () => void;
  onGoToVault?: () => void;
  onGoToAdmin?: () => void;
}

export function Footer({
  onGoToCareers,
  onGoToServices,
  onGoToProjects,
  onGoToVerify,
  onGoToVerifyQr,
  onGoToVault,
  onGoToAdmin,
}: FooterProps) {
  return (
    <footer className="site-footer">
      {/* Brand & Address Column (Screenshot 1: left) */}
      <div>
        <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <WeBuildLogo size="md" height={38} />
          <span style={{ fontSize: '13px', letterSpacing: '0.5px', color: '#68746c', fontWeight: 700, fontFamily: 'monospace' }}>
            AUSTRALIA
          </span>
        </div>

        <p>
          Building community value.
          <br />
          New South Wales • Public sector, civic & residential building.
        </p>

        <a
          className="footer-address"
          href="https://maps.google.com/?q=Level+19+99+Walker+Street+North+Sydney+NSW+2060"
          target="_blank"
          rel="noopener noreferrer"
          title="Open We Build Australia office on Google Maps"
        >
          <MapPin size={13} />
          <span>Level 19/99 Walker Street, North Sydney NSW 2060 ↗</span>
        </a>

        <a
          className="footer-address"
          href={`tel:${WE_BUILD_AUSTRALIA_PROFILE.headOffice.phone}`}
          title="Call We Build Australia Head Office"
        >
          <Phone size={13} />
          <span>{WE_BUILD_AUSTRALIA_PROFILE.headOffice.phone}</span>
        </a>

        <a
          className="footer-address"
          href={`mailto:${WE_BUILD_AUSTRALIA_PROFILE.headOffice.email}`}
          title="Email info@webuildgroup.company"
        >
          <Mail size={13} />
          <span>{WE_BUILD_AUSTRALIA_PROFILE.headOffice.email} ↗</span>
        </a>
      </div>

      {/* Navigation Column 1 (Screenshot 1: middle) */}
      <div>
        <button type="button" onClick={onGoToServices}>
          Our company
        </button>
        <button type="button" onClick={onGoToServices}>
          Five core capabilities
        </button>
        <button type="button" onClick={onGoToProjects}>
          NSW project works
        </button>
        <button type="button" onClick={onGoToCareers}>
          Careers &amp; job openings
        </button>
        <button type="button" onClick={onGoToVerify}>
          Job-letter verification
        </button>
      </div>

      {/* Navigation Column 2 (Screenshot 1: right) */}
      <div>
        <a href="https://www.mbansw.asn.au" target="_blank" rel="noopener noreferrer">
          Master Builders NSW ↗
        </a>
        <a href="https://www.nationaltrust.org.au/services/heritage-awards/" target="_blank" rel="noopener noreferrer">
          National Trust Award ↗
        </a>
        <button type="button" onClick={onGoToVerifyQr || onGoToVerify}>
          Verification &amp; Status QR
        </button>
        <button type="button" onClick={onGoToVault}>
          Subcontractor vault
        </button>
        <button type="button" onClick={onGoToCareers}>
          NSW positions
        </button>
        <button type="button" onClick={onGoToAdmin} className="text-[#d32f2f] font-semibold hover:underline cursor-pointer">
          Staff sign in (Admin)
        </button>
      </div>

      {/* Footer Bottom Strip (Screenshot 1: bottom) */}
      <div className="footer-bottom">
        <span>© 2014 – {new Date().getFullYear()} We Build Australia Pty Ltd. ABN 89 168 514 829.</span>
        <span>Rooted in New South Wales. Building across Sydney & NSW.</span>
      </div>
    </footer>
  );
}
