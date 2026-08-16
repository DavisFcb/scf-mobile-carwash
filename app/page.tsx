"use client";

import { useRef, useState } from "react";

const WHATSAPP_NUMBER = "27664967886";

const services = [
  "Exterior Wash",
  "Interior Deep Clean",
  "Car Polish & Wax",
  "Leather & Fabric Care",
  "Pet Hair Removal",
  "Fleet & Office Cleaning",
];

const packages = [
  { name: "Light / Small Vehicles", options: ["Wash & Dry - R80", "Full Wash - R120", "Engine Wash - R300", "Body Polish + R80"], accent: "cyan" },
  { name: "SUV / Bakkies / 4x4", options: ["Wash & Dry - R100", "Full Wash - R150", "Engine Wash - R300", "Body Polish + R100"], accent: "blue" },
  { name: "Mini Bus / Kombi", options: ["Wash & Dry - R150", "Full Wash - R200", "Engine Wash - R300", "Body Polish + R150"], accent: "indigo" },
];

const highlights = [
  { label: "Working hours", value: "Mon-Sun: 8am - 5pm" },
  { label: "Service area", value: "Bloemfontein" },
  { label: "Booking", value: "By appointment" },
];

type Status = {
  type: "idle" | "submitting" | "success" | "error";
  message: string;
};

function buildWhatsappUrl(data: Record<string, string>) {
  const lines = [
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Service: ${data.service}`,
    `Vehicle: ${data.vehicle}`,
    `Preferred time: ${data.preferredTime || "Not specified"}`,
    `Details: ${data.details || "No extra details"}`,
  ];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    ["Hello SCF Car & Body Care, I would like a quote.", "", ...lines].join("\n")
  )}`;
}

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [formKey, setFormKey] = useState(0);

  async function handleChannel(channel: "whatsapp" | "email") {
    if (!formRef.current) return;
    if (!formRef.current.reportValidity()) return;

    const data = Object.fromEntries(new FormData(formRef.current).entries()) as Record<string, string>;

    if (channel === "whatsapp") {
      window.open(buildWhatsappUrl(data), "_blank", "noopener,noreferrer");
    }

    setStatus({ type: "submitting", message: "" });

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as { message: string };

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
      }

      formRef.current.reset();
      setFormKey((key) => key + 1);
      setStatus({ type: "success", message: result.message });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to submit your request right now.";
      setStatus({ type: "error", message });
    }
  }

  const isSubmitting = status.type === "submitting";

  return (
    <main className="min-h-screen bg-[#062942] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[30px] bg-[#031E31] p-4 shadow-[0_20px_50px_rgba(3,30,49,0.5)] ring-1 ring-cyan-200/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/logo.jpg"
                alt="SCF Car and Body Care logo"
                className="h-16 w-auto rounded-full bg-white/10 p-2 shadow-[0_0_25px_rgba(34,211,238,0.25)] object-cover"
              />
              <div>
                <p className="text-3xl font-black tracking-tight text-white sm:text-4xl">SCF</p>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-300">Car & Body Care</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-200">
              <a href="tel:+27664967886" className="rounded-full border border-cyan-300/50 bg-cyan-500/10 px-4 py-2 font-bold text-cyan-200 transition hover:bg-cyan-400/20">
                +27 66 496 7886
              </a>
              <a href="tel:+27726340331" className="rounded-full border border-cyan-300/50 bg-cyan-500/10 px-4 py-2 font-bold text-cyan-200 transition hover:bg-cyan-400/20">
                +27 72 634 0331
              </a>
            </div>
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-[34px] border border-sky-200/50 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.26),_transparent_35%),linear-gradient(135deg,#d7f4ff_0%,#f7fbff_35%,#dff5ff_100%)] shadow-[0_30px_80px_rgba(13,31,50,0.25)]">
          <div className="grid gap-8 px-5 py-7 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:py-10">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-sky-300 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-700 shadow-sm">
                <img src="/logo.jpg" alt="SCF logo badge" className="h-7 w-7 rounded-full object-cover" />
                Mobile detailing specialists
              </div>

              <h1 className="max-w-xl text-4xl font-black leading-[0.9] tracking-[-0.06em] text-sky-950 sm:text-5xl lg:text-6xl">
                No need to wait long hours at the car wash — <span className="text-sky-600">we come to you.</span>
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-700 sm:text-lg">
                Professional mobile car wash and detailing in Bloemfontein. We bring the shine to your home, office, or workplace with reliable, appointment-based care.
              </p>

              <div className="mt-7 flex flex-wrap gap-4">
                <a
                  href="#quote-form"
                  className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-500"
                >
                  Book a wash
                </a>
                <a
                  href="https://wa.me/27664967886"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-sky-500 bg-white px-6 py-3 text-base font-bold text-sky-700 transition hover:bg-sky-50"
                >
                  WhatsApp now
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-sky-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-700">{item.label}</p>
                    <p className="mt-2 text-sm font-bold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-x-10 bottom-6 h-10 rounded-full bg-sky-600/30 blur-2xl" />
              <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-sky-200 bg-[linear-gradient(135deg,#dff1ff_0%,#d3eeff_20%,#a9dbff_100%)] p-3 shadow-[0_28px_60px_rgba(22,112,166,0.28)]">
                <img
                  src="/wash.jpg"
                  alt="Car being washed and detailed"
                  className="h-[420px] w-full rounded-[26px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[30px] bg-[#edf7ff] p-5 shadow-[0_20px_40px_rgba(4,42,64,0.12)] sm:p-8">
          <form key={formKey} ref={formRef} id="quote-form" className="rounded-[28px] bg-white p-5 ring-1 ring-sky-100 sm:p-6">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">Quick quote</p>
              <h2 className="mt-2 text-3xl font-black text-sky-950">Book your wash in minutes.</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700 sm:col-span-1">
                Name
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-slate-800 outline-none transition focus:border-sky-500"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700 sm:col-span-1">
                Phone
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="Your number"
                  className="mt-2 w-full rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-slate-800 outline-none transition focus:border-sky-500"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700 sm:col-span-1">
                Vehicle type
                <select
                  required
                  name="vehicle"
                  defaultValue=""
                  className="mt-2 w-full rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-slate-800 outline-none transition focus:border-sky-500"
                >
                  <option value="" disabled>
                    Select vehicle
                  </option>
                  <option>Hatchback</option>
                  <option>Sedan</option>
                  <option>SUV / Bakkie</option>
                  <option>Mini Bus / Kombi</option>
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700 sm:col-span-1">
                Service
                <select
                  required
                  name="service"
                  defaultValue=""
                  className="mt-2 w-full rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-slate-800 outline-none transition focus:border-sky-500"
                >
                  <option value="" disabled>
                    Select service
                  </option>
                  <option>Wash & Dry</option>
                  <option>Full Wash</option>
                  <option>Interior Clean</option>
                  <option>Body Polish</option>
                  <option>Engine Cleaning</option>
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
                Preferred time
                <input
                  name="preferredTime"
                  type="datetime-local"
                  className="mt-2 w-full rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-slate-800 outline-none transition focus:border-sky-500"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
                Details
                <textarea
                  name="details"
                  rows={4}
                  placeholder="Tell us about the vehicle and what you need cleaned."
                  className="mt-2 w-full rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-slate-800 outline-none transition focus:border-sky-500"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => handleChannel("whatsapp")}
                disabled={isSubmitting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-[18px] bg-[#2ad66d] px-5 py-3 text-base font-black text-white shadow-[0_12px_24px_rgba(42,214,109,0.3)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-block h-4 w-4 rounded-full bg-white/90" />
                Send via WhatsApp
              </button>
              <button
                type="button"
                onClick={() => handleChannel("email")}
                disabled={isSubmitting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-[18px] border border-slate-300 bg-white px-5 py-3 text-base font-black text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-block h-4 w-4 rounded-sm border border-slate-500 bg-slate-100" />
                {isSubmitting ? "Sending..." : "Send via Email"}
              </button>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              WhatsApp opens a pre-filled chat. Email sends your details directly to our team.
            </p>

            {status.type === "error" && (
              <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {status.message}
              </p>
            )}

            {status.type === "success" && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {status.message}
              </div>
            )}
          </form>
        </section>

        <section className="mt-8 rounded-[30px] bg-[#0a2d47] p-5 text-white shadow-[0_20px_40px_rgba(2,20,31,0.35)] sm:p-8">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Rates</p>
              <h2 className="mt-2 text-3xl font-black text-white">Simple packages for every vehicle.</h2>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {packages.map((pkg) => (
              <article key={pkg.name} className="rounded-[26px] border border-cyan-400/25 bg-[linear-gradient(180deg,rgba(8,47,72,0.9),rgba(10,61,92,0.92))] p-5 shadow-lg">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <span className="rounded-full bg-cyan-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                    from
                  </span>
                </div>

                <ul className="space-y-3">
                  {pkg.options.map((option) => (
                    <li key={option} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-slate-100">
                      <span>{option.split(" - ")[0]}</span>
                      <span className="rounded bg-cyan-500/15 px-2 py-1 text-cyan-200">{option.split(" - ")[1]}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[30px] bg-white p-5 shadow-[0_20px_40px_rgba(4,42,64,0.08)] sm:p-8">
          <div className="mb-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">Our work</p>
            <h2 className="mt-2 text-3xl font-black text-sky-950">Fresh results, happy drivers.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Exterior shine", text: "A clean, glossy finish that looks showroom-ready." },
              { title: "Interior refresh", text: "Seats, mats, and every surface brought back to life." },
              { title: "Detailing care", text: "Premium polish and finishing for a lasting, protected appearance." },
            ].map((item) => (
              <div key={item.title} className="overflow-hidden rounded-[26px] bg-gradient-to-br from-sky-100 to-cyan-50 p-4 ring-1 ring-sky-200">
                <div className="flex h-48 items-center justify-center rounded-[20px] bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.4),_transparent_35%),linear-gradient(135deg,_#eaf9ff,_#d7f1ff_55%,_#c8ebff)] text-2xl font-black text-sky-700 shadow-inner">
                  {item.title.split(" ")[0]}
                </div>
                <p className="mt-4 text-xl font-bold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 rounded-[30px] bg-[#e8f8ff] p-5 shadow-[0_20px_40px_rgba(5,38,58,0.12)] md:grid-cols-[0.9fr_1.1fr] sm:p-8">
          <div className="rounded-[26px] bg-[#d6f0ff] p-6 ring-1 ring-sky-200">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Why choose us</p>
            <h3 className="mt-3 text-3xl font-black text-sky-950">We come to you, no long waits.</h3>
            <ul className="mt-5 space-y-4 text-slate-700">
              <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600" />Convenient mobile service at home, work, or office.</li>
              <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600" />Friendly, professional detailing with quality results.</li>
              <li className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600" />Fast booking and reliable daily availability.</li>
            </ul>
          </div>

          <div className="rounded-[26px] bg-white p-6 ring-1 ring-sky-100">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Business hours</p>
            <div className="mt-4 rounded-2xl bg-sky-50 p-4">
              <p className="text-2xl font-black text-sky-950">Mon-Sun</p>
              <p className="mt-2 text-xl font-bold text-slate-800">8:00 AM - 5:00 PM</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a href="tel:+27664967886" className="rounded-2xl bg-sky-600 p-4 text-center text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500">
                <p className="text-[11px] uppercase tracking-[0.2em] text-sky-100">Call us</p>
                <p className="mt-2 text-lg font-black">+27 66 496 7886</p>
              </a>
              <a href="tel:+27726340331" className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-center text-sky-900 transition hover:bg-sky-100">
                <p className="text-[11px] uppercase tracking-[0.2em] text-sky-700">Second line</p>
                <p className="mt-2 text-lg font-black">+27 72 634 0331</p>
              </a>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              Available every day as per appointment. We service customers across Bloemfontein with professional, on-site car care at a time that suits you.
            </p>
          </div>
        </section>

        <footer className="mt-8 rounded-[30px] bg-[#05273d] px-5 py-6 text-center text-slate-200 shadow-[0_20px_40px_rgba(4,24,38,0.3)] sm:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <p className="text-xl font-black text-white">SCF Car & Body Care</p>
              <p className="text-sm text-cyan-200">Bloemfontein mobile car wash & detailing</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
              <a href="tel:+27664967886" className="rounded-full bg-cyan-500/10 px-3 py-2 text-cyan-200 transition hover:bg-cyan-500/20">+27 66 496 7886</a>
              <a href="tel:+27726340331" className="rounded-full bg-cyan-500/10 px-3 py-2 text-cyan-200 transition hover:bg-cyan-500/20">+27 72 634 0331</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
