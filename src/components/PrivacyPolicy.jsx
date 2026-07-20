/*
 * DRAFT — This privacy policy is a starting structure written for
 * codebase scaffolding purposes. It requires real legal review
 * before the site is made publicly available. Do not treat this
 * as compliant legal copy.
 */

export default function PrivacyPolicy({ onNavigate }) {
  return (
    <main className="privacy-policy-page">
      <div className="draft-notice">
        DRAFT — This privacy policy is a structural starting point and needs
        independent legal review before launch. It is not compliant legal copy.
      </div>

      <button className="back-to-store-btn" onClick={() => onNavigate('catalog')} type="button">
        ← Back to Store
      </button>

      <h1>Privacy Policy</h1>
      <p className="privacy-updated">Last updated: July 2026</p>

      <section>
        <h2>1. Information We Collect</h2>

        <h3>Contact Form</h3>
        <p>
          When you submit a contact form, we collect your name, email address, and message content.
          This data is sent to Formspree, a third-party form processing service, for delivery to our
          support team. We do not store this data on our own servers.
        </p>

        <h3>Order Checkout</h3>
        <p>
          When you place a mock order, order details are held temporarily in memory during your session
          to process the order demonstration. Payment details are not stored or transmitted to any server.
        </p>

        <h3>Automatically Collected Data</h3>
        <p>
          Our hosting provider, Vercel Inc., automatically collects standard server logs
          including IP addresses, request timestamps, browser user-agent strings, and
          referring URLs. Vercel&apos;s data handling is governed by their own privacy policy.
        </p>
      </section>

      <section>
        <h2>2. Cookies &amp; Local Storage</h2>
        <p>
          This site does not deploy tracking cookies, analytics scripts, advertising pixels,
          or third-party embedding services. The following browser storage is used:
        </p>
        <ul>
          <li><strong>localStorage (theme)</strong> — Remembers your light/dark mode preference.</li>
          <li><strong>localStorage (cart)</strong> — Persists your shopping cart contents between sessions.</li>
          <li><strong>localStorage (cookie_consent_v1)</strong> — Records your cookie consent choice so the banner does not reappear.</li>
        </ul>
        <p>
          The <code>@vercel/analytics</code> package is bundled but only activates if you accept
          cookies. If accepted, Vercel Analytics collects anonymised page-view data
          (no personal information, no cross-site tracking).
        </p>
      </section>

      <section>
        <h2>3. Third-Party Services</h2>
        <ul>
          <li>
            <strong>Vercel Inc.</strong> — Hosting and infrastructure. Vercel may log IP addresses
            and request metadata as part of standard operations. See{' '}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              Vercel&apos;s Privacy Policy
            </a>.
          </li>
          <li>
            <strong>Formspree</strong> — Contact form submission processing. Formspree receives the
            name, email, and message you submit. See{' '}
            <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
              Formspree&apos;s Privacy Policy
            </a>.
          </li>
          <li>
            <strong>Google Fonts</strong> — The Outfit font is loaded from Google Fonts. Google may
            log your IP address when the font is requested. See{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google&apos;s Privacy Policy
            </a>.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Your Rights</h2>
        <p>
          Depending on your jurisdiction, you may have the right to access, correct, or delete
          personal data we hold about you. You may also withdraw consent to analytics at any time
          via the Cookie Preferences link in the site footer.
        </p>
        <p>
          To exercise these rights, contact us using the details below. We will respond within 30
          days.
        </p>
      </section>

      <section>
        <h2>5. Contact</h2>
        <p>
          For privacy-related inquiries or data requests:
        </p>
        <p>
          Email: <code>dimze [at] proton [dot] me</code>
        </p>
      </section>
    </main>
  );
}