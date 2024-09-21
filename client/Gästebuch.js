document.addEventListener("DOMContentLoaded", init);
function init() {
  const form = document.getElementById("form");
  const guestBookContainer = document.getElementById("guestBookContainer");
  const textarea = document.getElementById("textarea");
  const heightLimit = 500;
  //const serverURL = "https://week-4-visitor-guest-book.onrender.com/"; // Live server URL

  // Adjust textarea height dynamically
  textarea.oninput = () => {
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
  };

  // Form submission event
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData);
    fetch("http://localhost:8080/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
  });

  // Function to display feedback
  async function fetchFeedback() {
    const response = await fetch("http://localhost:8080/feedback");
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
}
