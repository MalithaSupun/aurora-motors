"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { initGSAP } from "@/lib/gsap";

type ContactFields = {
  name: string;
  email: string;
  model: string;
  message: string;
};

type ContactErrors = Partial<Record<keyof ContactFields, string>>;

const INITIAL_FORM: ContactFields = {
  name: "",
  email: "",
  model: "",
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [values, setValues] = useState<ContactFields>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<null | "success">(null);

  useEffect(() => {
    const { gsap } = initGSAP();
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-contact-reveal]",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        },
      );
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => {
      if (!current[name as keyof ContactFields]) {
        return current;
      }
      const next = { ...current };
      delete next[name as keyof ContactFields];
      return next;
    });
  };

  const validate = (input: ContactFields) => {
    const nextErrors: ContactErrors = {};

    if (!input.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!EMAIL_REGEX.test(input.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!input.model.trim()) {
      nextErrors.model = "Preferred model is required.";
    }

    if (input.message.trim().length < 12) {
      nextErrors.message = "Message must be at least 12 characters.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const success = Object.keys(nextErrors).length === 0;
    setIsSubmitted(success ? "success" : null);

    if (success) {
      setValues(INITIAL_FORM);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact-section"
      className="relative pb-28 pt-24 md:pb-36 md:pt-32"
    >
      <div className="section-shell">
        <div className="premium-border grid gap-8 rounded-3xl p-8 md:grid-cols-[1fr_1.1fr] md:p-10">
          <div>
            <p
              data-contact-reveal
              className="mb-4 text-xs font-semibold tracking-[0.26em] text-accent-soft uppercase"
            >
              Contact Concierge
            </p>
            <h2
              data-contact-reveal
              className="display-title text-4xl font-semibold text-pearl md:text-5xl"
            >
              Arrange a Private Consultation
            </h2>
            <p
              data-contact-reveal
              className="mt-5 max-w-md text-sm leading-relaxed text-mist/90 md:text-base"
            >
              Share your preferred specification and our concierge team will contact
              you within 24 hours for availability and bespoke commissioning.
            </p>
            <div data-contact-reveal className="mt-8 space-y-2 text-sm text-platinum/90">
              <p>+1 (310) 555-0187</p>
              <p>concierge@auroramotors.com</p>
              <p>West Hollywood, California</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div data-contact-reveal>
              <label
                htmlFor="name"
                className="mb-2 block text-xs tracking-[0.18em] text-platinum uppercase"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-pearl outline-none transition focus:border-accent"
                placeholder="Alex Morgan"
              />
              {errors.name && <p className="mt-1 text-xs text-red-300">{errors.name}</p>}
            </div>

            <div data-contact-reveal>
              <label
                htmlFor="email"
                className="mb-2 block text-xs tracking-[0.18em] text-platinum uppercase"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-pearl outline-none transition focus:border-accent"
                placeholder="alex@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-300">{errors.email}</p>
              )}
            </div>

            <div data-contact-reveal>
              <label
                htmlFor="model"
                className="mb-2 block text-xs tracking-[0.18em] text-platinum uppercase"
              >
                Preferred Model
              </label>
              <input
                id="model"
                name="model"
                value={values.model}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-pearl outline-none transition focus:border-accent"
                placeholder="Aurora Velocity GT"
              />
              {errors.model && (
                <p className="mt-1 text-xs text-red-300">{errors.model}</p>
              )}
            </div>

            <div data-contact-reveal>
              <label
                htmlFor="message"
                className="mb-2 block text-xs tracking-[0.18em] text-platinum uppercase"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={values.message}
                onChange={handleChange}
                rows={5}
                className="w-full resize-none rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-pearl outline-none transition focus:border-accent"
                placeholder="I am interested in a fully bespoke specification with carbon ceramic package."
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-300">{errors.message}</p>
              )}
            </div>

            <div data-contact-reveal className="pt-2">
              <button
                type="submit"
                className="accent-ring w-full rounded-full bg-accent px-6 py-3 text-xs font-semibold tracking-[0.22em] text-black uppercase transition hover:-translate-y-0.5 hover:bg-accent-soft"
              >
                Submit Inquiry
              </button>
              {isSubmitted === "success" && (
                <p className="mt-3 text-xs text-emerald-300">
                  Request received. A concierge specialist will contact you shortly.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
