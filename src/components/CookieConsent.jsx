export default function CookieConsent({ visible, onAccept, onReject, onPrivacy }) {
  if (!visible) return null;

  return (
    <div className="cookie-consent-overlay" role="dialog" aria-label="Cookie consent">
      <div className="cookie-consent-banner">
        <p className="cookie-consent-text">
          This site uses cookies to improve your experience and help us understand how you use the site.{' '}
          <button className="cookie-consent-link" onClick={onPrivacy} type="button">
            Privacy Policy
          </button>
        </p>
        <div className="cookie-consent-actions">
          <button className="cookie-btn cookie-btn-accept" onClick={onAccept} type="button">
            Accept
          </button>
          <button className="cookie-btn cookie-btn-reject" onClick={onReject} type="button">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
