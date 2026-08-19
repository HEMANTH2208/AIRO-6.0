import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";
import fs from "fs";

const DB_PATH = path.resolve(process.cwd(), "data", "airo.db");

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    initializeSchema(_db);
  }
  return _db;
}

function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      duration TEXT,
      min_team_size INTEGER NOT NULL DEFAULT 2,
      max_team_size INTEGER NOT NULL DEFAULT 4,
      status TEXT NOT NULL DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id TEXT UNIQUE NOT NULL,
      event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      team_name TEXT NOT NULL,
      college_name TEXT NOT NULL,
      department TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      student_id TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      is_team_lead INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER UNIQUE NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      qr_code TEXT,
      registration_status TEXT NOT NULL DEFAULT 'confirmed',
      checked_in INTEGER NOT NULL DEFAULT 0,
      checked_in_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedEvents(db);
  seedAdmin(db);
}

function seedEvents(db: Database.Database) {
  const count = (db.prepare("SELECT COUNT(*) as cnt FROM events").get() as { cnt: number }).cnt;
  if (count > 0) return;

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
      name: "Prompt-to-Product",
      slug: "prompt-to-product",
      description:
        "Teams transform a real-world problem into an AI-powered solution and functional prototype. The challenge is to leverage AI tools and prompt engineering to rapidly prototype a working product.",
      duration: "60–90 minutes",
      min_team_size: 2,
      max_team_size: 4,
    },
    {
      name: "AI Pitch",
      slug: "ai-pitch",
      description:
        "Teams develop an AI-based startup solution and present its problem, solution, prototype, feasibility, and business potential in a 5-minute pitch. Includes both preparation and presentation phases.",
      duration: "45–60 minutes preparation + 5-minute pitch",
      min_team_size: 2,
      max_team_size: 4,
    },
    {
      name: "VibeCraft",
      slug: "vibecraft",
      description:
        "An AI creation challenge involving image recreation, design adaptation, and AI-assisted website development. Teams showcase creativity and technical skill through AI-powered design and development tasks.",
      duration: "Approximately 1.5 hours",
      min_team_size: 2,
      max_team_size: 2,
    },
  ];

  const insert = db.prepare(`
    INSERT INTO events (name, slug, description, duration, min_team_size, max_team_size)
    VALUES (@name, @slug, @description, @duration, @min_team_size, @max_team_size)
  `);

  for (const event of events) {
    insert.run(event);
  }
}

function seedAdmin(db: Database.Database) {
  const email = process.env.ADMIN_EMAIL || "admin@airo.sairamengineering.edu";
  const password = process.env.ADMIN_PASSWORD || "King@2221";
  const hash = bcrypt.hashSync(password, 12);

  const existing = db.prepare("SELECT * FROM admin_users WHERE email = ?").get(email);
  if (existing) {
    db.prepare("UPDATE admin_users SET password_hash = ? WHERE email = ?").run(hash, email);
  } else {
    db.prepare(`
      INSERT INTO admin_users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run("AIRO Admin", email, hash, "admin");
  }
}

export default getDb;
