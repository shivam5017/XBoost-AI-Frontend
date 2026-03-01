export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Effective date: March 1, 2026</p>
        <div className="space-y-5 text-sm leading-7">
          <p>
            XBoost AI (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) provides AI writing tools for X.com.
          </p>
          <p>
            We collect only data necessary to provide the service:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Account data (email, username)</li>
            <li>User-submitted content for AI generation (prompts, drafts, selected options)</li>
            <li>Subscription and usage metadata</li>
          </ul>
          <p>
            We do not sell personal data.
          </p>
          <p>
            We do not access browsing activity outside approved extension functionality.
          </p>
          <p>
            We use data solely to deliver requested features, enforce plan limits, secure
            accounts, and improve reliability.
          </p>
          <p>
            Users control what they publish; generated content is editable before posting.
          </p>
          <p>
            For support or deletion requests:{" "}
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
