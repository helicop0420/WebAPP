import Image from "next/image";
import { useGlobalState } from "www/shared/modules/global_context";

export function SecuritySettings() {
  const loading = useGlobalState((s) => s.loading);
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-50 px-2 py-3 rounded flex flex-col">
        <h3 className="text-xl mb-3">Connected Accounts</h3>
        <button
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold focus:outline-none focus:shadow-outline px-4 py-2 rounded-full flex items-center justify-center"
        >
          <Image
            className="bg-white rounded-full"
            src="/google.svg"
            alt=""
            height={24}
            width={24}
          />
          &nbsp; Connect Google Account
        </button>
      </div>

      <form
        onSubmit={(evt) => {
          evt.preventDefault();
        }}
        className="bg-slate-50 px-2 py-3 rounded flex flex-col"
      >
        <h3 className="text-xl mb-4">Update Password</h3>

        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Current Password
          </label>
          <input
            className="bg-slate-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            name="current_password"
            type="password"
            placeholder="******************"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            New Password
          </label>
          <input
            className="bg-slate-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            name="new_password"
            type="password"
            placeholder="******************"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3 flex gap-3 justify-end">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {loading ? "Working..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
