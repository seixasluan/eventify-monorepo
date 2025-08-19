import Link from "next/link";

export const CTABottomSection = () => {
  return (
    <section className="bg-indigo-600 text-white py-12 px-4 text-center">
      <h2 className="text-2xl font-semibold mb-2">
        Ready to join the best events?
      </h2>
      <p className="mb-4">Sign up today and get started in seconds.</p>
      <Link
        href="/register"
        className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-100 transition"
      >
        Create Account
      </Link>
    </section>
  );
};
