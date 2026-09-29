import { redirect } from "next/navigation";

export default async function LegacySeminarRegistration({
  params,
}: {
  params: Promise<{ seminarId: string }>;
}) {
  const { seminarId } = await params;
  redirect(`/auth/RegisterStudent?seminarId=${encodeURIComponent(seminarId)}`);
}