const projectsData = [
  {
    name: 'Hive Helsinki Alumni Certificates',
    placeholderDescription:
      ' are official certificates, realesed to our alumni, that prove their graduation from Hive Helsinki.',
    longDescription: {
      intro:
        'After prooving its concept, with alumni hired by over 100 companies, I felt that aan official certificate would be a great addition to the alumni experience. I designed and developed the whole process of creating, sending the certificates.',
      contributions: [
        {
          title: 'Ideation',
          description:
            'The idea came from a business issue we were having and by coming up with this idea not only I have saved Hive Helsinki thousands of euros, but I also have solved teh problem at hand.',
        },
        {
          title: 'Design',
          description:
            'Idesigned teh certificates to look prestigious and to be wasily recognisable.',
        },
        {
          title: 'Development',
          description:
            'Paying for certificates was not an option so I developed the whole system myself. Once a student becomes an alumni they receive the certificate automatically and they can easily share thatnks to the integration with LinkedIn.',
        },
      ],
      impact:
        "The impact of this project has been significant, as it not only enhances the alumni experience but also serves as a valuable marketing tool for Hive Helsinki. The certificates are now a symbol of achievement and recognition, further solidifying the school's reputation in the tech industry.",
    },
    image: 'certificate.png',
    imageAlt: 'screenshot of a hive alumni certificate',
    tech: ['FastAPI', 'Next.js', 'Docker', 'Tailwind CSS', 'Postgresql'],
    url: 'https://certificates.hive.fi/63ecbf92-1e70-4cff-a735-040fbf34170d',
  },
  {
    name: 'Hire a Hiver',
    placeholderDescription:
      ' is a platform that connects businesses with talented students from Hive Helsinki.',
    longDescription: {
      intro:
        'Hire a Hiver stands as an innovative platform crafted to bridge the gap between businesses and skilled students from Hive Helsinki...',
      contributions: [
        {
          title: 'System Enhancements and Automation',
          description:
            'Led the integration of SendGrid to automate email communications, streamlining the process of connecting students with potential employers and ensuring timely updates and notifications.',
        },
        {
          title: 'User Experience and Interface Design',
          description:
            'Undertook a comprehensive overhaul of the user interface and experience, focusing on intuitive navigation and aesthetic appeal. This included a complete revamp of the landing page, making it more engaging and informative for both students and recruiters.',
        },
        {
          title:
            'Advanced Feature Implementation. Developed and implemented a range of features to enhance user interaction and functionality. This included:',
          description:
            "Custom error pages to improve user experience during unforeseen errors. Avatar and CV file upload capabilities, allowing users to personalise their profiles and share their qualifications with potential employers. Dockerisation of the application, ensuring consistency across development, testing, and production environments. A comprehensive FAQ page, addressing common queries and enhancing the platform's usability.",
        },
        {
          title: 'Real-Time Notifications',
          description:
            'Established a Discord integration to send real-time notifications to a dedicated student server about new job postings, ensuring immediate visibility of opportunities.',
        },
        {
          title: 'Continuous Improvement',
          description:
            'Demonstrated a commitment to excellence and continuous improvement by resolving a wide range of bugs and implementing UI fixes across the platform, culminating in the successful closure of 80 pull requests.',
        },
      ],
      impact:
        "My contributions to Hire a Hiver have significantly enhanced the platform's functionality, usability, and reliability, establishing it as a cornerstone for technology industry recruitment in Finland. By improving the connection between businesses and the talented students of Hive Helsinki, Hire a Hiver has become a trusted resource for fostering meaningful career opportunities.",
    },
    image: 'hire-a-hiver-hero.png',
    imageAlt: 'screenshot of Hire a Hiver landing page',
    tech: [
      'Ruby on Rails',
      'haml',
      'Sidekiq',
      'Redis',
      'Tailwind CSS',
      'JavaScript',
      'Postgresql',
      'Stimulus',
      'Docker',
    ],
    url: 'https://hire.hive.fi',
  },
  {
    name: 'Tech report',
    placeholderDescription:
      ' is a ticketing system for hardware issues in Hive Helsinki campus. The idea is to clear up the discord ask-staff channel from issues that are not urgent and be able to collect data on the most common issues.',
    longDescription: {
      intro:
        'Tech report is a ticketing system for hardware issues in Hive Helsinki campus. The idea is to clear up the discord ask-staff channel from issues that are not urgent and be able to collect data on the most common issues.',
      contributions: [
        {
          title: 'Setup from scratch',
          description:
            'Built the whole platform from scratch on my own. Starting from the layout design on paper, moving to designing components and then pages on Figma, to developing the final product',
        },
        {
          title: 'User authentication',
          description: 'Setup user authentication with 42 OAuth',
        },
        {
          title: 'Deadlines and adaptability',
          description:
            'I was given six weeks to design and to develop this app as my very first project during my internship. I managed to design and develop the app in a total of four weeks while also learning to use Next.js and tailwind.css for the first time.',
        },
      ],
      impact:
        'Tech report helped the team keep the ask staff channel on Discord cleaner and keep better track of the ongoing issues with hardware at school.',
    },
    image: 'karen-form-page.png',
    imageAlt: 'Screenshot of Karen homepage',
    tech: ['Next.js', 'Tailwind CSS', 'Prisma'],
    url: null,
  },
  {
    name: 'Sorting hat',
    placeholderDescription:
      ' is a fun website used to run the sorting ceremony for the new Hive students in their coalition. This is part of the gamified experience that students experience in Hive Helsinki.',
    longDescription: {
      intro:
        'Hive helsinki is a peer to peer coding school with some added gamification features. One of these features is the coalitions, something like the Harry Potter houses. Developing the Sorting Hat app and the Sorting Ceremony was aimed at engaging more the students into this colaitions thing.',
      contributions: [
        {
          title: 'Design',
          description:
            "To keep some context with the Hive, a coding school, I decided to design the Sorting Hat resembling a terminal and usign ASCII art I added the coalitions logos and one of Hive's logos, the pinky finger.",
        },
        {
          title: 'Development',
          description:
            'Like the Teach report I design and developed this app from scratch, leading my own work and managing my own tasks, building indipendence and resposibility.',
        },
      ],
      impact:
        'Since the kickoff of the Sorting Ceremony and the Sorting Hat app the students have been more engaged in their coalition and are striving to do better in their studies to make their coalition the winning one.',
    },
    image: 'sorting-hat-pinky.png',
    imageAlt: 'Screenshot of Sorting Hat app',
    tech: ['Next.js', 'Tailwind CSS', 'Prisma'],
    url: null,
  },
];

export default projectsData;
