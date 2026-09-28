import {
  deleteToken,
  getToken,
  onMessage,
  getMessaging,
  isSupported,
} from "firebase/messaging";

import { api } from "./api";
import { firebaseApp } from "../config/firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

let messagingInstance = null;
let messagingPromise = null;

let serviceWorkerRegistration = null;
let serviceWorkerRegistrationPromise = null;

let foregroundListenerInitialized = false;

async function getMessagingInstance() {
  if (messagingInstance) {
    return messagingInstance;
  }

  if (messagingPromise) {
    return messagingPromise;
  }

  messagingPromise = (async () => {
    const supported = await isSupported();

    if (!supported) {
      return null;
    }

    messagingInstance = getMessaging(firebaseApp);

    return messagingInstance;
  })();

  try {
    return await messagingPromise;
  } finally {
    messagingPromise = null;
  }
}

async function registerFirebaseServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported.");
  }

  if (serviceWorkerRegistration) {
    return serviceWorkerRegistration;
  }

  if (serviceWorkerRegistrationPromise) {
    return serviceWorkerRegistrationPromise;
  }

  serviceWorkerRegistrationPromise = navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );

  try {
    serviceWorkerRegistration = await serviceWorkerRegistrationPromise;
    return serviceWorkerRegistration;
  } finally {
    serviceWorkerRegistrationPromise = null;
  }
}

function showForegroundNotification(registration, payload) {
  if (Notification.permission !== "granted") {
    return;
  }

  const data = payload?.data || {};

  const title = data.title || payload?.notification?.title || "New message";

  const body =
    data.body || payload?.notification?.body || "You have a new message.";

  const conversationId = data.conversationId || null;
  const messageId = data.messageId || null;
  const senderId = data.senderId || null;
  const senderName = data.senderName || "Unknown user";

  registration.showNotification(title, {
    body,
    icon: data.icon || "/notification-icon.png",
    badge: data.badge || "/notification-icon.png",
    data: {
      conversationId,
      messageId,
      senderId,
      senderName,
    },
    tag: conversationId ? `conversation-${conversationId}` : "chat-message",
    renotify: true,
  });
}

function initializeForegroundMessageListener(messaging, registration) {
  if (foregroundListenerInitialized) {
    return;
  }

  foregroundListenerInitialized = true;

  onMessage(messaging, (payload) => {
    console.log("[FCM] Foreground message received:", payload);

    showForegroundNotification(registration, payload);
  });
}

export function isPushSupported() {
  return "serviceWorker" in navigator && "Notification" in window;
}

export async function getPushPermission() {
  if (!isPushSupported()) {
    return "unsupported";
  }

  return Notification.permission;
}

async function registerFirebaseInstallation() {
  const messaging = await getMessagingInstance();

  if (!messaging) {
    throw new Error("Firebase Messaging is not supported by this browser.");
  }

  if (!VAPID_KEY) {
    throw new Error("VITE_FIREBASE_VAPID_KEY is not configured.");
  }

  const registration = await registerFirebaseServiceWorker();

  initializeForegroundMessageListener(messaging, registration);

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error("Firebase did not return a registration token.");
  }

  await api.registerPushInstallation(token);

  return token;
}

export async function enablePushNotifications() {
  if (!isPushSupported()) {
    throw new Error("Push notifications are not supported by this browser.");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    return {
      enabled: false,
      permission,
    };
  }

  const token = await registerFirebaseInstallation();

  return {
    enabled: true,
    permission,
    installationId: token,
  };
}

export async function syncExistingPushSubscription() {
  if (!isPushSupported()) {
    return {
      enabled: false,
      permission: "unsupported",
    };
  }

  const permission = Notification.permission;

  if (permission !== "granted") {
    return {
      enabled: false,
      permission,
    };
  }

  try {
    const token = await registerFirebaseInstallation();

    return {
      enabled: true,
      permission,
      installationId: token,
    };
  } catch (error) {
    console.error("[FCM] Failed to sync push registration:", error);

    return {
      enabled: false,
      permission,
    };
  }
}

export async function disablePushNotifications() {
  const messaging = await getMessagingInstance();

  if (!messaging) {
    return;
  }

  const registration = await registerFirebaseServiceWorker();
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (token) {
    await api.unregisterPushInstallation(token);
  }

  await deleteToken(messaging);
}
