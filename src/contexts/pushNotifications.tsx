import { subscribePushNotifications, unsubscribePushNotifications } from "@services/auth"; 
import { urlBase64ToUint8Array } from "@utils/helpers";

const VAPID_PUBLIC_KEY = "BLpbet6wKThOiDaJpegbuRQeVyCFrKH0Q7e4BCluxuQqyNxHLN4dxCeEYIs4zaEQd157t6KDsd9S0Mh1rSe8UN4";

export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
  return null;
};

export const subscribeUser = async (registration: ServiceWorkerRegistration) => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    await sendSubscriptionToServer(subscription);
  } catch (error) {
    console.error("Failed to subscribe the user:", error);
  }
};

export const unsubscribeUser = async (registration: ServiceWorkerRegistration) => {
  try {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      await removeSubscriptionFromServer(subscription);
    }
  } catch (error) {
    console.error("Failed to unsubscribe the user:", error);
  }
};

const sendSubscriptionToServer = async (subscription: PushSubscription) => {
  try {
    await subscribePushNotifications(subscription);
  } catch (error) {
    console.error("Error sending subscription to server:", error);
  }
};

const removeSubscriptionFromServer = async (subscription: PushSubscription) => {
  try {
    await unsubscribePushNotifications(subscription);
  } catch (error) {
    console.error("Error removing subscription from server:", error);
  }
};
