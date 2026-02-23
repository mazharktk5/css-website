"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, MessageCircle, CheckCircle2, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    // FormSubmit handles the POST request
    const response = await fetch("https://formsubmit.co/ajax/computing.society@uop.edu.pk", {
      method: "POST",
      body: new FormData(form),
    });

    if (response.ok) {
      setIsSubmitted(true);
    }
  };

  return (
    <section className="relative bg-white text-slate-900 overflow-hidden min-h-screen pt-40 pb-24 md:pb-40">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a8a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          variants={fadeUp}
          className="max-w-4xl mb-24"
        >
          <h2 className="text-6xl md:text-[8rem] font-black text-slate-900 tracking-tighter uppercase leading-[0.8] italic mb-12">
            SECURE <br />
            <span className="text-[#1e3a8a] not-italic">CONTACT.</span>
          </h2>
          <div className="flex gap-8 items-start">
            <div className="w-1.5 h-16 bg-[#1e3a8a] shrink-0" />
            <p className="max-w-xl text-slate-500 font-medium text-lg leading-relaxed">
              Establishing a direct line to the CSS Directorate.
              Professional inquiries and technical collaborations are prioritized.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-y-12 lg:gap-16 items-start">

          {/* Form Side */}
          <motion.div className="lg:col-span-7 relative">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-gray-100 shadow-2xl rounded-3xl p-4 md:p-12"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* FormSubmit Configuration */}
                    <input type="hidden" name="_subject" value="New Website Inquiry!" />
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_captcha" value="false" />

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a]">Full Name</label>
                        <input type="text" name="name" required placeholder="Your Name" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-[#1e3a8a] transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a]">Email Address</label>
                        <input type="email" name="email" required placeholder="user@uop.edu.pk" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-[#1e3a8a] transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a]">Subject</label>
                      <input type="text" name="subject" required placeholder="Inquiry about..." className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-[#1e3a8a] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a]">Your Message</label>
                      <textarea name="message" required rows={4} placeholder="How can we help you?" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-[#1e3a8a] transition-all"></textarea>
                    </div>

                    <div className="flex md:justify-start justify-center pt-2">
                      <button type="submit" className="group flex items-center gap-3 px-6 md:px-10 py-3 md:py-4 w-full md:w-max bg-[#1e3a8a] text-white rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-100">
                        Send Message
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#1e3a8a] text-white rounded-3xl p-8 md:p-12 text-center shadow-2xl flex flex-col items-center justify-center min-h-[300px] md:min-h-[500px]"
                >
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={48} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Message Received!</h3>
                  <p className="text-blue-100 max-w-sm mb-8">
                    Thank you for reaching out. A CSS team member will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-8 py-3 bg-white text-[#1e3a8a] rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-blue-50 transition-colors"
                  >
                    Send Another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info Side */}
          <div className="lg:col-span-5 space-y-10 pb-12 lg:pl-8">
            <InfoCard title="Email Us" value="computing.society@uop.edu.pk" icon={<Mail size={22} />} />
            <InfoCard title="Call Us" value="+92 312 9057934" icon={<Phone size={22} />} />
            <InfoCard title="Visit Us" value="Dept. of CS, University of Peshawar" icon={<MapPin size={22} />} />

            <div className="pt-10 border-t border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Connect with us</p>
              <div className="flex flex-wrap gap-4">
                <SocialIcon href="https://wa.me/923129057934" color="bg-green-500" icon={MessageCircle} />
                <SocialIcon href="https://instagram.com/css.dcs.uop/" color="bg-gradient-to-tr from-pink-500 to-yellow-500" icon={Instagram} />
                <SocialIcon href="https://linkedin.com/company/computing-students-society/" color="bg-blue-700" icon={Linkedin} />
                <SocialIcon href="https://facebook.com/css.uop/" color="bg-blue-600" icon={Facebook} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, value, icon }) {
  return (
    <div className="flex items-start gap-6 group">
      <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-xl text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</h4>
        <p className="text-gray-900 font-bold leading-tight mt-1">{value}</p>
      </div>
    </div>
  );
}

function SocialIcon({ href, color, icon: Icon }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg`}>
      <Icon size={20} strokeWidth={2.5} />
    </a>
  );
}