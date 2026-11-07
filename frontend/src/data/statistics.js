export const impactStatsData = {
  headline: "Impact Measured in Experiences",
  subtitle: "3,075+ verified student participations across 21 specialized sessions across India.",
  footnote: "Note: '3,075 Total Participants' reflects verified cumulative attendance across 21 sessions.",
  sessionSummary: [
    { type: "Workshops", sessions: 13, participants: "1,975", highlight: "Collegiate & Online Deep Dives" },
    { type: "Guest lectures", sessions: 6, participants: "650", highlight: "Executive & Domain Keynotes" },
    { type: "Hackathons", sessions: 2, participants: "450", highlight: "24-48h Build Sprints" },
    { type: "All events", sessions: 21, participants: "3,075", highlight: "Total Program Footprint", isTotal: true }
  ],
  stats: [
    {
      id: "all-events",
      value: 3075,
      suffix: "+",
      label: "All Events",
      badge: "21 Sessions",
      caption: "3,075 students across 21 total sessions"
    },
    {
      id: "workshops",
      value: 1975,
      suffix: "+",
      label: "Workshops",
      badge: "13 Sessions",
      caption: "1,975 participants in 13 hands-on workshop cohorts"
    },
    {
      id: "guest-lectures",
      value: 650,
      suffix: "+",
      label: "Guest Lectures",
      badge: "6 Sessions",
      caption: "650 participants in 6 company leadership sessions"
    },
    {
      id: "hackathons",
      value: 450,
      suffix: "+",
      label: "Hackathons",
      badge: "2 Sessions",
      caption: "450 participants in 2 competitive build sprints"
    }
  ]
};
