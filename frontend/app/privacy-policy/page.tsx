import type { ReactNode } from "react";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="space-y-3">
    <h2 className="font-serif text-2xl font-bold text-[#3C2A21] md:text-3xl">
      {title}
    </h2>
    <div className="space-y-3 text-sm leading-7 text-[#6B5E51] md:text-base">
      {children}
    </div>
  </section>
);

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] px-5 py-16 text-[#3C2A21] md:px-10 md:py-24">
      <article className="mx-auto max-w-5xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#9A7A43]">
          Aryahs World Infotech (OPC) Pvt. Ltd.
        </p>
        <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-5 max-w-4xl text-base leading-7 text-[#6B5E51] md:text-lg">
          This policy describes how EduLeader Global handles information when
          you use our website and mobile application, create an account, build
          a student profile, request counselling, join a meeting, or use
          payment-enabled services.
        </p>

        <div className="mt-12 space-y-10">
          <Section title="Information we handle">
            <p>
              Depending on the features you use, we may handle your name,
              email address, phone number, password credential, date of birth,
              gender, country, state, location entered in your profile, and
              account identifiers. Passwords are stored as bcrypt hashes in
              the backend; do not send your password or one-time codes to
              support.
            </p>
            <p>
              Student profiles can include education history, test scores,
              work experience, research, projects, target universities,
              achievements, biographies, profile images, resumes, and other
              documents you choose to upload. Counselling, booking, session,
              membership, and service records may also be processed.
            </p>
          </Section>

          <Section title="Meetings, messages, and device permissions">
            <p>
              When you use meeting or real-time communication features, the
              service uses WebRTC and Socket.IO signaling to connect
              participants and relay real-time messages. We found no
              server-side meeting recording in the reviewed implementation.
              Camera and microphone access is used for those features when
              you grant permission. The app does not request device GPS
              location in the reviewed Android manifest; location details
              may be entered in your profile.
            </p>
          </Section>

          <Section title="Payments and service providers">
            <p>
              If you use a payment-enabled service, payment details such as
              transaction identifiers, amount, currency, status, plan or
              purchased item, and related account identifiers may be recorded
              for processing and reconciliation. Payment credentials are
              handled by the payment provider; EduLeader Global does not need
              your card password or banking OTP. The reviewed code integrates
              Razorpay for payment flows.
            </p>
            <p>
              The reviewed system uses MongoDB Atlas for database storage,
              Gmail SMTP for email delivery, MSG91 for SMS OTP delivery,
              Razorpay for payments, and Vercel deployment configuration for
              web/backend delivery. Those providers process information as
              needed to provide their services, subject to their own terms and
              privacy practices. The reviewed Flutter dependencies did not
              show Firebase, analytics, or crash-reporting SDKs. The website
              separately loads Google Analytics.
            </p>
          </Section>

          <Section title="How we use information">
            <ul className="list-disc space-y-2 pl-6">
              <li>Create and authenticate student and other user accounts.</li>
              <li>Maintain profiles, academic records, and uploaded materials.</li>
              <li>Respond to counselling enquiries and manage bookings or sessions.</li>
              <li>Provide membership, service, and payment functionality.</li>
              <li>Send verification codes, account notices, and service messages.</li>
              <li>Protect the service, prevent abuse, and maintain transaction records.</li>
            </ul>
          </Section>

          <Section title="Security and storage">
            <p>
              The app communicates with its production API over HTTPS, and
              the reviewed Android networking code validates trusted server
              certificates. The backend connects to MongoDB Atlas using TLS.
              Passwords are hashed, and the mobile app stores its session
              token using secure storage. We have not established from the
              repository a complete encryption-at-rest configuration for
              every data store, backup, or provider, so we do not make a
              blanket at-rest encryption claim.
            </p>
          </Section>

          <Section title="Account deletion and retained information">
            <p>
              You can request account deletion through the website or from
              within the app. On the website, sign in, open Edit Profile,
              choose Delete Account, type DELETE, and confirm. If you cannot
              sign in, contact{" "}
              <a
                href="mailto:info.aryahs@gmail.com"
                className="font-semibold text-[#8A6A31] underline underline-offset-4"
              >
                info.aryahs@gmail.com
              </a>{" "}
              from the email associated with your account. We verify account
              ownership before helping with the request. Instructions are also
              available at{" "}
              <a
                href="https://eduleaderglobal.com/delete-account"
                className="font-semibold text-[#8A6A31] underline underline-offset-4"
              >
                eduleaderglobal.com/delete-account
              </a>
              .
            </p>
            <p>
              The current backend deletion code removes the account record and
              certain associated activity, progress, booking, receipt,
              subscription, and usage records. It retains PaymentTransaction,
              PaymentAttempt, MembershipHistory, and AppleSubscriptionEvent
              audit records. The code does not specify a fixed retention
              period for these records; the business must confirm the actual
              retention schedule before this policy is published.
            </p>
            <p>
              The current backend deletion code does not explicitly purge
              uploaded files from its separate student_documents GridFS
              store, and does not clean up account references in research
              groups. We cannot claim those items are deleted by the current
              flow. The deletion implementation and associated retention
              disclosures require review before this policy is published as
              a final compliance statement.
            </p>
            <p>
              Website request logs and third-party service records may be
              retained according to the relevant hosting or provider
              configuration. The source repository does not establish those
              retention periods. We will publish a specific duration only
              after confirming it with the relevant providers and business
              owner.
            </p>
          </Section>

          <Section title="Website analytics, cookies, and advertising">
            <p>
              The website uses Google Analytics and may use cookies or similar
              technologies for website operation and traffic measurement.
              These website technologies are distinct from the reviewed
              Android app dependencies.
            </p>
            <p>
              The website may display advertising through Google AdSense.
              Google may use cookies, including the DoubleClick cookie, to
              serve advertisements based on visits to this and other websites.
              You can manage ad personalization through Google Ads Settings.
            </p>
            <p>
              The website may link to external services, advertisers, or
              websites. Their privacy practices are governed by their own
              policies.
            </p>
          </Section>

          <Section title="Your privacy choices and consent">
            <p>
              You may request access to or correction of information associated
              with your account, and you may request account deletion using
              the procedure above. For help, contact info.aryahs@gmail.com.
              Use of our website or app is subject to the applicable terms and
              privacy choices presented to you.
            </p>
          </Section>

          <Section title="Children and intended audience">
            <p>
              EduLeader Global is intended for students aged 16–17 and adults.
              Children under 13 are not an intended audience. The app is an
              education and study-abroad guidance service, not a child-directed
              product.
            </p>
          </Section>

          <Section title="Your choices and support">
            <p>
              You can review or update profile information through your
              account settings and request account deletion using the
              procedure above. For privacy questions or deletion assistance,
              contact info.aryahs@gmail.com or +91 86578 69659.
            </p>
          </Section>

          <Section title="Business contact">
            <p>
              Aryahs World Infotech (OPC) Pvt. Ltd. (EduLeader Global)
              <br />
              Gauri Complex, 601, Sector 11, Belapur, Navi Mumbai, India
              <br />
              Email: info.aryahs@gmail.com
              <br />
              Phone: +91 86578 69659
            </p>
          </Section>
        </div>
      </article>
    </main>
  );
}
