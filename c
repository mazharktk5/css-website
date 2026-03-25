warning: in the working copy of 'src/app/contact/page.jsx', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/src/app/contact/page.jsx b/src/app/contact/page.jsx[m
[1mindex cba1928..2d004cf 100644[m
[1m--- a/src/app/contact/page.jsx[m
[1m+++ b/src/app/contact/page.jsx[m
[36m@@ -2,174 +2,245 @@[m
 [m
 import { useState } from "react";[m
 import { motion, AnimatePresence } from "framer-motion";[m
[31m-import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, MessageCircle, CheckCircle2, ArrowRight } from "lucide-react";[m
[31m-[m
[31m-const fadeUp = {[m
[31m-  hidden: { opacity: 0, y: 30 },[m
[31m-  visible: { opacity: 1, y: 0 },[m
[31m-};[m
[32m+[m[32mimport { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, ArrowRight, CheckCircle2 } from "lucide-react";[m
 [m
 export default function ContactPage() {[m
   const [isSubmitted, setIsSubmitted] = useState(false);[m
[32m+[m[32m  const [isSubmitting, setIsSubmitting] = useState(false);[m
 [m
   const handleSubmit = async (e) => {[m
     e.preventDefault();[m
[32m+[m[32m    setIsSubmitting(true);[m
     const form = e.target;[m
 [m
[31m-    // FormSubmit handles the POST request[m
[31m-    const response = await fetch("https://formsubmit.co/ajax/computing.society@uop.edu.pk", {[m
[31m-      method: "POST",[m
[31m-      body: new FormData(form),[m
[31m-    });[m
[31m-[m
[31m-    if (response.ok) {[m
[31m-      setIsSubmitted(true);[m
[32m+[m[32m    try {[m
[32m+[m[32m      const response = await fetch("https://formsubmit.co/ajax/computing.society@uop.edu.pk", {[m
[32m+[m[32m        method: "POST",[m
[32m+[m[32m        body: new FormData(form),[m
[32m+[m[32m      });[m
[32m+[m
[32m+[m[32m      if (response.ok) {[m
[32m+[m[32m        setIsSubmitted(true);[m
[32m+[m[32m      }[m
[32m+[m[32m    } catch (error) {[m
[32m+[m[32m      console.error(error);[m
[32m+[m[32m    } finally {[m
[32m+[m[32m      setIsSubmitting(false);[m
     }[m
   };[m
 [m
   return ([m
[31m-    <section className="relative bg-white text-slate-900 overflow-hidden min-h-screen pt-40 pb-24 md:pb-40">[m
[31m-      {/* Background Decor */}[m
[31m-      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"[m
[31m-        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a8a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}[m
[31m-      />[m
[31m-[m
[31m-      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">[m
[32m+[m[32m    <section className="min-h-screen bg-[#fafafa] pt-32 pb-24 md:pt-40 md:pb-32 px-6 lg:px-12 selection:bg-[#1e3a8a] selection:text-white">[m
[32m+[m[32m      <div className="max-w-7xl mx-auto">[m
[32m+[m[41m        [m
[32m+[m[32m        {/* Header */}[m
[32m+[m[32m        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">[m
[32m+[m[32m          <motion.p[m[41m [m
[32m+[m[32m            initial={{ opacity: 0, y: 10 }}[m
[32m+[m[32m            animate={{ opacity: 1, y: 0 }}[m
[32m+[m[32m            className="uppercase tracking-[0.35em] text-xs font-bold text-[#1e3a8a] mb-4"[m
[32m+[m[32m          >[m
[32m+[m[32m            Contact[m
[32m+[m[32m          </motion.p>[m
[32m+[m[32m          <motion.h1[m[41m [m
[32m+[m[32m            initial={{ opacity: 0, y: 10 }}[m
[32m+[m[32m            animate={{ opacity: 1, y: 0 }}[m
[32m+[m[32m            className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight uppercase mb-6"[m
[32m+[m[32m          >[m
[32m+[m[32m            SECURE <span className="text-[#1e3a8a]">CONTACT.</span>[m
[32m+[m[32m          </motion.h1>[m
[32m+[m[32m          <motion.p[m[41m [m
[32m+[m[32m            initial={{ opacity: 0, y: 10 }}[m
[32m+[m[32m            animate={{ opacity: 1, y: 0 }}[m
[32m+[m[32m            transition={{ delay: 0.1 }}[m
[32m+[m[32m            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"[m
[32m+[m[32m          >[m
[32m+[m[32m            Establishing a direct line to the CSS Directorate.[m
[32m+[m[32m            Professional inquiries and technical collaborations are prioritized.[m
[32m+[m[32m          </motion.p>[m
[32m+[m[32m        </div>[m
 [m
[31m-        {/* Header Section */}[m
[31m-        <motion.div[m
[31m-          initial="hidden"[m
[31m-          whileInView="visible"[m
[31m-          viewport={{ once: true }}[m
[31m-          transition={{ duration: 0.8 }}[m
[31m-          variants={fadeUp}[m
[31m-          className="max-w-4xl mb-24"[m
[32m+[m[32m        {/* Main Card Container */}[m
[32m+[m[32m        <motion.div[m[41m [m
[32m+[m[32m          initial={{ opacity: 0, y: 20 }}[m
[32m+[m[32m          animate={{ opacity: 1, y: 0 }}[m
[32m+[m[32m          transition={{ delay: 0.3, duration: 0.6 }}[m
[32m+[m[32m          className="bg-white rounded-[2rem] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1),_0_24px_50px_-10px_rgba(30,58,138,0.25)] ring-1 ring-slate-200/50 overflow-hidden flex flex-col lg:flex-row max-w-6xl mx-auto"[m
         >[m
[31m-          <h2 className="text-6xl md:text-[8rem] font-black text-slate-900 tracking-tighter uppercase leading-[0.8] italic mb-12">[m
[31m-            SECURE <br />[m
[31m-            <span className="text-[#1e3a8a] not-italic">CONTACT.</span>[m
[31m-          </h2>[m
[31m-          <div className="flex gap-8 items-start">[m
[31m-            <div className="w-1.5 h-16 bg-[#1e3a8a] shrink-0" />[m
[31m-            <p className="max-w-xl text-slate-500 font-medium text-lg leading-relaxed">[m
[31m-              Establishing a direct line to the CSS Directorate.[m
[31m-              Professional inquiries and technical collaborations are prioritized.[m
[31m-            </p>[m
[31m-          </div>[m
[31m-        </motion.div>[m
[32m+[m[41m          [m
[32m+[m[32m          {/* Left Column: Contact Info (Dark Blue) */}[m
[32m+[m[32m          <div className="lg:w-[40%] bg-[#1e3a8a] p-10 md:p-14 text-white relative flex flex-col justify-between overflow-hidden">[m
[32m+[m[32m            {/* Background Decor */}[m
[32m+[m[32m            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-[0.03] rounded-full blur-3xl pointer-events-none" />[m
[32m+[m[32m            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-[#93c5fd] opacity-10 rounded-full blur-3xl pointer-events-none" />[m
[32m+[m
[32m+[m[32m            <div className="relative z-10">[m
[32m+[m[32m              <h3 className="text-3xl font-bold mb-10 tracking-tight">Contact Info</h3>[m
[32m+[m[32m              <div className="space-y-8">[m
[32m+[m[32m                <div className="flex items-start gap-4 group cursor-default">[m
[32m+[m[32m                  <Mail className="w-6 h-6 text-[#93c5fd] mt-1 group-hover:scale-110 transition-transform duration-300" />[m
[32m+[m[32m                  <div>[m
[32m+[m[32m                    <p className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-1">Email</p>[m
[32m+[m[32m                    <p className="font-medium text-lg leading-snug">computing.society@<wbr />uop.edu.pk</p>[m
[32m+[m[32m                  </div>[m
[32m+[m[32m                </div>[m
[32m+[m[32m                <div className="flex items-start gap-4 group cursor-default">[m
[32m+[m[32m                  <Phone className="w-6 h-6 text-[#93c5fd] mt-1 group-hover:scale-110 transition-transform duration-300" />[m
[32m+[m[32m                  <div>[m
[32m+[m[32m                    <p className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-1">Phone</p>[m
[32m+[m[32m                    <p className="font-medium text-lg leading-snug">+92 312 9057934</p>[m
[32m+[m[32m                  </div>[m
[32m+[m[32m                </div>[m
[32m+[m[32m                <div className="flex items-start gap-4 group cursor-default">[m
[32m+[m[32m                  <MapPin className="w-6 h-6 text-[#93c5fd] mt-1 group-hover:scale-110 transition-transform duration-300" />[m
[32m+[m[32m                  <div>[m
[32m+[m[32m                    <p className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-1">Office</p>[m
[32m+[m[32m                    <p className="font-medium text-lg leading-relaxed">Dept. of Computer Science<br />University of Peshawar</p>[m
[32m+[m[32m                  </div>[m
[32m+[m[32m                </div>[m
[32m+[m[32m              </div>[m
[32m+[m[32m            </div>[m
 [m
[31m-        <div className="grid lg:grid-cols-12 gap-y-12 lg:gap-16 items-start">[m
[32m+[m[32m            <div className="relative z-10 mt-16 lg:mt-0">[m
[32m+[m[32m              <p className="text-xs font-semibold uppercase tracking-wider text-blue-200 mb-5">Connect with us</p>[m
[32m+[m[32m              <div className="flex gap-4">[m
[32m+[m[32m                <a href="https://instagram.com/css.dcs.uop/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#93c5fd] hover:text-[#1e3a8a] transition-all duration-300">[m
[32m+[m[32m                  <Instagram size={20} />[m
[32m+[m[32m                </a>[m
[32m+[m[32m                <a href="https://linkedin.com/company/computing-students-society/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#93c5fd] hover:text-[#1e3a8a] transition-all duration-300">[m
[32m+[m[32m                  <Linkedin size={20} />[m
[32m+[m[32m                </a>[m
[32m+[m[32m                <a href="https://facebook.com/css.uop/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#93c5fd] hover:text-[#1e3a8a] transition-all duration-300">[m
[32m+[m[32m                  <Facebook size={20} />[m
[32m+[m[32m               </a>[m
[32m+[m[32m              </div>[m
[32m+[m[32m            </div>[m
[32m+[m[32m          </div>[m
 [m
[31m-          {/* Form Side */}[m
[31m-          <motion.div className="lg:col-span-7 relative">[m
[32m+[m[32m          {/* Right Column: Form */}[m
[32m+[m[32m          <div className="lg:w-[60%] p-10 md:p-14 relative bg-white">[m
             <AnimatePresence mode="wait">[m
               {!isSubmitted ? ([m
[31m-                <motion.div[m
[32m+[m[32m                <motion.form[m[41m [m
                   key="form"[m
[31m-                  initial={{ opacity: 0, x: -20 }}[m
[31m-                  animate={{ opacity: 1, x: 0 }}[m
[31m-                  exit={{ opacity: 0, x: 20 }}[m
[31m-                  className="bg-white border border-gray-100 shadow-2xl rounded-3xl p-4 md:p-12"[m
[32m+[m[32m                  initial={{ opacity: 0 }}[m
[32m+[m[32m                  animate={{ opacity: 1 }}[m
[32m+[m[32m                  exit={{ opacity: 0, transition: { duration: 0.2 } }}[m
[32m+[m[32m                  onSubmit={handleSubmit}[m[41m [m
[32m+[m[32m                  className="space-y-6"[m
                 >[m
[31m-                  <form onSubmit={handleSubmit} className="space-y-6">[m
[31m-                    {/* FormSubmit Configuration */}[m
[31m-                    <input type="hidden" name="_subject" value="New Website Inquiry!" />[m
[31m-                    <input type="hidden" name="_template" value="table" />[m
[31m-                    <input type="hidden" name="_captcha" value="false" />[m
[32m+[m[32m                  <input type="hidden" name="_subject" value="New Website Inquiry!" />[m
[32m+[m[32m                  <input type="hidden" name="_template" value="table" />[m
[32m+[m[32m                  <input type="hidden" name="_captcha" value="false" />[m
 [m
[31m-                    <div className="grid md:grid-cols-2 gap-6">[m
[31m-                      <div className="space-y-2">[m
[31m-                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a]">Full Name</label>[m
[31m-                        <input type="text" name="name" required placeholder="Your Name" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-[#1e3a8a] transition-all" />[m
[31m-                      </div>[m
[31m-                      <div className="space-y-2">[m
[31m-                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a]">Email Address</label>[m
[31m-                        <input type="email" name="email" required placeholder="user@uop.edu.pk" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-[#1e3a8a] transition-all" />[m
[31m-                      </div>[m
[31m-                    </div>[m
[32m+[m[32m                  <div className="grid md:grid-cols-2 gap-6">[m
                     <div className="space-y-2">[m
[31m-                      <label className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a]">Subject</label>[m
[31m-                      <input type="text" name="subject" required placeholder="Inquiry about..." className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-[#1e3a8a] transition-all" />[m
[32m+[m[32m                      <label className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a]">First & Last Name</label>[m
[32m+[m[32m                      <input[m[41m [m
[32m+[m[32m                        type="text"[m[41m [m
[32m+[m[32m                        name="name"[m[41m [m
[32m+[m[32m                        required[m[41m [m
[32m+[m[32m                        placeholder="John Doe"[m[41m [m
[32m+[m[32m                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all font-medium"[m
[32m+[m[32m                      />[m
                     </div>[m
                     <div className="space-y-2">[m
[31m-                      <label className="text-[10px] font-black uppercase tracking-widest text-[#1e3a8a]">Your Message</label>[m
[31m-                      <textarea name="message" required rows={4} placeholder="How can we help you?" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-[#1e3a8a] transition-all"></textarea>[m
[32m+[m[32m                      <label className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a]">Email Address</label>[m
[32m+[m[32m                      <input[m[41m [m
[32m+[m[32m                        type="email"[m[41m [m
[32m+[m[32m                        name="email"[m[41m [m
[32m+[m[32m                        required[m[41m [m
[32m+[m[32m                        placeholder="user@uop.edu.pk"[m[41m [m
[32m+[m[32m                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all font-medium"[m
[32m+[m[32m                      />[m
                     </div>[m
[32m+[m[32m                  </div>[m
 [m
[31m-                    <div className="flex md:justify-start justify-center pt-2">[m
[31m-                      <button type="submit" className="group flex items-center gap-3 px-6 md:px-10 py-3 md:py-4 w-full md:w-max bg-[#1e3a8a] text-white rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-100">[m
[31m-                        Send Message[m
[31m-                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />[m
[31m-   