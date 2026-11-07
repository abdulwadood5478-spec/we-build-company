import { useState } from 'react';
import { X, KeyRound, ArrowRight } from 'lucide-react';

interface QuickCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCode: (code: string) => void;
}

export function QuickCodeModal({ isOpen, onClose, onSubmitCode }: QuickCodeModalProps) {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmitCode(code.trim().toUpperCase());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <KeyRound size={16} className="text-amber-400" />
            <span>Enter We Build Australia Access Code</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              6-to-10 Digit Transfer Code
            </label>
            <input
              type="text"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. WB-849-201"
              maxLength={15}
              className="w-full bg-slate-950 border-2 border-slate-700 focus:border-red-500 rounded-xl px-4 py-3 text-center text-xl font-mono font-extrabold tracking-widest text-white uppercase placeholder:text-slate-600 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!code.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-red-600/20 transition-colors cursor-pointer"
            >
              <span>Unlock & Decrypt</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
