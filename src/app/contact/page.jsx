"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactPage() {
  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 w-full py-16 lg:py-24">
        {/* Contact heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          variants={fadeUp}
          className="text-center mb-12 mt-16"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-blue-900">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-gray-700 mt-3">
            Get in Touch With Our Team for Any Inquiries or Assistance!
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          variants={fadeUp}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6 mb-24"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              placeholder="Enter subject"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Write your message..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition shadow-md"
          >
            Share
          </button>
        </motion.form>

        {/* Info Section */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-16">
            {/* Email */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              variants={fadeUp}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-blue-900 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                {/* mail icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 text-white"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p className="text-gray-700">adv@gmail.com</p>
              <p className="text-gray-700">hgf@gmail.com</p>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              variants={fadeUp}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-blue-900 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                {/* Phone icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10"
                >
                  <path d="M13 2a9 9 0 0 1 9 9" />
                  <path d="M13 6a5 5 0 0 1 5 5" />
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">PHONE</h3>
              <p className="text-gray-700">+912 3 567 8987</p>
              <p className="text-gray-700">+912 5 252 3336</p>
            </motion.div>

            {/* Office Location */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              variants={fadeUp}
              className="flex flex-col items-center text-center"
            >
              <div className="bg-blue-900 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                {/* Location icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">OUR LOCATION</h3>
              <p className="text-gray-700">
                Department of computer science
              </p>
              <p className="text-gray-700">
                University of Peshawar
              </p>
            </motion.div>
          </div>
        </div>



        {/* Social Media Section */}
<div className="py-12">
  <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      variants={fadeUp}
      className="text-2xl sm:text-3xl font-bold text-blue-900 mb-8"
    >
      Find Us on Social Media
    </motion.h2>

    <div className="flex justify-center gap-10">
      {/* WhatsApp */}
      <motion.a
        href="https://wa.me/923001234567"
        target="_blank"
        rel="noopener noreferrer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeUp}
        className="bg-green-500 w-16 h-16 flex items-center justify-center rounded-full shadow-lg hover:bg-green-600 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M20.52 3.48A11.78 11.78 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.17 1.59 6L0 24l6.25-1.64A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.24-6.21-3.48-8.52zM12 22a9.96 9.96 0 01-5.09-1.4l-.36-.21-3.7.97.99-3.61-.23-.37A9.97 9.97 0 1122 12c0 5.52-4.48 10-10 10zm5.07-7.73c-.27-.13-1.61-.79-1.86-.87-.25-.09-.43-.13-.61.13-.18.26-.7.87-.86 1.05-.16.17-.32.2-.59.07-.27-.13-1.12-.41-2.13-1.31-.79-.71-1.32-1.59-1.48-1.86-.16-.27-.02-.42.11-.55.12-.12.27-.32.41-.47.14-.15.18-.25.27-.42.09-.17.04-.32-.02-.45-.07-.13-.61-1.47-.84-2-.22-.53-.45-.45-.61-.46h-.52c-.17 0-.45.06-.68.32s-.89.87-.89 2.13c0 1.26.91 2.48 1.04 2.65.13.17 1.79 2.73 4.34 3.83.61.26 1.09.42 1.46.54.61.19 1.17.16 1.61.1.49-.07 1.61-.66 1.84-1.29.23-.63.23-1.17.16-1.29-.07-.12-.25-.19-.52-.32z" />
        </svg>
      </motion.a>

      {/* Instagram */}
      <motion.a
        href="https://instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        variants={fadeUp}
        className="bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 w-16 h-16 flex items-center justify-center rounded-full shadow-lg hover:opacity-90 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.344 3.608 1.32.975.975 1.257 2.242 1.32 3.608.058 1.266.069 1.646.069 4.839s-.012 3.573-.07 4.839c-.062 1.366-.344 2.633-1.32 3.608-.975.975-2.242 1.257-3.608 1.32-1.266.058-1.646.069-4.839.069s-3.573-.012-4.839-.07c-1.366-.062-2.633-.344-3.608-1.32-.975-.975-1.257-2.242-1.32-3.608C2.175 15.573 2.163 15.193 2.163 12s.012-3.573.07-4.839c.062-1.366.344-2.633 1.32-3.608.975-.975 2.242-1.257 3.608-1.32C8.427 2.175 8.807 2.163 12 2.163m0-2.163C8.741 0 8.332.012 7.052.07c-1.64.076-3.091.462-4.252 1.623C1.639 2.854 1.253 4.305 1.177 5.945.12 8.315.12 15.685 1.177 18.055c.076 1.64.462 3.091 1.623 4.252 1.161 1.161 2.612 1.547 4.252 1.623C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.64-.076 3.091-.462 4.252-1.623 1.161-1.161 1.547-2.612 1.623-4.252.057-1.28.069-1.689.069-4.948s-.012-3.668-.07-4.948c-.076-1.64-.462-3.091-1.623-4.252-1.161-1.161-2.612-1.547-4.252-1.623C15.668.012 15.259 0 12 0z" />
          <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8.001 4 4 0 0 1 0 8.001zm6.406-11.845a1.44 1.44 0 1 1-2.881 0 1.44 1.44 0 0 1 2.881 0z" />
        </svg>
      </motion.a>

      {/* LinkedIn */}
      <motion.a
        href="https://linkedin.com/"
        target="_blank"
        rel="noopener noreferrer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        variants={fadeUp}
        className="bg-blue-700 w-16 h-16 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-800 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.204 24 24 23.226 24 22.271V1.729C24 .774 23.204 0 22.225 0zM7.119 20.452H3.56V9h3.559v11.452zM5.34 7.577a2.065 2.065 0 1 1 0-4.13 2.065 2.065 0 0 1 0 4.13zM20.452 20.452h-3.559v-5.604c0-1.337-.027-3.059-1.865-3.059-1.867 0-2.153 1.459-2.153 2.967v5.696h-3.559V9h3.414v1.561h.049c.476-.9 1.637-1.849 3.37-1.849 3.604 0 4.272 2.372 4.272 5.457v6.283z" />
        </svg>
      </motion.a>
    </div>
  </div>
</div>

      </div>
    </section>
  );
}
