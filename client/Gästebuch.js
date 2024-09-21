// DOM maniupulation
//select form
//select the feedback container

// form
// we need an event to submit the form data
// the event handler and the event listener
// the event handler
// prevent default behavior
// then we need a FormData object template
//then we need to gert the formValues to insert into Formdata object

// fetch the CREATE ENDPOINT to send the form values to the server
// remeber when you finish local host
//fetch("localhost-url/endpoint"),
//{
//   method:
//! Rememebr main attribute
//        headers:
//    body:
//
//        };

//the listener

//Feedback container
//fetch the read endpoint to have acess rto the data
//fetch url
//parse the response into json
//wrangle data, if necesary

//I need to display data to page
// DataTransfer.forEach((item)=> {
//i need to create one DOM element per piece of data.
//});
// i need to assign the values to tthe text content property
//   for the example , the text content property for a h1 will have a value of username from my database data
// Ineed to individually append those elements to the DOM
// fixing textarea box size //! from stackoverflow

const form = document.getElementById("form");
const guestBookContainer = document.getElementById("guestBookContainer");
const textarea = document.getElementById("textarea");
const heightLimit = 500;
//this is the event listener for the comment box to expand as the user types and reaches the height limit of 500px it'll then scroll
textarea.oninput = function () {
  textarea.style.height = "500";
  textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
};
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData);
  const response = await fetch(
    "https://week-4-visitor-guest-book.onrender.com/addFeedback",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    }
  );
  const data = await response.json();
  console.log(data);
  displayFeedback();
});

async function displayFeedback() {
  const response = await fetch(
    "https://week-4-visitor-guest-book.onrender.com/getFeedback"
  );
  const feedback = await response.json();
  guestBookContainer.innerHTML = "";
  feedback.forEach((entry) => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("entry");
    entryDiv.innerHTML = `
      <h3>${entry.visitor_name} from ${entry.location}</h3>
      <p>Favourite city: ${entry.favourite_city}</p>
      <p>${entry.feedback}</p>
    `;
    guestBookContainer.appendChild(entryDiv);
  });
}

displayFeedback();
//this will display the feedback on the page
