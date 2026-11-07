import { useState, useEffect } from 'react';
import { Navbar, MainNavTab } from '@/components/navbar';
import { HomeView } from '@/components/home-view';
import { ServicesView } from '@/components/services-view';
import { ProjectsView } from '@/components/projects-view';
import { CareersView } from '@/components/careers-view';
import { VerificationView } from '@/components/verification-view';
import { FileManager } from '@/components/file-manager';
import { SendTransfer } from '@/components/send-transfer';
import { ReceiveTransfer } from '@/components/receive-transfer';
import { Footer } from '@/components/footer';
import { TransmittalModal } from '@/components/transmittal-modal';
import { QuickCodeModal } from '@/components/quick-code-modal';
import { AdminPortal } from '@/components/admin-portal';
import { CodedTransferItem } from '@/lib/transfer-store';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainNavTab>('home');
  const [subTab, setSubTab] = useState<'manager' | 'send' | 'receive'>('manager');

  // Coded File Transfer State
  const [receiverInitialCode, setReceiverInitialCode] = useState('');
  const [receiverInitialKey, setReceiverInitialKey] = useState('');
  const [transmittalModalItem, setTransmittalModalItem] = useState<CodedTransferItem | null>(null);
  const [isQuickCodeOpen, setIsQuickCodeOpen] = useState(false);
  const [initialShowQrModal, setInitialShowQrModal] = useState(false);

  // Sync with URL hashes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#verify-qr')) {
        setActiveTab('verify');
        setInitialShowQrModal(true);
      } else if (hash.startsWith('#verify-form') || hash.startsWith('#verify')) {
        setActiveTab('verify');
        setInitialShowQrModal(false);
      } else if (hash.startsWith('#admin') || hash.startsWith('#staff')) {
        setActiveTab('admin');
      } else if (hash.startsWith('#careers') || hash.startsWith('#jobs')) {
        setActiveTab('careers');
      } else if (hash.startsWith('#services') || hash.startsWith('#what-we-do')) {
        setActiveTab('services');
      } else if (hash.startsWith('#projects')) {
        setActiveTab('projects');
      } else if (hash.startsWith('#vault') || hash.startsWith('#files')) {
        setActiveTab('vault');
      } else if (hash.startsWith('#receive')) {
        const queryIndex = hash.indexOf('?');
        if (queryIndex !== -1) {
          const params = new URLSearchParams(hash.slice(queryIndex + 1));
          const code = params.get('code');
          const key = params.get('key');
          if (code) {
            setReceiverInitialCode(code);
            if (key) setReceiverInitialKey(key);
            setActiveTab('vault');
            setSubTab('receive');
          }
        } else {
          setActiveTab('vault');
          setSubTab('receive');
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenReceiverWithCode = (code: string, keyFragment?: string) => {
    setReceiverInitialCode(code);
    if (keyFragment) {
      setReceiverInitialKey(keyFragment);
    }
    setActiveTab('vault');
    setSubTab('receive');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavChange = (tab: MainNavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans selection:bg-[#d32f2f] selection:text-white">
      {/* Exact Webuild Header matching reference image */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavChange}
        onSearch={(query) => {
          if (query.trim()) {
            handleNavChange('projects');
          }
        }}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* TAB 1: HOME (Exact match of Screenshot 1 & 2) */}
        {activeTab === 'home' && (
          <HomeView
            onGoToCareers={() => handleNavChange('careers')}
            onGoToServices={() => handleNavChange('services')}
            onGoToProjects={() => handleNavChange('projects')}
            onGoToVerify={() => handleNavChange('verify')}
          />
        )}

        {/* TAB 2: WHAT WE DO (5 Core Capabilities) */}
        {activeTab === 'services' && (
          <ServicesView
            onGoToSendTransfer={() => {
              setActiveTab('vault');
              setSubTab('send');
            }}
            onGoToCareers={() => handleNavChange('careers')}
          />
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === 'projects' && (
          <ProjectsView
            onGoToSendTransfer={() => {
              setActiveTab('vault');
              setSubTab('send');
            }}
            onGoToCareers={() => handleNavChange('careers')}
          />
        )}

        {/* TAB 4: CAREERS & JOB OPENINGS */}
        {activeTab === 'careers' && (
          <CareersView />
        )}

        {/* TAB 5: JOB LETTER VERIFICATION PORTAL */}
        {activeTab === 'verify' && (
          <VerificationView
            onGoToAdmin={() => handleNavChange('admin')}
            initialShowQrModal={initialShowQrModal}
          />
        )}

        {/* TAB 6: ADMIN & HR DIRECTORATE PORTAL (PASSWORD PROTECTED) */}
        {activeTab === 'admin' && (
          <AdminPortal onBackToSite={() => handleNavChange('home')} />
        )}

        {/* TAB 6: SUBCONTRACTOR CODED FILE VAULT (E2EE) */}
        {activeTab === 'vault' && (
          <div className="py-8 bg-slate-950 text-slate-100 min-h-[calc(100vh-140px)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div>
                <span className="text-[11px] font-mono text-amber-400 font-bold block">
                  WE BUILD AUSTRALIA PTY LTD • AES-256-GCM SECURE VAULT
                </span>
                <h2 className="text-xl font-bold text-white font-sans mt-0.5">
                  Subcontractor &amp; Tender Transmittal Portal
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSubTab('manager')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    subTab === 'manager' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  File Manager
                </button>
                <button
                  type="button"
                  onClick={() => setSubTab('send')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    subTab === 'send' ? 'bg-[#d97706] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Encrypt &amp; Send
                </button>
                <button
                  type="button"
                  onClick={() => setSubTab('receive')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    subTab === 'receive' ? 'bg-[#d97706] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Decrypt by Code
                </button>
              </div>
            </div>

            {subTab === 'manager' && (
              <FileManager
                onSendNewClick={() => setSubTab('send')}
                onOpenReceiverWithCode={handleOpenReceiverWithCode}
                onViewTransmittalModal={setTransmittalModalItem}
              />
            )}

            {subTab === 'send' && (
              <SendTransfer
                onTransferComplete={() => {}}
                onOpenReceiverWithCode={handleOpenReceiverWithCode}
                onViewTransmittalModal={setTransmittalModalItem}
                onGoToManager={() => setSubTab('manager')}
              />
            )}

            {subTab === 'receive' && (
              <ReceiveTransfer
                initialCode={receiverInitialCode}
                initialKey={receiverInitialKey}
                onViewTransmittalModal={setTransmittalModalItem}
                onGoToManager={() => setSubTab('manager')}
              />
            )}
          </div>
        )}
      </main>

      {/* Clean Editorial Footer matching Screenshot 1 */}
      <Footer
        onGoToCareers={() => handleNavChange('careers')}
        onGoToServices={() => handleNavChange('services')}
        onGoToProjects={() => handleNavChange('projects')}
        onGoToVerify={() => {
          setInitialShowQrModal(false);
          handleNavChange('verify');
        }}
        onGoToVerifyQr={() => {
          setInitialShowQrModal(true);
          handleNavChange('verify');
        }}
        onGoToVault={() => handleNavChange('vault')}
        onGoToAdmin={() => handleNavChange('admin')}
      />

      {/* Transmittal Record Print Modal */}
      <TransmittalModal
        transfer={transmittalModalItem}
        onClose={() => setTransmittalModalItem(null)}
      />

      {/* Quick Code Entry Modal */}
      <QuickCodeModal
        isOpen={isQuickCodeOpen}
        onClose={() => setIsQuickCodeOpen(false)}
        onSubmitCode={(code) => handleOpenReceiverWithCode(code)}
      />
    </div>
  );
}
