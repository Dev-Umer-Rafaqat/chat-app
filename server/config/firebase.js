const { initializeApp, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = require("./env");

const firebaseApp = initializeApp({
  credential: cert({
    projectId: FIREBASE_PROJECT_ID,

    clientEmail: FIREBASE_CLIENT_EMAIL,

    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const firebaseMessaging = getMessaging(firebaseApp);

module.exports = {
  firebaseApp,
  firebaseMessaging,
};
