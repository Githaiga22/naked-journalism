"use client";

import { useState, FormEvent } from "react";
import { X, Sparkles, Check, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "../Button";

interface WaitlistModalProps {
  onClose: () => void;
}

export function WaitlistModal({ onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    interests: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        // Handle specific error cases
        if (response.status === 409) {
          setErrors({ submit: "This email is already on the waitlist!" });
        } else if (data.error) {
          setErrors({ submit: data.error });
        } else {
          setErrors({ submit: "Failed to join waitlist. Please try again." });
        }
      }
    } catch (error) {
      console.error("Error submitting waitlist:", error);
      setErrors({ submit: "Network error. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="relative bg-bg-surface rounded-xl p-8 lg:p-10 max-w-md w-full shadow-2xl border border-bg-elevated animate-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
          >
            <X size={24} />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-accent-success/20 rounded-full flex items-center justify-center">
              <Check className="text-accent-success" size={32} />
            </div>

            <h2 className="text-3xl font-bold mb-4">Welcome Aboard!</h2>

            <p className="text-text-secondary mb-6">
              Thank you for joining our vision. We'll send you exclusive updates as we prepare
              for our April 1st launch.
            </p>

            <div className="bg-bg-dark rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-text-muted mb-2">Keep an eye on your inbox for:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  Early access invitation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  Platform updates
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  Launch announcements
                </li>
              </ul>
            </div>

            <Button onClick={onClose} variant="primary" className="w-full mb-4">
              Close
            </Button>

            <div>
              <p className="text-sm text-text-muted mb-3">Follow us:</p>
              <div className="flex justify-center gap-4">
                <a href="#" className="text-text-secondary hover:text-accent-info transition-colors">
                  <Twitter size={24} />
                </a>
                <a href="#" className="text-text-secondary hover:text-accent-info transition-colors">
                  <Linkedin size={24} />
                </a>
                <a href="#" className="text-text-secondary hover:text-accent-info transition-colors">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative bg-bg-surface rounded-xl p-8 lg:p-10 max-w-lg w-full shadow-2xl border border-bg-elevated">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-brand-orange" size={28} />
            <h2 className="text-3xl font-bold">Join Our Vision</h2>
          </div>

          <p className="text-text-secondary mb-2">
            Be part of reshaping journalism in Africa. We're launching{" "}
            <span className="text-accent-warning font-semibold">April 1st</span>!
          </p>

          <p className="text-sm text-text-muted">
            Join the waitlist to get early access and exclusive updates as we build a platform
            where truth matters more than influence.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Full Name <span className="text-accent-error">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 bg-bg-dark border-2 border-bg-elevated rounded-lg text-text-primary placeholder:text-text-muted focus:border-brand-orange focus:outline-none transition-colors"
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-xs text-accent-error mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Email Address <span className="text-accent-error">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-bg-dark border-2 border-bg-elevated rounded-lg text-text-primary placeholder:text-text-muted focus:border-brand-orange focus:outline-none transition-colors"
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-xs text-accent-error mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Phone Number <span className="text-accent-error">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-bg-dark border-2 border-bg-elevated rounded-lg text-text-primary placeholder:text-text-muted focus:border-brand-orange focus:outline-none transition-colors"
              placeholder="+254 XXX XXX XXX"
            />
            {errors.phone && <p className="text-xs text-accent-error mt-1">{errors.phone}</p>}
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm text-text-secondary mb-3">I'm interested as:</label>
            <div className="space-y-2">
              {["Journalist/Creator", "Reader/Supporter", "Both"].map((interest) => (
                <label
                  key={interest}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                    className="w-5 h-5 rounded border-2 border-bg-elevated bg-bg-dark checked:bg-brand-orange checked:border-brand-orange focus:ring-2 focus:ring-brand-orange/50 cursor-pointer transition-colors"
                  />
                  <span className="text-text-primary group-hover:text-brand-orange transition-colors">
                    {interest}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {errors.submit && (
            <div className="bg-accent-error/10 border border-accent-error rounded-lg p-3">
              <p className="text-sm text-accent-error">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Joining..." : "Join Waitlist →"}
            </Button>
          </div>

          <p className="text-center text-sm text-accent-warning font-medium">
            Launch Date: April 1st, 2026
          </p>
        </form>
      </div>
    </div>
  );
}
