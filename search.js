const searchBtn = document.querySelector("#searchBtn");
const deleteBtn = document.querySelector("#deleteBtn");
const textArea = document.querySelector("#userWord");
const resultLabel = document.querySelector("#resultLabel");
const errorLabel = document.querySelector("#errorLabel");
const endPointRoot = "https://nsinghsidhu12.com/COMP4537/labs/6/api/v1/";

searchBtn.addEventListener("click", () => {
  const userWord = textArea.value;
  const enterWord = "Please enter a word";
  const definition = "Definition: ";
  const wordLanguage = "Word Language: ";
  const definitionLanguage = "Definition Language: ";
  let response;

  if (userWord === "") {
    resultLabel.innerHTML = "";
    errorLabel.textContent = enterWord;
    return;
  }

  errorLabel.textContent = "";
  deleteBtn.style.display = "none";

  fetch(`${endPointRoot}definition/${userWord}`)
    .then((res) => {
      response = res;
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .then((data) => {
      resultLabel.innerHTML = data.message;
      resultLabel.innerHTML += `<br><br>${definition} ${data.entry.definition}`;
      resultLabel.innerHTML += `<br>${wordLanguage} ${data.entry.word_language}`;
      resultLabel.innerHTML += `<br>${definitionLanguage} ${data.entry.definition_language}`;
      deleteBtn.style.display = "block";
    })
    .catch(() => {
      resultLabel.innerHTML = "";
      response.json().then((data) => {
        errorLabel.innerHTML = data.message;
      });
    });
});

deleteBtn.addEventListener("click", () => {
  const userWord = textArea.value;

  fetch(`${endPointRoot}definition/${userWord}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .then((data) => {
      resultLabel.innerHTML = data.message;
      deleteBtn.style.display = "none";
    })
    .catch(() => {
      resultLabel.innerHTML = "";
      response.json().then((data) => {
        errorLabel.innerHTML = data.message;
      });
    });
});
