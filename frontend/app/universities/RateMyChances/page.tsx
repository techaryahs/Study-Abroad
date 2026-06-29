import type { Metadata } from "next";
import RateMyChances from "./RateMyChances";

export const metadata: Metadata = {
  title:
    "RateMyChances by EduLeaderGlobal | AI University Admit Predictor",

  description:
    "RateMyChances by EduLeaderGlobal uses AI-powered analysis to evaluate your university admission probability for top global universities and programs.",
};

export default function Page() {
  return <RateMyChances />;
}