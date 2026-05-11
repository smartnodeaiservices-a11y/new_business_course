import { useMemo } from "react";
import LandingV1 from "./lp/v1";
import LandingV2 from "./lp/v2";
import LandingV3 from "./lp/v3";
import LandingV4 from "./lp/v4";
import LandingV5 from "./lp/v5";

const VARIANTS = [LandingV1, LandingV2, LandingV3, LandingV4, LandingV5] as const;

export default function RandomVariantHome() {
  const Variant = useMemo(() => {
    const idx = Math.floor(Math.random() * VARIANTS.length);
    return VARIANTS[idx];
  }, []);
  return <Variant />;
}
