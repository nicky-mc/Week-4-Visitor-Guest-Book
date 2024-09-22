const getUrl = "https://week-4-visitor-guest-book.onrender.com/feedback";
const postUrl = "https://week-4-visitor-guest-book.onrender.com/addfeedback";
const visitorFeedback = document.getElementById("form-container");
const textArea = document.getElementById("textarea");
const height = 500;
const submitButton = document.getElementById("submit");
async function getFeedback() {
  try {
    const response = await fetch(getUrl);
    const data = await response.json();
    console.log(data);
    displayFeedback(data);
  } catch (error) {
    console.error("Error fetching feedback:", error);
  }
}
function displayFeedback(data) {
  visitorFeedback.innerHTML = "";
  data.forEach((feedback) => {
    const feedbackElement = document.createElement("innerFB");
    feedbackElement.classList.add("feedback");
    feedbackElement.innerHTML = `
      <h3><strong>${feedback.visitor_name}</strong> from ${feedback.location} says:</h3>
      <p>My favourite city is ${feedback.favourite_city}</p>
      <p>${feedback.feedback}</p>`;
    visitorFeedback.appendChild(feedbackElement);
  });
}
submitButton.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(visitorFeedback);
  const formValues = Object.fromEntries(formData);
  try {
    await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    getFeedback();
    visitorFeedback.reset();
  } catch (error) {
    console.error("Error adding feedback:", error);
  }
});
textArea.addEventListener("input", () => {
  textArea.style.height = "auto";
  textArea.style.height = `${Math.min(textArea.scrollHeight, height)}px`;
});
getFeedback();
