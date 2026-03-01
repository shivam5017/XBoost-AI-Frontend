export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Effective date: March 1, 2026</p>
        <div className="space-y-5 text-sm leading-7">
          <p>
            XBoost AI uses cookies and similar storage technologies only where needed to
            provide account and product functionality.
          </p>
          <p>Cookie categories we use:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Essential cookies: authentication, session continuity, and account security.
            </li>
            <li>
              Functional cookies: remembering product preferences and UI settings.
            </li>
            <li>
              Limited operational analytics: reliability and performance measurement.
            </li>
          </ul>
          <p>
            We do not use third-party advertising cookies and we do not sell personal data.
          </p>
          <p>
            Disabling essential cookies may prevent login, billing, or core product
            features from functioning correctly.
          </p>
          <p>
            For cookie or privacy requests:{" "}
            <a
              href="mailto:shivammalik962@gmail.com"
              className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
            >
              shivammalik962@gmail.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
