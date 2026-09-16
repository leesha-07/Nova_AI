self.addEventListener("push", (event) => {
  let data;

  try {
    data = event.data.json();
  } catch (error) {
    data = {
      title: "Nova AI",
      message: event.data.text(),
    };
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
    }),
  );
});
