import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection, LegalList } from "@/components/legal/LegalPage";
import { LEGAL_CONTACT_EMAIL, LEGAL_JURISDICTION, LEGAL_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service · PitchStudy",
  description: "The terms you agree to when using PitchStudy, including the training and content disclaimers.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of service."
      updated={LEGAL_UPDATED}
      intro="These terms cover using PitchStudy. They are written to be readable rather than impenetrable, and the two that matter most are the training disclaimer and the note on how tactical content should be treated."
    >
      <LegalSection title="What PitchStudy is">
        <p>
          PitchStudy is an educational website about football tactics, formations, positions, and position-specific
          training. It is provided for learning and personal interest. It is not affiliated with, endorsed by, or
          connected to any football club, league, governing body, or professional player.
        </p>
      </LegalSection>

      <LegalSection title="Training and fitness disclaimer">
        <p className="rounded-lg border border-press/40 bg-press/10 p-4 text-pitch-line">
          The workouts, drills, and training programmes on this site are general fitness guidance, not medical advice.
          They are not tailored to your health, injury history, or physical condition. Consult a qualified coach or
          medical professional before starting any training programme, and stop immediately if you feel pain,
          dizziness, or discomfort. You take part at your own risk, and you are responsible for training within your
          own limits.
        </p>
        <p>If you are under 18, get approval from a parent, guardian, or coach before following any programme here.</p>
      </LegalSection>

      <LegalSection title="How to treat the tactical content">
        <p>
          Formation analysis, manager profiles, coaching verdicts, and lesson material represent one interpretation of
          how football is played. Tactics are contested and evolving, and reasonable coaches disagree. Treat the
          content as informed opinion for learning, not as settled fact or professional coaching instruction.
        </p>
        <p>
          The Tactics Lab coaching verdict is generated automatically and may be wrong, inconsistent, or incomplete.
          It is a prompt for thinking, not an authority.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          An account is optional and exists to sync your progress across devices. If you create one, provide accurate
          information, keep your password to yourself, and take responsibility for activity under your account.
        </p>
        <p>
          Choose a username that is not offensive, and not one that impersonates somebody else. We may remove an
          account that breaks these terms or that is used to abuse the service.
        </p>
        <p>
          You can delete your account at any time from{" "}
          <Link href="/account" className="underline decoration-attack/50 underline-offset-4 hover:text-attack">
            your account page
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <LegalList
          items={[
            "Do not attempt to break, overload, or gain unauthorised access to the site or its infrastructure.",
            "Do not scrape or bulk-copy the written content for republication.",
            "Do not use automated tools to hammer the interactive features.",
            "Do not use the site to harass anyone or to distribute unlawful material.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Who owns what">
        <p>
          The written lessons, tactical analysis, drills, illustrations, interface, code, and branding on this site
          belong to PitchStudy. You may use them for personal learning and may quote short passages with attribution,
          but you may not republish substantial portions as your own.
        </p>
        <p>
          Formations, plays, and training arrangements that you create in the Tactics Lab are yours. Storing them so
          they sync across your devices is the only thing done with them.
        </p>
        <p>
          Managers and historical tactical systems are discussed factually, as matters of public record and original
          analysis. Names are used descriptively and imply no endorsement or association.
        </p>
      </LegalSection>

      <LegalSection title="Availability">
        <p>
          The site is provided as it is, without any guarantee that it will be available, uninterrupted, or free of
          errors. Features may change or be removed. It may be taken offline for maintenance, or permanently, without
          notice.
        </p>
      </LegalSection>

      <LegalSection title="Liability">
        <p>
          To the fullest extent the law allows, PitchStudy is not liable for injury, loss, or damage arising from your
          use of the site or from following any training or tactical guidance on it. Nothing here limits liability
          that cannot legally be limited.
        </p>
      </LegalSection>

      <LegalSection title="Changes to these terms">
        <p>
          These terms may be updated. The date at the top of this page shows when they last changed, and continuing
          to use the site after a change means you accept the updated version.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws of {LEGAL_JURISDICTION}, and any dispute will be handled by the courts
          there.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms can be sent to{" "}
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            className="underline decoration-attack/50 underline-offset-4 hover:text-attack"
          >
            {LEGAL_CONTACT_EMAIL}
          </a>
          . Our{" "}
          <Link href="/privacy" className="underline decoration-attack/50 underline-offset-4 hover:text-attack">
            privacy policy
          </Link>{" "}
          explains what the site stores.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
