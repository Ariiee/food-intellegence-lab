import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Sparkles, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../utils/geminiApi';

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const [keyInput, setKeyInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getStoredApiKey());
      setStatusMessage('');
      setIsSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setStoredApiKey(keyInput);
    setIsSavedSuccess(true);
    setStatusMessage(keyInput ? '✓ Gemini API Key saved successfully! Live AI extraction enabled.' : 'Key cleared. App will use automatic scientific estimator fallback.');
    
    if (onKeySaved) onKeySaved(keyInput);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-amber-300 p-6 sm:p-8 bg-white shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-sans">Gemini AI API Key Settings</h3>
              <p className="text-xs text-stone-600 font-mono">Connect AI model for automated material extraction</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="space-y-5">
          
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 font-mono">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Automated Zero-Manual Entry Engine</span>
            </div>
            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Search for ANY food item (e.g. Cardamom, Cinnamon, Garlic, Almonds). Google Gemini AI will instantly search, extract raw & branded samples, and inject the 13-element spectrum profile.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-stone-800 mb-1.5 flex items-center justify-between">
              <span>Google Gemini API Key (Free Tier):</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-amber-700 hover:text-amber-900 flex items-center gap-1 hover:underline text-[11px]"
              >
                Get Free Key <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Paste your Gemini API key (AIzaSy...)"
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-200 focus:border-amber-500 focus:bg-white text-stone-900 font-mono text-xs focus:outline-none transition-all"
            />
            <p className="text-[11px] font-mono text-stone-500 mt-1">
              * Keys are stored strictly locally in your browser's LocalStorage.
            </p>
          </div>

          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2 ${
              isSavedSuccess ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900'
            }`}>
              {isSavedSuccess ? <Check className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-amber-700" />}
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Save API Key
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
