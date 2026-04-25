import type { Metadata } from "next";
import { CityAdsLanding } from "@/components/local/ads-landing/city-ads-landing";
import { SFSkyline } from "@/components/local/ads-landing/city-illustrations";

export const metadata: Metadata = {
  title: "Free San Francisco Civic Briefing — Next Voters",
  description:
    "A free, nonpartisan weekly email on what San Francisco's Board of Supervisors, the California Legislature, and the U.S. Congress are actually doing. Built for residents, not insiders.",
  alternates: { canonical: "/local/sf" },
  openGraph: {
    title: "Free San Francisco Civic Briefing — Next Voters",
    description:
      "Weekly updates on San Francisco, California, and federal action that affects you. Free, nonpartisan, and cited.",
    url: "https://nextvoters.com/local/sf",
  },
};

export default function SFLandingPage() {
  return (
    <CityAdsLanding
      cityAliases={["San Francisco", "SF", "San Francisco, CA"]}
      cityDisplay="San Francisco"
      audienceLabel="San Franciscans"
      refCode="google-ads-sf"
      heroVariant="split"
      ctaShine
      heroBackdrop={<SFSkyline className="w-full" />}
      heroAccent="bg-[linear-gradient(180deg,#fff_0%,#fff1f2_55%,#fff_100%)]"
      coverageSummary="One free weekly email covering San Francisco, California, and federal action that affects you — written for residents, not insiders."
      coverageTiers={[
        {
          label: "San Francisco",
          kind: "city",
          items: [
            "Board of Supervisors votes & ordinances",
            "Mayor's office actions and exec directives",
            "Local ballot measures and city budget moves",
          ],
        },
        {
          label: "California",
          kind: "state",
          items: [
            "Assembly & Senate floor votes in Sacramento",
            "Statewide ballot propositions",
            "Bills the Governor signs or vetoes",
          ],
        },
        {
          label: "United States",
          kind: "country",
          items: [
            "Congressional roll-call votes",
            "Federal agency rulings affecting California",
          ],
        },
      ]}
      emailTopics={[
        {
          label: "Economy & Housing",
          stories: [
            {
              headline: "Supervisors send affordable housing bond to ballot",
              source: "San Francisco · Board of Supervisors",
              summary:
                "The Board voted 9-2 to put a $300M affordable housing bond on the November ballot. The measure would fund roughly 2,400 below-market units citywide over the next decade.",
            },
            {
              headline: "Assembly committee advances rent-cap reform",
              source: "California · Assembly Housing Committee",
              summary:
                "The committee voted 7-3 to send AB-2127 to the floor. The bill would cap annual rent hikes at 5% in buildings older than 15 years.",
            },
            {
              headline: "HUD raises Bay Area voucher payment standards",
              source: "United States · HUD",
              summary:
                "Federal housing officials announced new fair-market rents for the Bay Area, raising voucher caps by an average of 6%. Roughly 12,000 SF households use these vouchers.",
            },
          ],
        },
        {
          label: "Civil Rights & Justice",
          stories: [
            {
              headline: "Police Commission tightens traffic-stop policy",
              source: "San Francisco · Police Commission",
              summary:
                "Commissioners voted unanimously to bar pretextual stops for low-level violations. The new rule takes effect next quarter and is the first of its kind in California.",
            },
            {
              headline: "Stop-data reporting bill clears committee",
              source: "California · Assembly Public Safety Cmte.",
              summary:
                "AB-2218, which would require all state law enforcement to report stop demographics quarterly, advanced 6-2. Backers say it closes a major transparency gap.",
            },
            {
              headline: "DOJ opens civil-rights probe into county jail",
              source: "United States · Department of Justice",
              summary:
                "Federal investigators are reviewing conditions of confinement after a string of in-custody deaths. The probe could lead to a consent decree.",
            },
          ],
        },
        {
          label: "Public Health",
          stories: [
            {
              headline: "DPH expands free overdose-reversal access",
              source: "San Francisco · Department of Public Health",
              summary:
                "The city is now distributing naloxone kits at every public library and community center. The expansion follows a 19% rise in overdose deaths last year.",
            },
            {
              headline: "Governor signs paid sick-leave expansion",
              source: "California · Governor's Office",
              summary:
                "SB-616 raises the statewide minimum from five to seven days starting January 1. The bill covers all employers with five or more workers.",
            },
          ],
        },
        {
          label: "Transit & Infrastructure",
          stories: [
            {
              headline: "Muni Metro approves new service plan",
              source: "San Francisco · SFMTA Board",
              summary:
                "Board members approved a plan adding 18% more frequency on the L-Taraval and N-Judah lines. Implementation starts in February.",
            },
            {
              headline: "Caltrans selects Central Valley HSR alignment",
              source: "California · Caltrans",
              summary:
                "State officials picked the eastern route through Madera County over two competing alignments. Construction bidding opens in spring.",
            },
          ],
        },
        {
          label: "Education",
          stories: [
            {
              headline: "School board overhauls literacy curriculum",
              source: "San Francisco · SFUSD Board",
              summary:
                "The new K-3 curriculum mandates structured phonics in all classrooms. The change follows two years of declining reading scores district-wide.",
            },
          ],
        },
        {
          label: "Climate & Environment",
          stories: [
            {
              headline: "Air District tightens diesel-truck idling rules",
              source: "Bay Area · Air Quality Management District",
              summary:
                "The new rule cuts maximum idling from five to two minutes. Enforcement begins next month at port and warehouse facilities region-wide.",
            },
          ],
        },
      ]}
    />
  );
}
