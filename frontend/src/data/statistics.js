export const impactStatsData = {
  headline: "Impact Measured in Experiences",
  subtitle: "4,855+ verified student participations across 31 specialized sessions across India.",
  footnote: "Note: '4,855 Total Participants' reflects verified cumulative attendance across 31 sessions. Workshop metrics represent the combined count of both online and offline collegiate workshops.",
  sessionSummary: [
    { type: "Workshops (Online & Offline)", sessions: 18, participants: "3,125", highlight: "Combined Online & Offline Deep Dives" },
    { type: "Guest lectures", sessions: 10, participants: "1,180", highlight: "Executive & Domain Keynotes" },
    { type: "Hackathons", sessions: 3, participants: "550", highlight: "24-48h Build Sprints" },
    { type: "All events", sessions: 31, participants: "4,855", highlight: "Total Program Footprint", isTotal: true }
  ],
  stats: [
    {
      id: "all-events",
      value: 4855,
      suffix: "+",
      label: "All Events",
      badge: "31 Sessions",
      caption: "4,855 students across 31 total sessions"
    },
    {
      id: "workshops",
      value: 3125,
      suffix: "+",
      label: "Workshops (Online & Offline)",
      badge: "18 Sessions",
      caption: "3,125 participants in 18 combined online and offline workshop cohorts"
    },
    {
      id: "guest-lectures",
      value: 1180,
      suffix: "+",
      label: "Guest Lectures",
      badge: "10 Sessions",
      caption: "1,180 participants in 10 company leadership sessions"
    },
    {
      id: "hackathons",
      value: 550,
      suffix: "+",
      label: "Hackathons",
      badge: "3 Sessions",
      caption: "550 participants in 3 competitive build sprints"
    }
  ]
};
