import type { Metadata } from "next";
import { CityAdsLanding } from "@/components/local/ads-landing/city-ads-landing";
import { NYCSkyline } from "@/components/local/ads-landing/city-illustrations";

export const metadata: Metadata = {
  title: "Free NYC Civic Briefing — Next Voters",
  description:
    "A free, nonpartisan weekly email on what New York City's Council, the New York State Legislature, and the U.S. Congress are actually doing. Built for residents, not insiders.",
  alternates: { canonical: "/local/nyc" },
  openGraph: {
    title: "Free NYC Civic Briefing — Next Voters",
    description:
      "Weekly updates on New York City, New York State, and federal action that affects you. Free, nonpartisan, and cited.",
    url: "https://nextvoters.com/local/nyc",
  },
};

export default function NYCLandingPage() {
  return (
    <CityAdsLanding
      cityAliases={["New York City", "New York", "NYC", "New York, NY"]}
      cityDisplay="New York City"
      audienceLabel="New Yorkers"
      refCode="google-ads-nyc"
      heroVariant="split"
      ctaShine
      heroBackdrop={<NYCSkyline className="w-full" />}
      heroAccent="bg-[linear-gradient(180deg,#fff_0%,#fef2f2_55%,#fff_100%)]"
      coverageSummary="One free weekly email covering New York City, New York State, and federal action that affects you — written for residents, not insiders."
      coverageTiers={[
        {
          label: "New York City",
          kind: "city",
          items: [
            "City Council votes & local laws",
            "Mayor's office actions and exec orders",
            "MTA, DOE, and city agency decisions",
          ],
        },
        {
          label: "New York State",
          kind: "state",
          items: [
            "Assembly & Senate floor votes in Albany",
            "Statewide ballot measures",
            "Bills the Governor signs or vetoes",
          ],
        },
        {
          label: "United States",
          kind: "country",
          items: [
            "Congressional roll-call votes",
            "Federal agency rulings affecting New York",
          ],
        },
      ]}
      emailTopics={[
        {
          label: "Economy & Housing",
          stories: [
            {
              headline: "Council passes 'good cause' eviction package",
              source: "New York City · City Council",
              summary:
                "The Council voted 36-15 to extend tenant protections to 1.6 million market-rate units. Landlords will now need a stated cause to refuse lease renewals.",
            },
            {
              headline: "Albany advances FAR cap reform",
              source: "New York State · Assembly Housing Cmte.",
              summary:
                "A-1234 cleared committee 12-4, lifting the 12.0 floor-area-ratio cap that has limited NYC residential height since 1961. Backers project 50K new units over a decade.",
            },
            {
              headline: "Fed signals two more rate cuts this cycle",
              source: "United States · Federal Reserve",
              summary:
                "FOMC minutes pointed to a 50bps reduction by year-end if labor market data continues to soften. Mortgage rates in the metro region are already pricing it in.",
            },
          ],
        },
        {
          label: "Civil Rights & Justice",
          stories: [
            {
              headline: "CCRB gets disciplinary authority over NYPD",
              source: "New York City · Civilian Complaint Review Board",
              summary:
                "Mayor signed Local Law 47 making CCRB findings binding on all uniformed members. Union has signaled a court challenge.",
            },
            {
              headline: "State attorney general expands hate-crime task force",
              source: "New York State · OAG",
              summary:
                "The unit will add 22 prosecutors and embed civil-rights staff in five upstate counties. Funding comes from a $14M reallocation in the FY26 budget.",
            },
            {
              headline: "DOJ files Section 2 challenge to redistricting map",
              source: "United States · Department of Justice",
              summary:
                "Federal lawyers argue the new congressional map dilutes Black voting power in two upstate districts. A hearing is set for late next month.",
            },
          ],
        },
        {
          label: "Public Health",
          stories: [
            {
              headline: "DOHMH launches free citywide mammogram program",
              source: "New York City · Health Department",
              summary:
                "Uninsured residents 40+ can book appointments at any of 22 partner clinics. The program targets 30,000 screenings in year one.",
            },
            {
              headline: "Governor signs prescription drug price-cap law",
              source: "New York State · Governor's Office",
              summary:
                "S-789 caps insulin co-pays at $35 for state-regulated plans. Roughly 1.4 million New Yorkers are eligible.",
            },
          ],
        },
        {
          label: "Transit & Infrastructure",
          stories: [
            {
              headline: "MTA approves Second Avenue subway extension",
              source: "New York City · MTA Board",
              summary:
                "Board green-lit the Phase 2 alignment extending the Q line to 125th Street. Tunnel-boring contracts go out to bid this fall.",
            },
            {
              headline: "Congestion pricing receives federal sign-off",
              source: "United States · FHWA",
              summary:
                "FHWA dropped its remaining environmental objections, clearing the program for January launch. Toll revenue is locked in for capital plan funding.",
            },
          ],
        },
        {
          label: "Education",
          stories: [
            {
              headline: "DOE rolls out new K-2 literacy curriculum",
              source: "New York City · Department of Education",
              summary:
                "All 32 districts will use a single phonics-based program by next September. The shift follows a 2024 audit that found inconsistent reading outcomes.",
            },
          ],
        },
        {
          label: "Climate & Environment",
          stories: [
            {
              headline: "City tightens building-emissions thresholds",
              source: "New York City · Mayor's Office of Climate",
              summary:
                "Local Law 97 fines kick in for buildings over 25,000 sq ft starting Q1. Owners can apply for a one-time variance through the new compliance portal.",
            },
          ],
        },
      ]}
    />
  );
}
