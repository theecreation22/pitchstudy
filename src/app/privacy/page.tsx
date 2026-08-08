import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalList } from "@/components/legal/LegalPage";
import { LEGAL_CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy · PitchStudy",
  description: "What PitchStudy stores, who it is shared with, and how to get it back or delete it.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy policy."
      updated={LEGAL_UPDATED}
      intro="PitchStudy is a football tactics learning site. This page explains exactly what it stores, who else can see it, and how to get it back or delete it. It describes what the site actually does rather than everything it might one day do."
    >
      <LegalSection title="The short version">
        <p>
          You can use almost all of PitchStudy without an account, and if you do, everything stays in your own
          browser. There are no analytics, no advertising trackers, and no third-party cookies anywhere on the site.
          An account exists for one reason: so your progress follows you to another device.
        </p>
      </LegalSection>

      <LegalSection title="What is stored on your device">
        <p>
          Whether or not you sign in, the site saves the following in your browser&apos;s local storage. It stays on
          that device and is not sent anywhere unless you create an account.
        </p>
        <LegalList
          items={[
            "Your Player Card: nickname, position, playstyle, level, and available equipment.",
            "Learning progress: completed lessons, quiz scores, XP, badges, streaks, and training dates.",
            "Saved work: formations and plays from the Tactics Lab, and Scenario Mode attempts.",
            "Preferences: motion, sound, and interface settings.",
          ]}
        />
        <p>
          You can clear all of it at any time from{" "}
          <Link href="/settings" className="underline decoration-attack/50 underline-offset-4 hover:text-attack">
            Settings
          </Link>
          , or by clearing site data in your browser.
        </p>
      </LegalSection>

      <LegalSection title="What is stored if you create an account">
        <p>
          Creating an account adds a single database row holding a copy of the same information, so it can sync
          across devices. Specifically: your email address, your chosen username, an optional squad number, and the
          Player Card, progress, and saved work listed above.
        </p>
        <p>
          That row is protected by row-level security, meaning the database itself enforces that only your own
          account can read or write it. No other user can access it.
        </p>
      </LegalSection>

      <LegalSection title="What the site operator can see">
        <p>
          Being straightforward about this rather than burying it: an administrator account can view aggregate
          totals (how many users, how many lessons completed, and similar counts) and a list of registered accounts
          showing username, email address, and signup date.
        </p>
        <p>
          Administrators cannot read the contents of your progress, Player Card, or saved formations. That access is
          restricted at the database level, not merely by convention.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          The only cookies set are the session cookies required to keep you signed in, placed by our authentication
          provider. They are not used for tracking, profiling, or advertising. If you never sign in, the site sets no
          cookies at all.
        </p>
      </LegalSection>

      <LegalSection title="Who else is involved">
        <LegalList
          items={[
            <>
              <strong className="text-pitch-line">Supabase</strong> provides authentication and the database. Your
              account row is stored on their infrastructure.
            </>,
            <>
              <strong className="text-pitch-line">Render</strong> hosts the site and processes standard server
              request logs.
            </>,
            <>
              <strong className="text-pitch-line">Google</strong> is involved only if you choose to sign in with a
              Google account, in which case Google shares your email address with us. Signing in by email or magic
              link does not involve Google.
            </>,
            <>
              <strong className="text-pitch-line">Anthropic</strong> generates the Tactics Lab coaching verdict. Only
              the formation itself is sent: player roles, pitch coordinates, and team instructions. Your name, email,
              username, and account identifier are never included, so the analysis cannot be linked back to you.
            </>,
          ]}
        />
        <p>Your information is not sold, rented, or shared with anyone for advertising.</p>
      </LegalSection>

      <LegalSection title="Your choices">
        <LegalList
          items={[
            <>
              <strong className="text-pitch-line">Export.</strong> Download everything held on your device as a file
              from Settings.
            </>,
            <>
              <strong className="text-pitch-line">Delete the synced copy.</strong> Deleting your account from the
              account page removes your database row and signs you out. What is on your device is left untouched.
            </>,
            <>
              <strong className="text-pitch-line">Reset locally.</strong> Clear progress on a single device from
              Settings without affecting your account.
            </>,
            <>
              <strong className="text-pitch-line">Ask.</strong> Write to us for a copy of what is held about you, or
              to have it corrected or erased.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection title="How long it is kept">
        <p>
          Account data is kept until you delete it. Deleting your account removes the stored row immediately. Server
          request logs held by our hosting provider are retained on their standard schedule.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          PitchStudy teaches football and some material is written for younger players, but accounts are not intended
          for children under 13. If you are under 13, please use the site without creating an account, which requires
          no personal information at all.
        </p>
        <p>
          If you believe a child under 13 has created an account, contact us and we will remove it.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          If this policy changes in a way that affects what is collected or who it is shared with, the date at the
          top of this page will change and the update will be noted here.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about privacy, or requests about your information, can be sent to{" "}
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            className="underline decoration-attack/50 underline-offset-4 hover:text-attack"
          >
            {LEGAL_CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
