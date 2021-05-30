const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const firebaseConfig = {
  project_id: process.env.PROJECT_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
};

const base = admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: process.env.DATABASE_URL,
});
const db = base.database();

async function create(key, item) {
  const ref = db.ref(key);
  const child = ref.push();
  await child.set(item);
  return child.key;
}

async function read(key) {
  const ref = db.ref(key);
  const snapshot = await ref.get();
  return snapshot.val();
}

async function update(key, item) {
  const ref = db.ref(key);
  await ref.update(item);
  return null;
}

module.exports = { create, update, read };
