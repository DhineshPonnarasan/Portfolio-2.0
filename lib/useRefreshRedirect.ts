import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useRefreshRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && performance?.navigation?.type === 1) {
      // TYPE_RELOAD = 1
      router.push("/");
    }
  }, [router]);
}
