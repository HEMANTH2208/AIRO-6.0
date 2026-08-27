import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const isLocal = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");

const pool = new Pool({
  connectionString,
  ssl: isLocal ? undefined : { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Seed Events
  const events = [
    {
      name: "Tech Auction",
      slug: "tech-auction",
      description:
        "Teams bid for technologies using virtual currency and develop a solution using the technologies they acquire. A fast-paced, strategic event that combines critical thinking with technical development under resource constraints.",
      duration: "60–90 minutes",
      min_team_size: 3,
      max_team_size: 4,
    },
    {
      name: "Tech Crime Scene",
      slug: "tech-crime-scene",
      description:
        "Participants investigate a simulated cybercrime using digital evidence to identify the attacker, attack method, and exploited vulnerability. Apply forensic techniques to decode clues and reconstruct the attack scenario.",
      duration: "60–90 minutes",
      min_team_size: 2,
      max_team_size: 3,
    },
    {
      name: "Agentic Paradox",
      slug: "agentic-paradox",
      description:
        "Teams develop an AI agent based on a selected theme and adapt it to an unseen challenge. This event tests the team's ability to build flexible, intelligent agents that handle unexpected scenarios.",
      duration: "1.5–2 hours",
      min_team_size: 3,
      max_team_size: 3,
    },
    {
      name: "Code Combat",
      slug: "code-combat",
      description:
        "A competitive coding challenge conducted in three rounds: R1 – Debugging (Identify and fix errors in given programs), R2 – DSA (Solve algorithmic and data-structure-based problems), R3 – Company Challenge (Problems inspired by coding assessments of companies such as Google, Amazon, TCS, Wipro, CTS, etc.)",
      duration: "To be announced",
      min_team_size: 2,
      max_team_size: 2,
    },
    {
      name: "Paper Presentation",
      slug: "paper-presentation",
      description:
        "Teams present a technical paper on an emerging technology or relevant research topic. Participants present their technical/research paper on an approved topic, followed by evaluation based on technical knowledge, innovation, presentation quality, relevance, and Q&A performance.",
      duration: "To be announced",
      min_team_size: 3,
      max_team_size: 3,
    },
    {
      name: "Workshop",
      slug: "workshop",
      description:
        "An interactive technical workshop focused on a relevant emerging technology. Includes an expert-led technical session with practical demonstrations or hands-on activities. Designed to provide participants with exposure to cutting-edge technologies. Workshop topic will be finalized and announced soon.",
      duration: "To be announced",
      min_team_size: 1,
      max_team_size: 1,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {
        name: event.name,
        description: event.description,
        duration: event.duration,
        min_team_size: event.min_team_size,
        max_team_size: event.max_team_size,
      },
      create: event,
    });
  }

  // Seed Admin User
  const email = process.env.ADMIN_EMAIL || "admin@airo.sairamengineering.edu";
  const password = process.env.ADMIN_PASSWORD || "King@2221";
  const hash = bcrypt.hashSync(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: {
      password_hash: hash,
    },
    create: {
      name: "AIRO Admin",
      email,
      password_hash: hash,
      role: "admin",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
