import fs from 'fs/promises';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Setup file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logFilePath = join(__dirname, 'lovelog.txt');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Reminders array
const reminders = [
  "You're worthy of love, even when it feels far away.",
  "Healing isn't linear. Be patient with yourself.",
  "You are enough, exactly as you are.",
  "Pain is temporary. Growth is permanent.",
  "One day, someone will choose you freely and fully."
];

// Show a random reminder
function showReminder() {
  const randomIndex = Math.floor(Math.random() * reminders.length);
  console.log("\n💡 Daily Reminder:");
  console.log(reminders[randomIndex]);
  console.log();
}

// Write a new entry
async function writeEntry() {
  const entry = await new Promise(resolve => {
    rl.question("Write your heart out: ", resolve);
  });
  
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const entryText = `[${timestamp}]\n${entry}\n\n`;
  
  try {
    await fs.appendFile(logFilePath, entryText);
    console.log("✅ Logged. You'll feel lighter soon.");
  } catch (error) {
    console.error("Error saving your entry:", error.message);
  }
}

// Read all past entries
async function readEntries() {
  try {
    const data = await fs.readFile(logFilePath, 'utf8');
    console.log("\n📝 Your past entries:\n");
    console.log(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log("No entries yet. Start writing your heart out.");
    } else {
      console.error("Error reading your entries:", error.message);
    }
  }
}

// Main menu function
async function showMenu() {
  while (true) {
    console.log("1. Write Entry");
    console.log("2. Read Entries");
    console.log("3. Exit");
    
    const choice = await new Promise(resolve => {
      rl.question("Choose an option: ", resolve);
    });
    
    if (choice === "1") {
      await writeEntry();
    } else if (choice === "2") {
      await readEntries();
    } else if (choice === "3") {
      console.log("Take care. You're doing better than you think. ✨");
      rl.close();
      break;
    } else {
      console.log("Invalid choice. Try again.");
    }
  }
}

// Main function
async function main() {
  console.log("💕 Welcome to LoveLog 💕");
  showReminder();
  await showMenu();
}

// Run the application
main();

