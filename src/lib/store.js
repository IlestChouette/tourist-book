import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

async function readStore(filename) {
  const file = path.join(dataDir, filename);
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw);
}

async function writeStore(filename, items) {
  const file = path.join(dataDir, filename);
  await fs.writeFile(file, JSON.stringify(items, null, 2), "utf-8");
}

export async function listRequests() {
  return readStore("requests.json");
}

export async function addRequest(entry) {
  const items = await listRequests();
  const item = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    ...entry,
  };
  items.unshift(item);
  await writeStore("requests.json", items);
  return item;
}

export async function listGuestbook() {
  return readStore("guestbook.json");
}

export async function addGuestbookEntry(entry) {
  const items = await listGuestbook();
  const item = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    hidden: false,
    ...entry,
  };
  items.unshift(item);
  await writeStore("guestbook.json", items);
  return item;
}

export async function setGuestbookHidden(id, hidden) {
  const items = await listGuestbook();
  const next = items.map((item) =>
    item.id === id ? { ...item, hidden } : item
  );
  await writeStore("guestbook.json", next);
}
