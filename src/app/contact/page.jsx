"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, ArrowRight, CheckCircle2 } from "lucide-react";
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace these with your actual EmailJS credentials
      const serviceId = "service_u4mqbug";
      const templateId = "template_cs2tu5c";
      const publicKey = "8_E-5JuJ6DY1JjabL";

      await emailjs.sendForm(serviceId, templateId, formRef.current, {
        publicKey: publicKey,
      });

      setIsSubmitted(true);
      if (formRef.current) formRef.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to send message. Check EmailJS credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#fafafa] pt-32 pb-24 md:pt-40 md:pb-32 px-6 lg:px-12 selection:bg-[#1e3a8a] selection:text-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="uppercase tracking-[0.35em] text-xs font-bold text-[#1e3a8a] mb-4"
          >
            Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight uppercase mb-6"
          >
            SECURE <span className="text-[#1e3a8a]">CONTACT.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Establishing a direct line to the CSS Directorate.
            Professional inquiries and technical collaborations are prioritized.
          </motion.p>
        </div>

        {/* Main Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-[2rem] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1),_0_24px_50px_-10px_rgba(30,58,138,0.25)] ring-1 ring-slate-200/50 overflow-hidden flex flex-col lg:flex-row max-w-6xl mx-auto"
        >

          {/* Left Column: Contact Info (Dark Blue) */}
          <div className="lg:w-[40%] bg-[#1e3a8a] p-10 md:p-14 text-white relative flex flex-col justify-between overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-[#93c5fd] opacity-10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-10 tracking-tight">Contact Info</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4 group cursor-default">
                  <Mail className="w-6 h-6 text-[#93c5fd] mt-1 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-1">Email</p>
                    <p className="font-medium text-lg leading-snug">computing.society@<wbr />uop.edu.pk</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group cursor-default">
                  <Phone className="w-6 h-6 text-[#93c5fd] mt-1 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-1">Phone</p>
                    <p className="font-medium text-lg leading-snug">+92 312 9057934</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group cursor-default">
                  <MapPin className="w-6 h-6 text-[#93c5fd] mt-1 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-1">Office</p>
                    <p className="font-medium text-lg leading-relaxed">Dept. of Computer Science<br />University of Peshawar</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-16 lg:mt-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-200 mb-5">Connect with us</p>
              <div className="flex gap-4">
                <a href="https://instagram.com/css.dcs.uop/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#93c5fd] hover:text-[#1e3a8a] transition-all duration-300">
                  <Instagram size={20} />
                </a>
                <a href="https://linkedin.com/company/computing-students-society/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#93c5fd] hover:text-[#1e3a8a] transition-all duration-300">
                  <Linkedin size={20} />
                </a>
                <a href="https://facebook.com/css.uop/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#93c5fd] hover:text-[#1e3a8a] transition-all duration-300">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:w-[60%] p-10 md:p-14 relative bg-white">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  ref={formRef}
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a]">First & Last Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a]">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="user@uop.edu.pk"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a]">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      placeholder="How can we help?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a]">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all resize-none font-medium"
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-10 py-4 bg-[#1e3a8a] text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-[#172e6b] transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(30,58,138,0.39)] hover:shadow-[0_6px_20px_rgba(30,58,138,0.23)] hover:-translate-y-0.5"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12 md:py-24 relative"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#1e3a8a]/5 rounded-full blur-3xl" />

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-24 h-24 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mb-8 border-[8px] border-blue-50/50 relative z-10 shadow-lg shadow-[#1e3a8a]/10"
                  >
                    <CheckCircle2 size={48} strokeWidth={2.5} />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight relative z-10"
                  >
                    Transmission <span className="text-[#1e3a8a]">Successful</span>
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-600 max-w-sm mb-10 text-lg relative z-10"
                  >
                    Thank you for reaching out! A CSS representative will establish contact with you shortly.
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setIsSubmitted(false)}
                    className="px-8 py-4 bg-white border border-slate-200 text-[#1e3a8a] rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#1e3a8a] hover:text-white hover:border-[#1e3a8a] transition-all duration-300 shadow-sm relative z-10"
                  >
                    Send another message
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
}