document.addEventListener("DOMContentLoaded", () => {
  const guestBookContainer = document.getElementById("guestBookContainer");
  const form = document.getElementById("guestBookForm");
  const dataUrl =
    "https://week-4-visitor-guest-book-1.onrender.com/getFeedback";
  const postUrl =
    "https://week-4-visitor-guest-book-1.onrender.com/addFeedback";
  const likeUrl =
    "https://week-4-visitor-guest-book-1.onrender.com/likeFeedback";
  const deleteUrl =
    "https://week-4-visitor-guest-book-1.onrender.com/deleteFeedback";

  async function fetchFeedback() {
    try {
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      const feedbackData = await response.json();
      guestBookContainer.innerHTML = "";
      feedbackData.forEach((feedback) => {
        const feedbackElement = document.createElement("div");
        feedbackElement.setAttribute("data-id", feedback.id);

        feedbackElement.innerHTML = `
      <h2>${feedback.visitor_name}</h2>
      <p>${feedback.location}</p>
      <p>${feedback.favourite_city}</p>
      <p>${feedback.feedback}</p>
      <p>Likes: <span id="likes-${feedback.id}">${
          feedback.likes || 0
        }</span></p><button class="like-button">Like</button>
      <button class="delete-button">Delete</button>`;
        guestBookContainer.appendChild(feedbackElement);
      });
      attachButtonListeners();
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  }
  function attachButtonListeners() {
    document.querySelector(".like-button").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const feedbackId = event.target.closest("div").getAttribute("data-id");
        try {
          const response = await fetch(likeUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: feedbackId }),
          });
          if (response.ok) {
            const updatedFeedback = await response.json();
            document.getElementById(`likes-${updatedFeedback.id}`).innerText =
              updatedFeedback.likes; // Update likes count
          } else {
            console.error("Error liking feedback:", response.statusText);
          }
        } catch (error) {
          console.error("Error liking feedback:", error);
        }
      });
    });
    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const feedbackId = event.target.closest("div").getAttribute("data-id");
        try {
          const response = await fetch(`${deleteUrl}/${feedbackId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            fetchFeedback(); // Refresh feedback list after deletion
          } else {
            console.error("Error deleting feedback:", response.statusText);
          }
        } catch (error) {
          console.error("Error deleting feedback:", error);
        }
      });
    });
  }

  fetchFeedback();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData);
    visitor_name: formValues.visitor_name.trim();
    location: formValues.location.trim();
    favourite_city: formValues.favourite_city.trim();
    feedback: formValues.feedback.trim();
    if (!trimmedValues.visitor_name || !trimmedValues.feedback) {
      console.error("Visitor name and feedback are required!");
      return;
    }
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
});
