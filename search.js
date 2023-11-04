const searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", () => {
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

  fetch(`http://localhost:${serverPort}${endPointRoot}definition/${userWord}`)
    .then((res) => {
      response = res;
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      console.log("got here");
      resultLabel.innerHTML = data.message;
      resultLabel.innerHTML += `<br><br>Definition: ${data.entry.definition}`;
      resultLabel.innerHTML += `<br>Word Language: ${data.entry.word_language}`;
      resultLabel.innerHTML += `<br>Definition Language: ${data.entry.definition_language}`;
    })
    .catch((err) => {
      resultLabel.innerHTML = "";
      response.json().then((data) => {
        console.error();
        console.log(data);
        errorLabel.innerHTML = data.message;
      });
    });
});
