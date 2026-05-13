const webpush = require("web-push");

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || "mailto:support@ecovibe.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

/**
 * Send a push notification to all subscriptions of a user document.
 * Silently removes invalid/expired subscriptions.
 */
const sendPushToUser = async (userDoc, payload) => {
  if (!userDoc.pushSubscriptions || userDoc.pushSubscriptions.length === 0) return;

  const data = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || "/icons/icon-192.png",
    badge: payload.badge || "/icons/badge-72.png",
    data: payload.data || {},
  });

  const toRemove = [];

  await Promise.allSettled(
    userDoc.pushSubscriptions.map(async (sub, idx) => {
      try {
        await webpush.sendNotification(sub, data);
      } catch (err) {
        // 410 Gone or 404 = subscription expired
        if (err.statusCode === 410 || err.statusCode === 404) {
          toRemove.push(idx);
        }
      }
    })
  );

  if (toRemove.length > 0) {
    // Remove stale subscriptions (reverse order to keep indices valid)
    toRemove.reverse().forEach((i) => userDoc.pushSubscriptions.splice(i, 1));
    await userDoc.save();
  }
};

module.exports = { sendPushToUser };
