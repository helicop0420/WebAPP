import { useGlobalState } from "www/shared/modules/global_context";
import styles from "./loading.module.css";

export function TopLoadingBar() {
  const loading = useGlobalState((s) => s.loading);
  return (
    <div className="w-full flex justify-center max-h-0.5 -mt-0.5">
      <div className={`${loading ? styles.loading_bar : ""} h-0.5`}></div>
    </div>
  );
}
