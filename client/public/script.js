document.addEventListener("DOMContentLoaded", () => {
  const getUrl = "https://week-4-visitor-guest-book.onrender.com/feedback";
  const postUrl = "https://week-4-visitor-guest-book.onrender.com/addFeedback";
  const feedbackContainer = document.getElementById("innerFB");
  const formData = document.getElementById("form");
  const textContent = document.getElementById("textarea");
  const height = 500;

  textContent.addEventListener("input", () => {
    textContent.style.height = height + "px";
    textContent.style.height = textContent.scrollHeight + "px";
  });

  formData.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      feedback: textContent.value,
    };
    fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        formData.reset();
        textContent.style.height = "auto";
        getFeedback();
      })
      .catch((err) => console.log(err));
  });

  const getFeedback = () => {
    fetch(getUrl)
      .then((res) => res.json())
      .then((data) => {
        feedbackContainer.innerHTML = "";
        data.forEach((feedback) => {
          const feedbackElement = document.createElement("div");
          feedbackElement.classList.add("feedback");
          feedbackElement.innerHTML = `
          <h3>${feedback.visitor_name}</h3>
          <p>${feedback.location}</p>
          <p>${feedback.favourite_city}</p>
          <p>${feedback.feedback}</p>
        `;
          feedbackContainer.appendChild(feedbackElement);
        });
      })
      .catch((err) => console.log(err));
  };

  getFeedback();
  console.log("Hello");
});
