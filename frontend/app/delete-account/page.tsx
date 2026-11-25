import Link from "next/link";

const supportEmail = "info.aryahs@gmail.com";
const requestSubject = encodeURIComponent("EduLeader Global account deletion request");
const requestBody = encodeURIComponent(
  "Please help me request deletion of my EduLeader Global account. I am contacting you from the email address associated with the account."
);

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] px-5 py-16 text-[#3C2A21] md:px-10 md:py-24">
      <article className="mx-auto max-w-4xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#9A7A43]">
          EduLeader Global
        </p>
        <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
          Request account deletion
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-[#6B5E51] md:text-lg">
          You can delete your EduLeader Global account on the website without
          reinstalling the mobile app. If you cannot sign in, contact our
          support team from the email address registered to your account.
        </p>

        <section className="mt-10 rounded-3xl border border-[#E8DFD2] bg-white p-6 shadow-sm md:p-9">
          <h2 className="font-serif text-2xl font-bold md:text-3xl">
            Delete through your account
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-6 text-sm leading-6 text-[#5D5348] md:text-base">
            <li>
              Sign in to EduLeader Global on the web using your account
              credentials.
            </li>
            <li>
              Open <strong>Edit Profile</strong> from your student dashboard.
            </li>
            <li>
              Choose <strong>Delete Account</strong>, review the confirmation,
              type <strong>DELETE</strong>, and confirm.
            </li>
          </ol>
          <Link
            href="/auth/login?redirect=%2FUser%2Fedit-profile"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#3C2A21] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5C4033] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059]"
          >
            Sign in to manage your account
          </Link>
        </section>

        <section className="mt-6 rounded-3xl border border-[#E8DFD2] bg-white p-6 shadow-sm md:p-9">
          <h2 className="font-serif text-2xl font-bold md:text-3xl">
            Delete selected profile information
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#5D5348] md:text-base">
            To remove an individual profile entry without closing your
            account, sign in to the website, open Edit Profile, and remove the
            selected entry where that control is available. If you cannot
            remove the information yourself, contact support using the request
            option below.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-[#E8DFD2] bg-white p-6 shadow-sm md:p-9">
          <h2 className="font-serif text-2xl font-bold md:text-3xl">
            Need help signing in?
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#5D5348] md:text-base">
            Email us from the email address associated with your EduLeader
            Global account and ask for help with account deletion. We will
            verify account ownership before helping with the request. For
            privacy, we do not confirm whether an email address is registered
            to an account. Do not email your password or one-time verification
            codes.
          </p>
          <a
            href={"mailto:" + supportEmail + "?subject=" + requestSubject + "&body=" + requestBody}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl border border-[#C5A059] px-6 py-3 text-sm font-semibold text-[#3C2A21] transition hover:bg-[#F8F3E9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059]"
          >
            Email {supportEmail}
          </a>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-bold md:text-3xl">
            Information affected by deletion
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#5D5348] md:text-base">
            The current account deletion process removes the account record
            (including profile and academic details stored in that record),
            associated activity and progress records, matching booking and
            receipt records, the Apple subscription record, and usage
            reservations. The account deletion code retains payment
            transactions, payment attempts, membership history, and Apple
            subscription event audit records for financial and audit purposes.
            The code does not define a fixed retention period for those
            records.
          </p>
          <p className="mt-4 text-sm leading-6 text-[#5D5348] md:text-base">
            The current deletion endpoint does not explicitly remove uploaded
            files stored in the separate student_documents file store, and it
            does not remove references to an account in research groups. We are
            reviewing these items; we cannot state that they are deleted by
            the current account deletion flow. Contact support if you need
            assistance with a deletion request.
          </p>
          <p className="mt-4 text-sm leading-6 text-[#5D5348] md:text-base">
            For questions, contact{" "}
            <a
              href={"mailto:" + supportEmail}
              className="font-semibold text-[#8A6A31] underline underline-offset-4"
            >
              {supportEmail}
            </a>{" "}
            or call +91 86578 69659. See our{" "}
            <Link
              href="/privacy-policy"
              className="font-semibold text-[#8A6A31] underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
