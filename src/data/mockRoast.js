export const mockRoast = {
  repo: {
    name: "my-awesome-project",
    owner: "some-dev",
    url: "https://github.com/some-dev/my-awesome-project",
    language: "JavaScript",
    stars: 3,
    forks: 0,
    description: "idk just a project lol",
    lastCommit: "8 months ago",
    openIssues: 47,
  },
  overallScore: 34,
  grades: [
    { category: "README",        grade: "D+", score: 38, summary: "A haiku has more information than this README." },
    { category: "Code Quality",  grade: "F",  score: 12, summary: "Your future self will hate your present self." },
    { category: "Structure",     grade: "C-", score: 52, summary: "Files scattered like a developer in a fire drill." },
    { category: "Dependencies",  grade: "D",  score: 29, summary: "17 outdated packages. Living dangerously." },
    { category: "Dev Experience",grade: "C",  score: 55, summary: "No tests. No linting. Just vibes." },
  ],
  roasts: [
    {
      id: 1,
      file: "src/index.js",
      line: null,
      burn: "Your entire app logic lives in one 800-line file. This isn't a codebase, it's a cry for help.",
      severity: "nuclear",
    },
    {
      id: 2,
      file: "README.md",
      line: null,
      burn: "Your README is literally just 'TODO: write readme'. You committed this. To a public repo. Twice.",
      severity: "high",
    },
    {
      id: 3,
      file: "package.json",
      line: null,
      burn: "You have lodash installed. You use it to check if an array is empty. Array.length exists, friend.",
      severity: "medium",
    },
    {
      id: 4,
      file: "src/utils/helpers.js",
      line: 42,
      burn: "A function called 'doStuff'. Inside: 23 nested if-else blocks. No comments. No mercy.",
      severity: "high",
    },
    {
      id: 5,
      file: ".gitignore",
      line: null,
      burn: "You committed your .env file. Your API keys are now property of the internet. Congratulations.",
      severity: "nuclear",
    },
  ],
  redeeming: [
    "Your commit messages are actually descriptive. That puts you ahead of 40% of developers.",
    "The folder separation between components and utils shows you've read at least one blog post about architecture.",
  ],
  verdict: "This repo is what happens when Stack Overflow answers raise a child. Ship it, fix it, and maybe read a book.",
};

export const loadingMessages = [
  "Cloning your crimes against clean code...",
  "Reading your spaghetti...",
  "Counting TODO comments... there are so many...",
  "Judging your variable names...",
  "Consulting the Geneva Convention...",
  "Preparing emotional damage...",
  "Calculating technical debt...",
  "Your code review is gonna hurt...",
];

export const gradeColorMap = {
  "A+": "#00ff88", "A": "#00ff88", "A-": "#00ff88",
  "B+": "#88ff00", "B": "#88ff00", "B-": "#88ff00",
  "C+": "#ffd700", "C": "#ffd700", "C-": "#ffd700",
  "D+": "#ff8c00", "D": "#ff8c00", "D-": "#ff8c00",
  "F": "#ff2d55",
};
