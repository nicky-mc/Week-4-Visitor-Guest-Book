const form = document.getElementById("form");
const guestBookContainer = document.getElementById("guestBookContainer");
const textarea = document.getElementById("textarea");
const heightLimit = 500;

// Use your server's live URL
const serverURL = "https://localhost:8080/feedback";

textarea.oninput = function () {
  textarea.style.height = "auto"; // Reset height
  textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const formObject = Object.fromEntries(formData);

  const response = await fetch(serverURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObject),
  });

  const data = await response.json();
  console.log(data);
});

// Fetch the read endpoint to have access to the data
async function guestBookContainer() {
  const response = await fetch(serverURL);
  const data = await response.json();
  console.log(data);

  data.forEach((item) => {
    const guestBookItem = document.createElement("div");
    guestBookItem.className = "guestBookItem";
    guestBookItem.innerHTML = `
      <h3>${item.visitor_name}</h3>
      <p>${item.location}</p>
      <p>${item.favourite_city}</p>
      <p>${item.feedback}</p>`;
    guestBookContainer.appendChild(guestBookItem);
  });
}
fetch(serverURL);
