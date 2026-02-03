"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { IconLoader2, IconCheck } from "@tabler/icons-react";
import FloatingElement from "../components/ui/FloatingElement";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

// Glitch text effect component
const GlitchText = ({ children, className = "" }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span className="absolute top-0 left-0 -translate-x-0.5 translate-y-0.5 text-cyan-500 opacity-70 blur-[1px] animate-pulse">
        {children}
      </span>
      <span className="absolute top-0 left-0 translate-x-0.5 -translate-y-px text-red-500 opacity-70 blur-[1px] animate-pulse delay-75">
        {children}
      </span>
    </div>
  );
};

// Price card component with crazy animations
const PriceCard = ({ title, price, isActive, deadline, onClick }) => {
  return (
    <motion.div
      className={`relative p-8 rounded-3xl border-2 cursor-pointer overflow-hidden ${
        isActive
          ? "border-white bg-white/10 shadow-[0_0_60px_rgba(255,255,255,0.3)]"
          : "border-white/20 bg-black/40 hover:border-white/40"
      }`}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ backgroundSize: "200% 200%" }}
        />
      )}

      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        {deadline && <p className="text-sm text-cyan-400 mb-4">{deadline}</p>}
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white">
            ₹{price}
          </span>
        </div>
      </div>

      {isActive && (
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

// Floating benefit item
const BenefitItem = ({ icon, text, delay }) => {
  return (
    <motion.div
      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{
        scale: 1.05,
        backgroundColor: "rgba(255,255,255,0.1)",
        boxShadow: "0 0 30px rgba(255,255,255,0.2)",
      }}
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-lg text-white font-medium">{text}</span>
    </motion.div>
  );
};

// CTA Button (Events-like style)
const CTAButton = ({ onClick, disabled, loading, isRegistered, children }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`group relative px-8 sm:px-10 py-3 sm:py-4 font-['Michroma'] font-bold text-white overflow-hidden rounded-xl shadow-lg w-full sm:w-auto ${
        isRegistered
          ? "bg-emerald-500"
          : "bg-gradient-to-r from-white via-gray-100 to-white"
      }`}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className={
          isRegistered
            ? "absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 opacity-100"
            : "absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white opacity-100"
        }
      />

      <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base tracking-wider text-black font-bold">
        {loading ? (
          <>
            <IconLoader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />{" "}
            PROCESSING...
          </>
        ) : isRegistered ? (
          <>
            <IconCheck className="w-4 h-4 sm:w-5 sm:h-5" /> REGISTERED
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
};

// Payment QR modal component (simplified to match Events UI)
const PaymentModal = ({ isOpen, onClose, amount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative max-w-lg w-full bg-[#0b0b0b] rounded-2xl border border-white/10 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-white mb-2">Complete Payment</h3>
        <p className="text-cyan-400 mb-4 font-semibold">Amount: ₹{amount}</p>

        <div className="flex items-start gap-6">
          <div className="w-40 h-40 bg-white rounded-xl p-2 flex items-center justify-center">
            <img src="/qr.png" alt="QR" />
          </div>

          <div className="flex-1 text-white">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Account Name</span>
                <span className="font-mono">Xpecto IIT Mandi</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Account No.</span>
                <span className="font-mono">7315000100034536</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>IFSC</span>
                <span className="font-mono">PUNB0731500</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Branch</span>
                <span className="text-sm">IIT Kamand, Mandi HP</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>UPI ID</span>
                <span className="font-mono text-cyan-400">8628963924m@pnb</span>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              After payment, your registration will be verified within 24-48
              hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Register() {
  const { user, loginWithGoogle } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [existingLead, setExistingLead] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const now = new Date();
  const earlyBirdDeadline = new Date("2026-02-15T23:59:59");
  const isEarlyBird = now <= earlyBirdDeadline;
  const price = isEarlyBird ? 2299 : 2499;

  const benefits = [
    "Food",
    "Accommodation",
    "Bedding",
    "Pronites passes",
    "Some free workshops",
    "Welcome kit",
    "Access to all events (online + offline)",
  ];

  useEffect(() => {
    const checkLead = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE_URL}/leads/my-lead`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.lead) setExistingLead(data.lead);
      } catch (e) {
        console.error(e);
      }
    };
    checkLead();
  }, [user]);

  const handleRegister = async () => {
    if (!user) return loginWithGoogle();

    setRegistering(true);

    try {
      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          passType: isEarlyBird ? "early_bird" : "regular",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExistingLead(data.lead);
        setShowPayment(true);
      } else if (data.lead) {
        setExistingLead(data.lead);
        setShowPayment(true);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative">
      <div className="absolute inset-0">
        <img src="./bg.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div
          className="relative overflow-hidden rounded-3xl bg-black/40 border border-white/10 shadow-2xl max-w-5xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative flex flex-col lg:flex-row items-stretch">
            {/* Left visual */}
            <div className="lg:w-2/5 relative bg-gradient-to-br from-slate-900 to-slate-800">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
              <div className="relative h-64 lg:h-full flex items-center justify-center p-8">
                <FloatingElement>
                  <img
                    src="/logo.png"
                    alt="Xpecto"
                    className="w-40 h-40 object-contain"
                  />
                </FloatingElement>
              </div>
            </div>

            {/* Right content */}
            <div className="lg:w-3/5 p-8 lg:p-12 bg-gradient-to-br from-slate-900/95 to-black/95">
              <div className="space-y-4">
                <h3 className="font-['Michroma'] text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-300">
                  Xpecto ’26 Passes
                </h3>

                <div className="h-1 bg-gradient-to-r from-white via-gray-300 to-transparent rounded-full w-3/5" />

                <p className="text-gray-300">Price:</p>
                <ul className="list-disc ml-5 text-gray-300">
                  <li>Early Bird: ₹2299 (till 15 Feb)</li>
                  <li>Regular: ₹2499</li>
                </ul>

                <p className="mt-4 text-gray-300 font-semibold">
                  Pass includes:
                </p>
                <ul className="ml-5 space-y-2 text-gray-300">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 text-xl">•</div>
                      <div>{b}</div>
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  <CTAButton
                    onClick={handleRegister}
                    disabled={
                      registering || existingLead?.paymentStatus === "completed"
                    }
                    loading={registering}
                    isRegistered={existingLead?.paymentStatus === "completed"}
                  >
                    {existingLead?.paymentStatus === "completed"
                      ? "✓ Registration Complete"
                      : `Pay ₹${price} & Register`}
                  </CTAButton>
                </div>

                {existingLead && (
                  <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Pass</span>
                      <span className="capitalize">
                        {existingLead.passType?.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span
                        className={`${existingLead.paymentStatus === "completed" ? "text-green-400" : existingLead.paymentStatus === "pending" ? "text-yellow-400" : "text-red-400"}`}
                      >
                        {existingLead.paymentStatus}
                      </span>
                    </div>
                    {existingLead.paymentStatus === "pending" && (
                      <div className="mt-2 text-sm">
                        <button
                          onClick={() => setShowPayment(true)}
                          className="text-cyan-400 underline"
                        >
                          View payment details
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-6">
                  For queries:{" "}
                  <span className="text-white">xpecto@iitmandi.ac.in</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={existingLead?.amount || price}
      />
    </div>
  );
}
