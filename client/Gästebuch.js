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

const textarea = document.getElementById("textarea");
const heightLimit = 500;
textarea.oninput = function () {
  textarea.style.height = "";
  textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + px;
};
