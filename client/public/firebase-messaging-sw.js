/* global firebase, clients, importScripts */

/*
 * Firebase Compat SDK is used here because this service worker
 * is a static file served directly from /public.
 *
 * The main React application uses the modern modular Firebase SDK.
 */

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAH0L-kFIx7ZoZ5-wObxaqQ6vDZStgZ-zE",
  authDomain: "web-app-7ba6d.firebaseapp.com",
  projectId: "web-app-7ba6d",
  storageBucket: "web-app-7ba6d.firebasestorage.app",
  messagingSenderId: "499970293339",
  appId: "1:499970293339:web:5e33ac5b70d5a6676a497e",
});

const messaging = firebase.messaging();

/*
 * Activate the latest Firebase messaging service worker immediately so a
 * browser does not keep an older worker after a frontend update.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/*
 * Handle Firebase messages while the web app
 * is running in the background.
 */
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);

  const data = payload.data || {};

  const title = data.title || "New message";

  const options = {
    body: data.body || "You have a new message.",

    icon: data.icon || "/notification-icon.png",

    badge: data.badge || "/notification-icon.png",

    data: {
      conversationId: data.conversationId || null,

      messageId: data.messageId || null,

      senderId: data.senderId || null,

      senderName: data.senderName || "Unknown user",
    },

    tag: data.conversationId
      ? `conversation-${data.conversationId}`
      : "chat-message",

    renotify: true,
  };

  return self.registration.showNotification(title, options);
});

/*
 * Notification click handling.
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const conversationId = event.notification.data?.conversationId;

  const baseUrl = self.location.origin;

  const targetUrl = conversationId
    ? `${baseUrl}/chat?conversationId=${encodeURIComponent(conversationId)}`
    : `${baseUrl}/chat`;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.startsWith(`${baseUrl}/chat`) && "focus" in client) {
            return client.navigate(targetUrl).then(() => client.focus());
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }

        return undefined;
      }),
  );
});
