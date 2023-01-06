import { useGlobalState } from "www/shared/modules/global_context";

export function AccountPreferences() {
  const loading = useGlobalState((s) => s.loading);
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-50 px-2 py-3 rounded flex flex-col">
        <h3 className="text-xl mb-3">Account Details</h3>
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            className="bg-slate-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Full Name"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Headline
          </label>
          <input
            className="bg-slate-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Career summary..."
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Industry
          </label>
          <input
            className="bg-slate-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Ex: Retail"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3 flex gap-3 justify-end">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {loading ? "Working..." : "Update Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
