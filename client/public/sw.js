self.addEventListener("push", (event) => {
  console.log("Push event received");

  let data;

  try {
    data = event.data.json();
  } catch (error) {
    data = {
      title: "Nova AI",
      message: event.data ? event.data.text() : "New reminder",
    };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Nova AI", {
      body: data.message || "You have a new reminder",
    }),
  );
});
