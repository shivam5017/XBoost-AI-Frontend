export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: March 1, 2026</p>
        <div className="space-y-5 text-sm leading-7">
          <p>
            XBoost AI processes only the minimum data needed to provide product features.
            We do not sell personal data.
          </p>
          <p>
            Account data: email, username, authentication cookies, usage counters, and billing
            status. AI API keys are stored encrypted at rest.
          </p>
          <p>
            Content data: text you explicitly submit for generation, rewrite, or analysis.
            We do not auto-read private messages.
          </p>
          <p>
            You can request account deletion by contacting support. Deletion removes profile,
            usage records, and billing references not required for compliance.
          </p>
        </div>
      </div>
    </main>
  );
}

