document.addEventListener("DOMContentLoaded", () => {
  // Constants
  const API_BASE_URL = "https://week-4-visitor-guest-book.onrender.com";
  const API_ENDPOINTS = {
    GET_FEEDBACK: `${API_BASE_URL}/`,
    POST_FEEDBACK: `${API_BASE_URL}/addFeedback/`,
    LIKE_FEEDBACK: `${API_BASE_URL}/addFeedback/`,
    DELETE_FEEDBACK: (id) => `${API_BASE_URL}/${id}`,
  };

  // DOM Elements
  const guestBookContainer = document.getElementById("guestBookContainer");
  const form = document.getElementById("form");

  // Helper Functions
  const createFeedbackElement = (feedback) => {
    const element = document.createElement("div");
    element.setAttribute("data-id", feedback.id);
    element.innerHTML = `
      <h2>${feedback.visitor_name}</h2>
      <p>${feedback.location}</p>
      <p>${feedback.favourite_city}</p>
      <p>${feedback.feedback}</p>
      <p>Likes: <span id="likes-${feedback.id}">${feedback.likes || 0}</p>
      <button class="like-button">Like</button>
      <button class="delete-button">Delete</button>
    `;
    return element;
  };

  const handleApiError = (error, message) => {
    console.error(`${message}:`, error);
    // You could add user-friendly error handling here, e.g., displaying an error message to the user
  };

  // API Functions
  const fetchFeedback = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_FEEDBACK);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const feedbackData = await response.json();

      guestBookContainer.innerHTML = "";
      feedbackData.forEach((feedback) => {
        guestBookContainer.appendChild(createFeedbackElement(feedback));
      });

      attachButtonListeners();
    } catch (error) {
      handleApiError(error, "Error fetching feedback");
    }
  };

  const submitFeedback = async (formData) => {
    try {
      const response = await fetch(API_ENDPOINTS.POST_FEEDBACK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      await fetchFeedback();
    } catch (error) {
      handleApiError(error, "Error submitting feedback");
    }
  };

  const likeFeedback = async (feedbackId) => {
    try {
      const response = await fetch(API_ENDPOINTS.LIKE_FEEDBACK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: feedbackId }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const updatedFeedback = await response.json();
      document.getElementById(`likes-${updatedFeedback.id}`).innerText =
        updatedFeedback.likes;
    } catch (error) {
      handleApiError(error, "Error liking feedback");
    }
  };

  const deleteFeedback = async (feedbackId) => {
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_FEEDBACK(feedbackId), {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      await fetchFeedback();
    } catch (error) {
      handleApiError(error, "Error deleting feedback");
    }
  };

  // Event Listeners
  const attachButtonListeners = () => {
    document.querySelectorAll(".like-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        const feedbackId = event.target.closest("div").getAttribute("data-id");
        likeFeedback(feedbackId);
      });
    });

    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        const feedbackId = event.target.closest("div").getAttribute("data-id");
        deleteFeedback(feedbackId);
      });
    });
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData);
    const trimmedValues = Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => [key, value.trim()])
    );

    if (!trimmedValues.visitor_name || !trimmedValues.feedback) {
      console.error("Visitor name and feedback are required!");
      return;
    }

    submitFeedback(trimmedValues);
  });

  // Initial fetch
  fetchFeedback();
});
