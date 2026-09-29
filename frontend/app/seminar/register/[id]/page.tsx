import { redirect } from "next/navigation";

export default async function LegacySeminarRegistration({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/auth/RegisterStudent?seminarId=${encodeURIComponent(id)}`);
}