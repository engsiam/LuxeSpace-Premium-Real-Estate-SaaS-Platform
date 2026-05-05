'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, User, Mail, Phone, MapPin, Database, Bell } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">Your privacy matters to us. Learn how we protect your data.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <User className="w-6 h-6 text-primary" />
              Information We Collect
            </h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us and data automatically collected when you use our services.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Personal Information
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Name and email address</li>
                  <li>• Phone number</li>
                  <li>• Profile information</li>
                  <li>• Payment details (processed securely)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" /> Automatically Collected
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Device and browser information</li>
                  <li>• IP address and location data</li>
                  <li>• Usage patterns and preferences</li>
                  <li>• Cookies and similar technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary" />
              How We Use Your Information
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span>Provide, maintain, and improve our services</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span>Process transactions and send related information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span>Send you technical notices, updates, and support messages</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span>Respond to your comments and questions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span>Communicate with you about products, services, and events</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span>Monitor and analyze trends, usage, and activities</span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-primary" />
              Information Sharing
            </h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or otherwise transfer your personal information to outside parties except in the following circumstances:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span><strong>Service Providers:</strong> Trusted third parties who assist in operating our website and conducting business</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span><strong>Legal Compliance:</strong> When required by law or in response to valid requests</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span><strong>Business Transfers:</strong> In connection with merger, sale, or asset transfer</span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              Your Rights
            </h2>
            <p className="text-muted-foreground mb-4">
              You have the following rights regarding your personal information:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-xl">
                <h4 className="font-bold mb-2">Access</h4>
                <p className="text-sm text-muted-foreground">Request a copy of the personal data we hold about you</p>
              </div>
              <div className="p-4 bg-background rounded-xl">
                <h4 className="font-bold mb-2">Correction</h4>
                <p className="text-sm text-muted-foreground">Request correction of inaccurate personal data</p>
              </div>
              <div className="p-4 bg-background rounded-xl">
                <h4 className="font-bold mb-2">Deletion</h4>
                <p className="text-sm text-muted-foreground">Request deletion of your personal data</p>
              </div>
              <div className="p-4 bg-background rounded-xl">
                <h4 className="font-bold mb-2">Opt-Out</h4>
                <p className="text-sm text-muted-foreground">Unsubscribe from marketing communications</p>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to protect your personal information, 
              including encryption, secure sockets layer (SSL) technology, and regular security audits.
            </p>
            <p className="text-muted-foreground">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, 
              we cannot guarantee absolute security.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are not intended for individuals under the age of 13. We do not knowingly collect 
              personal information from children under 13. If you become aware that a child has provided us 
              with personal information, please contact us.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /> support@luxespace.com</p>
              <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary" /> +880 1234 567890</p>
              <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /> Dhaka, Bangladesh</p>
            </div>
          </section>

          <div className="flex flex-wrap gap-4 pt-8">
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service →
            </Link>
            <Link href="/cookies" className="text-primary hover:underline">
              Cookie Policy →
            </Link>
            <Link href="/contact" className="text-primary hover:underline">
              Contact Us →
            </Link>
          </div>

          <p className="text-sm text-muted-foreground pt-4">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
      </div>
    </div>
  );
}