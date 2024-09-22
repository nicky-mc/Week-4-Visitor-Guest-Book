const comment = document.getElementById("textarea");
const heightLimit = 500;

comment.oninput = function () {
  comment.style.height = "";
  comment.style.height = Math.min(comment.scrollHeight, heightLimit) + "px";
};

async function getFeedbackFromDB() {
  const response = await fetch("http://your-server-domain/api/feedback"); // Ensure this points to your server
  const data = await response.json();
  return data;
}

function handleSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  const form = document.querySelector("#form-container");
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData); // Convert FormData to a plain object

  fetch("http://your-server-domain/api/addFeedback", {
    // Ensure this points to your server
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues), // Send data as JSON
  }).then(() => {
    form.reset(); // Reset the form after submission
    getFeedbackFromDB().then(displayFeedback); // Reload feedback after submission
  });
}

function displayFeedback(feedbackList) {
  const feedbackContainer = document.querySelector("#innerFB");
  feedbackContainer.innerHTML = ""; // Clear existing feedback
  feedbackList.forEach((entry) => {
    const feedback = document.createElement("div");
    feedback.className = "indFB";
    feedback.textContent = `Visitor Name: ${entry.visitor_name} | Location: ${entry.location} | Favourite City: ${entry.favourite_city} | Feedback: ${entry.feedback}`;
    feedbackContainer.appendChild(feedback);
  });
}

async function main() {
  const fb = await getFeedbackFromDB(); // Get feedback when the page loads
  displayFeedback(fb);
  document
    .querySelector("#form-container")
    .addEventListener("submit", handleSubmit); // Attach event listener
}

main();
