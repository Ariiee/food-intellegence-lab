import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Mail, LogOut, ShieldCheck } from 'lucide-react';

export default function CardNav({ handleSignOut, userRole, onOpenAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
        className="p-2 rounded-xl text-stone-700 hover:text-amber-700 hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Expanded Card Panel */}
      <div
        className={`
          fixed left-4 right-4 top-20 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-64
          origin-top-right rounded-[16px] bg-[#FEF9E7] border border-amber-200 
          shadow-[0_4px_20px_rgba(217,119,6,0.15)] transition-all duration-300 ease-out z-50
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
        `}
      >
        <div className="p-2 flex flex-col gap-1">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#1A1A1A] rounded-xl hover:bg-[#FDE68A] hover:text-amber-900 transition-colors focus:outline-none focus:bg-[#FDE68A] group"
          >
            <Mail className="w-4 h-4 text-amber-600 group-hover:text-amber-800" />
            Contact Us
          </a>
          
          {userRole === 'admin' && (
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenAdmin) onOpenAdmin();
              }}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#1A1A1A] rounded-xl hover:bg-purple-100 hover:text-purple-900 transition-colors focus:outline-none focus:bg-purple-100 w-full text-left group"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 group-hover:text-purple-800" />
              Admin Panel
            </button>
          )}

          <button
            onClick={() => {
              setIsOpen(false);
              if (handleSignOut) handleSignOut();
            }}
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#1A1A1A] rounded-xl hover:bg-rose-100 hover:text-rose-800 transition-colors focus:outline-none focus:bg-rose-100 w-full text-left group"
          >
            <LogOut className="w-4 h-4 text-amber-600 group-hover:text-rose-700 transition-colors" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
