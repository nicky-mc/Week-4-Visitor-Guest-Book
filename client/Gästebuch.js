const guestBookContainer = document.getElementById("guestBookContainer");
const form = document.getElementById("guestBookForm");
const dataUrl = "https://week-4-visitor-guest-book-1.onrender.com/getFeedback";
const postUrl = "https://week-4-visitor-guest-book-1.onrender.com/addFeedback";

async function fetchFeedback() {
  const response = await fetch(dataUrl);
  const feedbackData = await response.json();
  guestBookContainer.innerHTML = ""; // Clear existing feedback
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
    const response = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    if (response.ok) {
      fetchFeedback(); // Refresh the feedback list
    } else {
      console.error("Error submitting form:", response.statusText);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
});
