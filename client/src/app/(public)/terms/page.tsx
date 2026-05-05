'use client';

import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">Please read our terms carefully before using our services.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Scale className="w-6 h-6 text-primary" />
              Acceptance of Terms
            </h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using LuxeSpace, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily use LuxeSpace for personal, non-commercial transitory viewing only. 
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Modify or copy the materials</span>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Use the materials for any commercial purpose</span>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Transfer the materials to another person</span>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Attempt to reverse engineer any software on the website</span>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">User Account Responsibilities</h2>
            <p className="text-muted-foreground mb-4">
              When you create an account on LuxeSpace, you are responsible for:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Maintaining the security of your account credentials</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Providing accurate and complete registration information</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Promptly updating your account information when changes occur</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Taking responsibility for all activities under your account</span>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Property Listings</h2>
            <p className="text-muted-foreground mb-4">
              LuxeSpace provides a platform for property listings. We do not own, sell, or guarantee the properties listed. 
              Users are responsible for:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Verifying property details before making any commitments</li>
              <li>• Conducting due diligence on all transactions</li>
              <li>• Complying with local laws and regulations regarding real estate</li>
              <li>• Reporting any fraudulent or suspicious listings</li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Prohibited Activities</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to engage in any of the following activities:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                <h4 className="font-bold text-rose-500 mb-2">Illegal Activities</h4>
                <p className="text-sm text-muted-foreground">Using the site for any illegal purpose</p>
              </div>
              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                <h4 className="font-bold text-rose-500 mb-2">Spam</h4>
                <p className="text-sm text-muted-foreground">Posting spam or promotional content</p>
              </div>
              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                <h4 className="font-bold text-rose-500 mb-2">Impersonation</h4>
                <p className="text-sm text-muted-foreground">Pretending to be another person or entity</p>
              </div>
              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                <h4 className="font-bold text-rose-500 mb-2">Harassment</h4>
                <p className="text-sm text-muted-foreground">Threatening or abusing other users</p>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              LuxeSpace shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  We do not guarantee the accuracy, completeness, or reliability of any property listings or user content. 
                  Any reliance you place on such information is at your own risk.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify, defend, and hold harmless LuxeSpace and its officers, directors, employees, 
              agents, and affiliates from and against any and all claims, damages, obligations, losses, liabilities, 
              costs, or debt arising from your use of the service or violation of these terms.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason, 
              including breach of these Terms. Upon termination, your right to use the service will immediately cease.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will provide notice of any material changes 
              by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the 
              service after such changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of Bangladesh, 
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us at support@luxespace.com
            </p>
          </section>

          <div className="flex flex-wrap gap-4 pt-8">
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy →
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