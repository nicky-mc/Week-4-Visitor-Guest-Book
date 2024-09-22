async function getFeedbackFromDB() {
  const response = await fetch(
    "https://week-4-visitor-guest-book.onrender.com/"
  );
  const data = await response.json();
  return data;
}

function handleSubmit(event) {
  event.preventDefault();

  const form = document.querySelector("#form-container");
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData);

  fetch("https://week-4-visitor-guest-book.onrender.com/fedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ formValues }),
  });
  form.reset();
}

async function main() {
  const fb = await getFeedbackFromDB();

  fb.forEach(function (entry) {
    const feedbackContainer = document.querySelector("#innerFB");
    const feedback = document.createElement("div");
    feedback.className = "indFB";
    feedback.textContent = `Visitor Name: ${entry.visitor_name} | Location: ${entry.location} | Favourite City: ${entry.favourite_city} | Feedback: ${entry.feedback}`;
  });

  document
    .querySelector("#form-container")
    .addEventListener("submit", handleSubmit);
}
main();
