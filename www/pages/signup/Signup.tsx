import Link from "next/link";
import { useState } from "react";
import PageCenteredCard from "www/shared/components/layout/PageCenteredCard";
import { LoadingItem, useGlobalState } from "www/shared/modules/global_context";

interface SignUpForm {
  name: { value: string };
  username: { value: string };
  password: { value: string };
}

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const loading = useGlobalState((s) => s.loading);
  const promiseLoadingHelper = useGlobalState((s) => s.promiseLoadingHelper);
  const signupLoadingItem: LoadingItem = { componentName: "signup" };
  const signUp = async (form: SignUpForm) => {
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({
          email: form.username.value,
          password: form.password.value,
          name: form.name.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonResp = (await resp.json()) as { message: string };
      if (resp.status >= 200 && resp.status < 300) {
        setSuccess(jsonResp.message);
      } else {
        setError(jsonResp.message || "Error creating user");
      }
    } catch (err) {
      console.error(err);
      setError("Error creating user");
    }
  };

  return (
    <PageCenteredCard>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Sign Up</div>
        <div>Create your account</div>
      </div>
      <form
        className="px-6 pt-2 pb-8 mb-4"
        onSubmit={(evt) => {
          evt.preventDefault();
          signUp(evt.currentTarget as any as SignUpForm).finally(
            promiseLoadingHelper(signupLoadingItem)
          );
        }}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Full Name
          </label>
          <input
            className="bg-slate-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="name"
            type="text"
            placeholder="example@mail.com"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            className="bg-slate-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="username"
            type="email"
            placeholder="example@mail.com"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            className="bg-slate-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            name="password"
            type="password"
            placeholder="******************"
            required
            disabled={loading}
          />
        </div>
        {error !== null && (
          <div className="flex px-6 py-2 rounded bg-red-100 text-red-800">
            {error}
          </div>
        )}
        {success !== null && (
          <div className="flex px-6 py-2 rounded bg-green-100 text-green-800">
            {success}
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <p className="inline-block align-baseline text-sm">
            Already have an account?&nbsp;
            <Link href="/login">
              <span className="inline-block font-bold text-green-600 hover:text-green-800 cursor-pointer">
                Login
              </span>
            </Link>
          </p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {loading ? "Working..." : "Sign Up"}
          </button>
        </div>
      </form>
    </PageCenteredCard>
  );
}
