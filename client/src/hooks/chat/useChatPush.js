import { useCallback, useEffect, useState } from "react";

import {
  enablePushNotifications,
  isPushSupported,
  syncExistingPushSubscription,
} from "../../services/push";

export default function useChatPush() {
  const [pushStatus, setPushStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      if (!isPushSupported()) {
        if (!cancelled) {
          setPushStatus("unsupported");
        }

        return;
      }

      try {
        const result = await syncExistingPushSubscription();

        if (cancelled) {
          return;
        }

        if (result.enabled) {
          setPushStatus("enabled");
          return;
        }

        if (result.permission === "denied") {
          setPushStatus("denied");
          return;
        }

        setPushStatus("disabled");
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to initialize push notifications:", error);
        setPushStatus("disabled");
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleEnablePushNotifications = useCallback(async () => {
    setPushStatus("enabling");

    try {
      const result = await enablePushNotifications();

      if (result.enabled) {
        setPushStatus("enabled");
        return;
      }

      setPushStatus(result.permission === "denied" ? "denied" : "disabled");
    } catch (error) {
      console.error("Failed to enable push notifications:", error);

      setPushStatus(
        Notification.permission === "denied" ? "denied" : "disabled",
      );
    }
  }, []);

  return {
    pushStatus,
    handleEnablePushNotifications,
  };
}
