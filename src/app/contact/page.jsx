"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, ArrowRight, CheckCircle2 } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        "service_u4mqbug",
        "template_cs2tu5c",
        formRef.current,
        { publicKey: "8_E-5JuJ6DY1JjabL" }
      );

      setIsSubmitted(true);
      formRef.current?.reset();
    } catch (error) {
      console.error(error);
      alert("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-40 selection:bg-[#1e3a8a]/10 selection:text-[#1e3a8a]">

      {/* Hero */}
      <header className="relative pt-32 pb-20 bg-[#1e3a8a]/10">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-sm text-[#1e3a8a] font-medium tracking-wide"
          >
            Computing Students Society
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight"
          >
            Get in Touch
            <span className="block text-[#1e3a8a] mt-2 text-3xl md:text-4xl font-bold">
              Let’s Build Something Together
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Have a question, idea, or collaboration in mind? Reach out to the CSS team and we’ll get back to you.
          </motion.p>

        </div>
      </header>

      {/* Main Section */}
      <div className="max-w-6xl mx-auto px-6 mt-12">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col lg:flex-row"
        >

          {/* Left Side */}
          <div className="lg:w-[40%] bg-[#1e3a8a] p-10 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-8">Contact Info</h3>

              <div className="space-y-6">
                <div className="flex gap-3">
                  <Mail className="text-[#93c5fd]" />
                  <span>computing.society@uop.edu.pk</span>
                </div>
                <div className="flex gap-3">
                  <Phone className="text-[#93c5fd]" />
                  <span>+92 312 9057934</span>
                </div>
                <div className="flex gap-3">
                  <MapPin className="text-[#93c5fd]" />
                  <span>Dept. of Computer Science, UOP</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-[#93c5fd] hover:text-[#1e3a8a] transition"><Instagram /></a>
              <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-[#93c5fd] hover:text-[#1e3a8a] transition"><Linkedin /></a>
              <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-[#93c5fd] hover:text-[#1e3a8a] transition"><Facebook /></a>
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:w-[60%] p-10">

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  <div className="grid md:grid-cols-2 gap-6">
                    <input name="name" required placeholder="Name"
                      className="input" />
                    <input name="email" type="email" required placeholder="Email"
                      className="input" />
                  </div>

                  <input name="subject" required placeholder="Subject"
                    className="input" />

                  <textarea name="message" rows={5} required placeholder="Message"
                    className="input resize-none" />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && <ArrowRight size={16} />}
                  </button>

                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <CheckCircle2 className="mx-auto text-[#1e3a8a] mb-4" size={50} />
                  <h3 className="text-3xl font-bold mb-2">Message Sent</h3>
                  <p className="text-slate-600 mb-6">
                    We’ll get back to you soon.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2 border border-slate-200 rounded-xl hover:bg-[#1e3a8a] hover:text-white transition"
                  >
                    Send another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>

      {/* Reusable input style */}
      <style jsx>{`
        .input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 14px;
          font-weight: 500;
          outline: none;
          transition: 0.2s;
        }
        .input:focus {
          border-color: #1e3a8a;
          box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.1);
        }
      `}</style>
    </div>
  );
}