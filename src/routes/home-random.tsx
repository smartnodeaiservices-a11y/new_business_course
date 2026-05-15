import { Navigate, useSearchParams } from "react-router-dom";

const VARIANT_PATHS = ["/lp/v1", "/lp/v2", "/lp/v3", "/lp/v4", "/lp/v5"] as const;

/**
 * "/" picks a random landing variant and redirects so the URL actually shows
 * /lp/vX. Every click of the Home link gets a fresh draw — variant is not
 * memoized across renders. `?v=N` (1..5) pins a specific variant for testing.
 */
export default function RandomVariantHome() {
  const [search] = useSearchParams();
  const pinned = search.get("v");
  const pinnedIdx =
    pinned && /^[1-5]$/.test(pinned) ? Number(pinned) - 1 : null;
  const idx =
    pinnedIdx ?? Math.floor(Math.random() * VARIANT_PATHS.length);
  return <Navigate to={VARIANT_PATHS[idx]} replace />;
}
