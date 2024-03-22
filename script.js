"use strict";
console.log("by michelcwn");
console.log("https://github.com/michelcwn");

//////////////////////////////////////////////////////////////////
// DOM ELEMENTS ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
const body = document.querySelector("body");
const toggle = document.getElementById("theme-toggle");
const iconMoon = document.querySelector(".header__icon path");
const iconArrow = document.querySelector(".header__font-arrow");
// submit
const input = document.querySelector(".header__input");
const form = document.querySelector(".header__form");
// data
const mainContent = document.querySelector(".main-content");
const wordTitle = document.querySelector(".main-content__title");
const wordPhonetics = document.querySelector(".main-content__phonetic");
const list = document.querySelector(".main-content__list--noun");
const listVerb = document.querySelector(".main-content__list--verb");
const synonymsDefinition = document.querySelector(
  ".main-content__synonyms-definition"
);
const quote = document.querySelector(".main-content__quote");
const sourceLink = document.querySelector(".main-content__source-link");
const play = document.querySelector(".main-content__icon--play");
const audioPlayer = document.getElementById("audioPlayer");
const noContent = document.querySelector(".no-content-found");
//err
const labelErr = document.querySelector(".label-err");
const errorContent = document.querySelector(".error-content");

//////////////////////////////////////////////////////////////////
// CHANGE THEME COLOR ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

toggle.addEventListener("click", function () {
  this.classList.toggle("theme-dark"); // Toggles the theme-dark class on the button

  if (document.body.classList.contains("theme-dark")) {
    document.body.classList.remove("theme-dark");
    document.body.classList.add("theme-light");
    iconMoon.setAttribute("stroke", "#838383");
  } else {
    document.body.classList.remove("theme-light");
    document.body.classList.add("theme-dark");
    iconMoon.setAttribute("stroke", "#a445ed");
  }
});

const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const displayPhonetics = (phoneticsData) => {
  const phoneticTexts = phoneticsData.filter((p) => p.text).map((p) => p.text);
  return phoneticTexts.length > 0 ? phoneticTexts[0] : "";
};

const displaySynonyms = (meanings) => {
  const synonymsText = meanings[0].synonyms;
  return synonymsText.join(", ");
};

const displayDefinitions = (definitions, listElement) => {
  listElement.innerHTML = ""; // Clear old definitions
  definitions.forEach((definition) => {
    const li = document.createElement("li");
    li.textContent = definition.definition;
    li.classList.add("main-content__item");
    listElement.appendChild(li);
  });
};

const areThereAnyVerbs = function (arrayOfMeanings) {
  const searchingVerb = arrayOfMeanings.filter(
    (meaning) => meaning.partOfSpeech === "verb"
  );

  if (searchingVerb.length > 0) {
    return searchingVerb[0].definitions;
  } else {
    return [];
  }
};

const displayVerbs = function (verbs, listElement) {
  listElement.innerHTML = "";
  verbs.forEach((verb) => {
    const li = document.createElement("li");
    li.textContent = verb.definition;
    li.classList.add("main-content__item");
    listElement.appendChild(li);
  });
};

const displayExample = function (ex) {
  if (ex && ex.example) {
    quote.textContent = ex.example;
  } else {
    quote.textContent = "No example provided.";
  }
};

// stock URL audio
let audioUrl = "";

const fetchDictionary = async (word) => {
  try {
    mainContent.classList.remove("hidden");
    errorContent.classList.add("hidden");
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!response.ok) {
      mainContent.classList.add("hidden");
      errorContent.classList.remove("hidden");
      throw new Error(
        `Failed to fetch data for word: ${word}, status: ${response.status}`
      );
    }
    const data = await response.json();
    console.log(data);

    const fetchedWord = data[0].word;
    const phonetics = displayPhonetics(data[0].phonetics);
    const synonymsString = displaySynonyms(data[0].meanings);
    const anyVerbs = areThereAnyVerbs(data[0].meanings);

    // Display word, phonetics, synonyms, example
    wordTitle.textContent = capitalizeFirstLetter(fetchedWord);
    wordPhonetics.textContent = phonetics;
    synonymsDefinition.textContent = synonymsString;
    displayExample(anyVerbs[0]);

    // Display definitions
    displayDefinitions(data[0].meanings[0].definitions, list);
    //Display Verbs
    if (anyVerbs.length > 0) {
      displayVerbs(anyVerbs, listVerb);
      noContent.classList.add("hidden"); // Hide message if verbs are present
    } else {
      noContent.classList.remove("hidden"); // Displays the message if there are no verbs
    }
    //Display source
    const url = data[0].sourceUrls;
    sourceLink.textContent = url[0];
    sourceLink.href = url[0];

    // Audio
    const phoneticsArray = data[0].phonetics;
    const firstNonEmptyAudio = phoneticsArray.find((p) => p.audio !== "");

    if (firstNonEmptyAudio) {
      audioUrl = firstNonEmptyAudio.audio; // Stocke l'URL audio
    } else {
      audioUrl = "";
    }

    return data;
  } catch (error) {
    console.error("Error fetching dictionary data:", error.message);
  }
};

play.addEventListener("click", function () {
  if (audioUrl) {
    audioPlayer.src = audioUrl; //  Set audio URL as source of audio item
    audioPlayer.play(); // play audio
  } else {
    console.log("Aucun audio à jouer");
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const word = input.value.trim();
  if (word) {
    fetchDictionary(word);
    labelErr.classList.add("hidden");
    form.style.border = "none";
    form.style.borderRadius = "1rem";
  } else {
    labelErr.classList.remove("hidden");
    form.style.border = "1px solid red";
    form.style.borderRadius = "1rem";
  }
});

//////////////////////////////////////////////////////////////
// CHANGE FONT
//////////////////////////////////////////////////////////////

document.querySelector(".header__font").addEventListener("click", function () {
  let dropdown = document.querySelector(".dropdown-menu");
  dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
});

window.addEventListener("click", function (e) {
  if (!document.querySelector(".header__font").contains(e.target)) {
    document.querySelector(".dropdown-menu").style.display = "none";
  }
});

const serif = document.querySelector(".serif");
const sansSerif = document.querySelector(".sans-serif");
const mono = document.querySelector(".mono");
const headerParagraph = document.querySelector(".header__font-paragraph");

sansSerif.addEventListener("click", function () {
  headerParagraph.textContent = "Sans Serif";
  body.style.fontFamily = "Arial, sans-serif";
});

serif.addEventListener("click", function () {
  headerParagraph.textContent = "Serif";
  body.style.fontFamily = "Times New Roman, serif";
});

mono.addEventListener("click", function () {
  headerParagraph.textContent = "Mono";
  body.style.fontFamily = "Courier New, monospace";
});
