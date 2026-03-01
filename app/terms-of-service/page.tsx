export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Effective date: March 1, 2026</p>
        <div className="space-y-5 text-sm leading-7">
          <p>
            By using XBoost AI, you agree to these Terms and to use the service lawfully.
          </p>
          <p>
            You are responsible for generated and published content from your account.
            XBoost AI assists with drafting and rewriting, but does not guarantee
            engagement, reach, or business outcomes.
          </p>
          <p>
            You agree to follow X platform rules and applicable developer policies.
            XBoost AI is not affiliated with X.
          </p>
          <p>
            Paid plans are billed through Dodo Payments and renew by plan interval unless
            canceled. You can cancel anytime; access remains until the end of the current
            billing period.
          </p>
          <p>
            We may suspend or terminate access for abuse, fraud, non-payment, policy
            violations, or attempts to compromise service integrity.
          </p>
          <p>
            For support or legal requests:{" "}
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
