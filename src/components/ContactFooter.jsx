import React, { useState } from 'react';
import { Shield, Mail, Send, CheckCircle2, Github, Linkedin } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL
  ? import.meta.env.VITE_BACKEND_API_URL.replace(/\/$/, "")
  : 'http://localhost:3001';

export default function ContactFooter() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', topic: 'Lab Data Access' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to submit inquiry');
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '', topic: 'Lab Data Access' });
      }, 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="contact" className="relative z-20 bg-[#F5F2EB] pt-24 pb-12 border-t border-amber-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-xs mb-2 font-semibold">
              <span>07</span>
              <span className="text-amber-500">/</span>
              <span>GET IN TOUCH</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight font-sans">
              Collaborate With <br />
              <span className="text-gradient-saffron">Food Intelligence Lab</span>
            </h2>

            <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
              Contact us at:
            </p>

            <div className="space-y-4 font-mono text-xs text-stone-700 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-amber-700 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <a href="mailto:arpitasharma1267@gmail.com" className="text-stone-900 font-bold hover:text-amber-700 hover:underline">
                    arpitasharma1267@gmail.com
                  </a>
                  <p className="text-stone-500 text-[11px]">Direct Lab Email</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-amber-200/90 bg-white shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-bold text-stone-900 font-sans mb-6">Submit Inquiry or Data Upload Request</h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-stone-900">Inquiry Transmitted Successfully</h4>
                <p className="text-xs font-mono text-stone-600">
                  Thank you! Your submission has been queued for review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1.5 font-semibold">Your Full Name:</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Sarah Jenkins"
                      className="w-full px-4 py-3 rounded-xl glass-input text-stone-900 focus:outline-none border-amber-200"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 mb-1.5 font-semibold">Email Address:</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@institution.org"
                      className="w-full px-4 py-3 rounded-xl glass-input text-stone-900 focus:outline-none border-amber-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1.5 font-semibold">Inquiry Topic:</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass-input text-stone-900 focus:outline-none bg-white border-amber-200"
                  >
                    <option value="Lab Data Access">Peer-Reviewed Study Data Contribution</option>
                    <option value="API Integration">API Integration for Regulatory Audit</option>
                    <option value="Adulteration Report">Report Spice Heavy Metal Adulteration</option>
                    <option value="General Question">General Research Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1.5 font-semibold">Message / Research Context:</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your research, food sample data, or API access requirements..."
                    className="w-full px-4 py-3 rounded-xl glass-input text-stone-900 focus:outline-none border-amber-200"
                  ></textarea>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl ${loading ? 'bg-amber-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600'} text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md`}
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Transmitting...' : 'Send Inquiry to Food Intelligence Lab'}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer Main Divider */}
        <div className="pt-12 border-t border-amber-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-stone-900 tracking-tight">
                FOOD <span className="text-amber-700 font-semibold">INTELLIGENCE</span> LAB
              </span>
              <p className="text-[10px] text-stone-500 font-mono">
                Global Food Safety & Trace Mineral Intelligence Platform
              </p>
            </div>
          </div>

          {/* Social Icons with Hover Glow */}
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/Ariiee" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-white hover:bg-amber-50 border border-stone-300 hover:border-amber-500 text-stone-700 hover:text-amber-800 flex items-center justify-center transition-all shadow-sm"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="https://www.linkedin.com/in/arpita-sharma-490a77269" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-white hover:bg-amber-50 border border-stone-300 hover:border-amber-500 text-stone-700 hover:text-amber-800 flex items-center justify-center transition-all shadow-sm"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          <p className="text-[11px] text-stone-500 font-mono">
            © {new Date().getFullYear()} Food Intelligence Lab
          </p>

        </div>

      </div>
    </footer>
  );
}
