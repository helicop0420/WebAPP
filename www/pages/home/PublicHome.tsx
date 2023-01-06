import Link from "next/link";

export default function PublicHome() {
  return (
    <div className="flex flex-col flex-grow gap-3 items-center justify-center">
      <h1 className="text-3xl">Welcome to Elmbase</h1>
      <Link href="/login">
        <button className="bg-slate-200 px-4 py-1 rounded-full hover:text-gray-900">
          Sign in
        </button>
      </Link>
      <Link href="/signup">
        <button className="bg-slate-200 px-4 py-1 rounded-full hover:text-gray-900">
          Create Account
        </button>
      </Link>
    </div>
  );
}
