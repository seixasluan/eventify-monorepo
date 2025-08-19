// next
import Link from "next/link";

export const BackToHome = () => {
  return (
    <Link href="/" className="text-indigo-700 font-bold hover:underline">
      {"˂ Back"}
    </Link>
  );
};
