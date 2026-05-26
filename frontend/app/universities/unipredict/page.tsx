import type { Metadata } from "next";
import UniPredictClient from "./UniPredictClient";

export const metadata: Metadata = {
  title:
    "UniPredict by International Eduleader Council | Predict Your University Admission Chances",

  description:
    "Use UniPredict by IEC – International Eduleader Council to estimate your admission chances at top universities worldwide based on your academic profile and scores.",
};

export default function Page() {
  return <UniPredictClient />;
}