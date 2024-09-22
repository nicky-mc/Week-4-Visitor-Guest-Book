const guestBookContainer = document.getElementById("guestBookContainer");
const form = document.getElementById("guestBookForm");
const dataUrl = "https://week-4-visitor-guest-book.onrender.com/getFeedback";

async function fetchFeedback() {
  const response = await fetch(dataUrl);
  const feedbackData = await response.json();
  feedbackData.forEach((feedback) => {
    const feedbackElement = document.createElement("div");
    feedbackElement.innerHTML = `
      <h2>${feedback.visitor_name}</h2>
      <p>${feedback.location}</p>
      <p>${feedback.favourite_city}</p>
      <p>${feedback.feedback}</p>
    `;
    guestBookContainer.appendChild(feedbackElement);
  });
}

fetchFeedback();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData);
  try {
    const response = await fetch(dataUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    // Handle the response here
  } catch (error) {
    console.error("Error submitting form:", error);
  }
});
