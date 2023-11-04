const addWordBtn = document.querySelector("#addWordBtn");
const updateWordBtn = document.querySelector("#updateWordBtn");
const cancelBtn = document.querySelector("#cancelBtn");
const endPointRoot = "https://nsinghsidhu12.com/COMP4537/labs/6/api/v1/";
let userData;

/**
 * Gets the list of languages from the server and populates the select elements
 */
async function getLanguages() {
  let languages = [];

  const response = await fetch(`${endPointRoot}languages`);

  if (!response.ok) {
    throw new Error();
  }

  const data = await response.json();
  data.forEach((language) => {
    languages.push(language.name);
  });

  return languages;
}

/**
 * On page load, populate the select elements with the list of languages
 */
window.addEventListener("load", async () => {
  const languages = await getLanguages();
  const selectWordLanguage = document.querySelector("#wordLanguage");
  const selectDefinitionLanguage = document.querySelector(
    "#definitionLanguage"
  );

  languages.forEach((language) => {
    const option = document.createElement("option");
    option.value = language;
    option.text = language;
    selectWordLanguage.appendChild(option);
    selectDefinitionLanguage.appendChild(option.cloneNode(true));
  });
});

addWordBtn.addEventListener("click", async () => {
  const wordTextArea = document.querySelector("#userWord");
  const definitionTextArea = document.querySelector("#userDefinition");
  const resultLabel = document.querySelector("#resultLabel");
  const errorLabel = document.querySelector("#errorLabel");
  const enterWord = "Please enter a word and definition";
  const update = "Word already exists, would you like to update the definition?";
  let response;
  let wordExists;

  const userWord = wordTextArea.value;
  const userDefinition = definitionTextArea.value;

  if (userWord === "" || userDefinition === "") {
    resultLabel.innerHTML = "";
    errorLabel.textContent = enterWord;
    return;
  }
  errorLabel.textContent = "";

  // create the body of the request
  userData = {
    word: userWord,
    definition: userDefinition,
    wordLang: document.querySelector("#wordLanguage").value,
    definitionLang: document.querySelector("#definitionLanguage").value,
  };

  // do a get request to see if the word already exists
  await fetch(`${endPointRoot}definition/${userWord}`)
    .then((res) => {
      response = res;
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .then(() => {
      wordExists = true;
    })
    .catch(() => {
      wordExists = false;
    });

  if (wordExists) {
    resultLabel.innerHTML = update;
    updateWordBtn.style.display = "block";
    cancelBtn.style.display = "block";
  } else {
    postWord(userData);
  }
});

updateWordBtn.addEventListener("click", () => {
  patchWord(userData);
});

cancelBtn.addEventListener("click", () => {
  updateWordBtn.style.display = "none";
  cancelBtn.style.display = "none";
  resultLabel.innerHTML = "";
});

function postWord(data) {
  const numEntriesLabel = document.querySelector("#numEntriesLabel");
  const totalEntriesString = "Total entries: ";

  fetch(`${endPointRoot}definition`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    // get the response
    .then((res) => {
      response = res;
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      resultLabel.innerHTML = data.message;
      numEntriesLabel.innerHTML = totalEntriesString + data.total;
    })
    .catch((err) => {
      resultLabel.innerHTML = "";
      response.json().then((data) => {
        errorLabel.innerHTML = data.message;
        numEntriesLabel.innerHTML = totalEntriesString + data.total;
      });
    });
}

function patchWord(data) {
  const numEntriesLabel = document.querySelector("#numEntriesLabel");
  const totalEntriesString = "Total entries: ";

  fetch(`${endPointRoot}definition/${data.word}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      response = res;
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .then((data) => {
      resultLabel.innerHTML = data.message;
      numEntriesLabel.innerHTML = totalEntriesString + data.total;
      updateWordBtn.style.display = "none";
      cancelBtn.style.display = "none";
    })
    .catch((err) => {
      resultLabel.innerHTML = "";
      response.json().then((data) => {
        errorLabel.innerHTML = data.message;
        numEntriesLabel.innerHTML = totalEntriesString + data.total;
      });
    });
}
