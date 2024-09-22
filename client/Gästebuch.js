const API_URL = "https://week-4-visitor-guest-book.onrender.com/addFeedback/";
const form = document.getElementById("feedbackForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Gather and format the data
  const formData = new FormData(form);
  const feedbackData = {
    visitor_name: formData.get("visitor_name").trim(),
    location: formData.get("location").trim(),
    favourite_city: formData.get("favourite_city").trim(),
    feedback: formData.get("feedback").trim(),
    timestamp: new Date().toISOString(),
  };

  // Validate required fields
  if (!feedbackData.visitor_name || !feedbackData.feedback) {
    alert("Name and feedback are required!");
    return;
  }

  try {
    // Post the data to the server
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Feedback submitted successfully:", result);

    // Clear the form
    form.reset();

    // Optionally, you can update the UI to show the new feedback
    // This depends on how you want to handle the response
    updateFeedbackDisplay(result);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    alert("There was an error submitting your feedback. Please try again.");
  }
});

function updateFeedbackDisplay(feedback) {
  // Create a new div element to hold the feedback
  const feedbackElement = document.createElement("div");
  feedbackElement.className = "feedback-item";
  feedbackElement.setAttribute("data-id", feedback.id);

  // Populate the div with feedback information
  feedbackElement.innerHTML = `
      <h3>${feedback.visitor_name}</h3>
      <p><strong>Location:</strong> ${feedback.location}</p>
      <p><strong>Favorite City:</strong> ${feedback.favourite_city}</p>
      <p><strong>Feedback:</strong> ${feedback.feedback}</p>
      <p><small>Posted on: ${new Date(
        feedback.timestamp
      ).toLocaleString()}</small></p>
      <p>Likes: <span class="likes-count">${feedback.likes || 0}</p>
      <button class="like-button">Like</button>
      <button class="delete-button">Delete</button>
    `;

  // Add event listeners for like and delete buttons
  const likeButton = feedbackElement.querySelector(".like-button");
  likeButton.addEventListener("click", () => likeFeedback(feedback.id));

  const deleteButton = feedbackElement.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => deleteFeedback(feedback.id));

  // Add the new feedback to the guestbook container
  const guestBookContainer = document.getElementById("guestBookContainer");
  guestBookContainer.prepend(feedbackElement);
}

function likeFeedback(feedbackId) {
  // Implement the like functionality here
  console.log(`Liking feedback with id: ${feedbackId}`);
  // You would typically make an API call here to update the like count
}

function deleteFeedback(feedbackId) {
  // Implement the delete functionality here
  console.log(`Deleting feedback with id: ${feedbackId}`);
  // You would typically make an API call here to delete the feedback
  // Then remove the feedback element from the DOM
  const feedbackElement = document.querySelector(`[data-id="${feedbackId}"]`);
  if (feedbackElement) {
    feedbackElement.remove();
  }
}

// Make sure this is within your DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  updateFeedbackDisplay(newFeedback);
});
