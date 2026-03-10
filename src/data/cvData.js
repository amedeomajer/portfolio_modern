export const cvData = {
  education: {
    title: "Education",
    description:
      "I started my journey in programming at Hive Helsinki, from where I graduated in February 2023. Here I delved into programming head first by learning C.",
    additionalInfo:
      "After completing the common part of the studies in C I took the web development branch where I completed three projects:",
    projects: [
      "Instagram clone to share pictures and apply stickers to them.",
      "Tinder clone with real time chat through web sockets and an algorithm to match people based on location and interests.",
      "Youtube clone to stream movies through YTF torrent API.",
    ],
  },
  work: {
    title: "Work",
    positions: [
      {
        company: "Hive Helsinki",
        period: "April 2023 - May 2025",
        role: "Software Developer",
        description:
          "At Hive I worked as a software developer, creating, maintaining and improving various websites and software. On top of that I improved the school pedagogy and ensured a good experience for the students and the rest of the staff.",
        mainTechnologies: ["Ruby on Rails", "Next.js", "Docker", "Python"],
        impact: [
          {
            description:
              "Enhanced platform functionality, usability, and reliability for Hire a Hiver.",
            note: "See the work section for more information.",
          },
          {
            description:
              "Improved issue tracking and communication with Tech Report, keeping the ask-staff channel on Discord cleaner and more organized.",
            note: "See the work section for more information.",
          },
          {
            description:
              "Increased student engagement in their coalitions with the Sorting Hat app, motivating them to excel in their studies.",
            note: "See the work section for more information.",
          },
        ],
        initiatives: [
          "Ideated and organized the WebDevExpress event, a one-month initiative focused on web development. The event included four workshops, a coding challenge, and a demo day where professionals provided feedback to participating groups.",
        ],
      },
      {
        company: "Wolt / DoorDash",
        period: "2025 - Present",
        role: "Software Engineer",
        description:
          "Software Engineer working across customer-facing Search & Discovery and cross-brand platforms (Wolt, DoorDash, Deliveroo).",
        mainTechnologies: [
          "React",
          "TypeScript",
          "Kotlin",
          "Proprietary Server-Driven UI",
        ],
        impact: [
          {
            description:
              "Search & Discovery (Customer-facing): worked on high-traffic React + TypeScript surfaces used by millions of customers.",
          },
          {
            description:
              "Implemented A/B tests and feature flags for controlled rollouts and experimentation.",
          },
          {
            description:
              "Built customer-facing features and internal tools with a strong focus on performance and maintainability.",
          },
          {
            description:
              "Collaborated closely with backend and product in a fast experimentation environment.",
          },
          {
            description: "Develop Kotlin endpoints powering server-driven UI.",
          },
        ],
      },
    ],
  },
};
