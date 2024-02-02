import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia("only screen and (max-width : 767px)");
    const callback = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    if (matchMedia.matches) {
      setIsMobile(true);
    }

    matchMedia.addEventListener("change", callback);

    return () => {
      matchMedia.removeEventListener("change", callback);
    };
  }, []);

  return {
    isMobile,
  };
};

export const useCreateQueryString = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (querylist: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const query of querylist) {
        params.set(query.name, query.value);
      }

      return pathname + "?" + params.toString();
    },
    [pathname, searchParams],
  );

  return {
    createQueryString,
  };
};
