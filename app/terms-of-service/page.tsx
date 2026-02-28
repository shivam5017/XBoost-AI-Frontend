export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: March 1, 2026</p>
        <div className="space-y-5 text-sm leading-7">
          <p>
            By using XBoost AI, you agree to use the service lawfully and in compliance
            with platform rules, including X terms and developer policies.
          </p>
          <p>
            You are responsible for content generated and posted from your account.
            XBoost AI provides assistance and does not guarantee engagement outcomes.
          </p>
          <p>
            Subscription billing is managed through Dodo Payments. Paid access renews per
            selected plan until cancellation.
          </p>
          <p>
            We may suspend access for abuse, fraud, or attempts to compromise platform or
            service integrity.
          </p>
        </div>
      </div>
    </main>
  );
}

