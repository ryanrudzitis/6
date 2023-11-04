const addWordBtn = document.querySelector("#addWordBtn");

// add event listener for when the page loads
async function getLanguages() {
  let languages = [];

  
}

addWordBtn.addEventListener("click", () => {
  const textArea = document.querySelector("#userWord");
  const resultLabel = document.querySelector("#resultLabel");
  const errorLabel = document.querySelector("#errorLabel");
  const userWord = textArea.value;
  const serverPort = 6001;
  const endPointRoot = "/COMP4537/labs/6/api/v1/";
  let response;

  if (userWord === "") {
    resultLabel.innerHTML = "";
    errorLabel.textContent = "Please enter a word";
    return;
  }

  errorLabel.textContent = "";
  resultLabel.textContent = "Searching...";

  // post the word to the server
  fetch(`http://localhost:${serverPort}${endPointRoot}definition/${userWord}`)
    
});
