document.addEventListener("DOMContentLoaded", init);

function init() {
  const form = document.getElementById("form");
  const guestBookContainer = document.getElementById("guestBookContainer");
  const textarea = document.getElementById("textarea");
  const heightLimit = 500;
  const serverURL = "https://week-4-visitor-guest-book.onrender.com/";

  // Adjust textarea height dynamically
  textarea.oninput = () => {
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
  };

  // Form submission event
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries()); // Ensure entries() is called

    try {
      const response = await fetch(`${serverURL}feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        console.log("I got ya deets choom");
        fetchFeedback(); // Refresh feedback display after submission
        form.reset(); // Reset form fields
      } else {
        console.error("Oh Choom this is not preem:", response.statusText);
      }
    } catch (error) {
      console.error("Error the form delta'd out of here:", error.message);
    }
  });

  // Function to display feedback
  async function fetchFeedback() {
    try {
      const response = await fetch(`${serverURL}feedback`);
      if (response.ok) {
        const feedbackData = await response.json();
        guestBookContainer.innerHTML = ""; // Clear existing feedback
        console.log("Check ya deets choom!:", feedbackData);

        feedbackData.forEach((feedback) => {
          const feedbackElement = document.createElement("div");
          feedbackElement.classList.add("feedback-entry");
          feedbackElement.innerHTML = `
            <h2>${feedback.visitor_name}</h2>
            <p>Location: ${feedback.location}</p>
            <p>Favourite City: ${feedback.favourite_city}</p>
            <p>${feedback.feedback}</p>
          `;
          guestBookContainer.appendChild(feedbackElement);
        });
      } else {
        console.error("Failed to fetch feedback:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error.message);
    }
  }

  // Initial call to display feedback on page load
  fetchFeedback();
}
