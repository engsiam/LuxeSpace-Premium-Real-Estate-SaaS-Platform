'use client';

import { motion } from 'framer-motion';
import { Cookie, Shield, Eye, Settings } from 'lucide-react';
import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Cookie className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground text-lg">How we use cookies to enhance your experience</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              What Are Cookies?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files stored on your device when you visit websites. 
              They help remember your preferences, analyze site traffic, and provide personalized content.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-primary" />
              How We Use Cookies
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span><strong>Essential cookies:</strong> Required for basic site functionality and security</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span><strong>Analytics cookies:</strong> Help us understand how visitors interact with our site</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span><strong>Marketing cookies:</strong> Used to deliver relevant ads and track campaign performance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span><strong>Preference cookies:</strong> Remember your settings and personalization choices</span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Settings className="w-6 h-6 text-primary" />
              Managing Your Cookies
            </h2>
            <p className="text-muted-foreground mb-4">
              You can control or delete cookies at any time through your browser settings. 
              Here's how for popular browsers:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-xl">
                <h4 className="font-bold mb-2">Chrome</h4>
                <p className="text-sm text-muted-foreground">Settings → Privacy → Clear browsing data</p>
              </div>
              <div className="p-4 bg-background rounded-xl">
                <h4 className="font-bold mb-2">Firefox</h4>
                <p className="text-sm text-muted-foreground">Options → Privacy → Clear Data</p>
              </div>
              <div className="p-4 bg-background rounded-xl">
                <h4 className="font-bold mb-2">Safari</h4>
                <p className="text-sm text-muted-foreground">Preferences → Privacy → Manage Data</p>
              </div>
              <div className="p-4 bg-background rounded-xl">
                <h4 className="font-bold mb-2">Edge</h4>
                <p className="text-sm text-muted-foreground">Settings → Privacy → Clear browsing data</p>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground mb-4">
              We may allow third-party service providers to place cookies on your device for:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Google Analytics for traffic analysis</li>
              <li>• Facebook Pixel for marketing optimization</li>
              <li>• Payment processors for secure transactions</li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Cookie Policy periodically. Any changes will be posted on this page 
              with an updated "Last Modified" date. We encourage you to review this policy regularly.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Last Modified:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </section>

          <div className="flex flex-wrap gap-4 pt-8">
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy →
            </Link>
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service →
            </Link>
            <Link href="/contact" className="text-primary hover:underline">
              Contact Us →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}