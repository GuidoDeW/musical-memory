// Get DOM elements
const instructBtn = document.getElementById("instruct-btn"),
  hideBtn = document.getElementById("hide-btn"),
  instructions = document.getElementById("instructions"),
  game = document.getElementById("game"),
  selectLevel = document.getElementById("select-difficulty"),
  selectKey = document.getElementById("select-key"),
  selectScale = document.getElementById("select-scale"),
  results = document.getElementById("results");

//Event listeners
instructBtn.addEventListener("click", () =>
  instructions.classList.toggle("show")
);
hideBtn.addEventListener("click", () => instructions.classList.remove("show"));
game.addEventListener("click", flipCard);
selectLevel.addEventListener("change", (e) => setLevel(e.target.value));

selectKey.addEventListener("change", () => {
  loadCards(selectLevel.value);
});
selectScale.addEventListener("change", () => loadCards(selectLevel.value));
document.addEventListener("DOMContentLoaded", init);

// let difficulty = selectLevel.value;
let flipCount = 0;
// Adjust maxFlipped according to difficulty level
let maxFlipped = 2;

//Pre-select key, scale and level, and start game
function init() {
  // Add LS functionality?
  selectKey.selectedIndex = "1";
  selectScale.selectedIndex = "0";
  selectLevel.selectedIndex = "0";
  setLevel(selectLevel.value);
}

function setLevel(difficulty) {
  //Function is only called on change. Adjust maxFlipped
  switch (difficulty) {
    case "easy":
      maxFlipped = 2;
      break;
    case "medium":
      maxFlipped = 3;
      break;
    case "hard":
      maxFlipped = 4;
  }

  // Load new card set
  loadCards(difficulty);
}

//Circle of fifths-based scale components
const allNotes = ["C", "D", "E", "F", "G", "A", "B"];
const sharpKeys = ["G", "D", "A", "E", "B", "F"];
const sharpInds = [6, 2, 5, 1, 4, 0];
const flatKeys = ["F", "B", "E", "A", "D", "G"];
const flatInds = [3, 0, 4, 1, 5, 2];

//Degrees
const degrees = [
  { text: "I", match: [1], type: "degree" },
  { text: "II", match: [2], type: "degree" },
  { text: "III", match: [3], type: "degree" },
  { text: "IV", match: [4], type: "degree" },
  { text: "V", match: [5], type: "degree" },
  { text: "VI", match: [6], type: "degree" },
  { text: "VII", match: [7], type: "degree" },
];

//Chord qualities
const chordQuals = [
  {
    scale: "major",
    quals: [
      { text: "Xmaj7", match: [1, 4], type: "qual" },
      { text: "Xmin7", match: [2, 3, 6], type: "qual" },
      { text: "Xmin7", match: [2, 3, 6], type: "qual" },
      { text: "Xmaj7", match: [1, 4], type: "qual" },
      { text: "X7", match: [5], type: "qual" },
      { text: "Xmin7", match: [2, 3, 6], type: "qual" },
      { text: "Xmin7&flat;5", match: [7], type: "qual" },
    ],
  },
  {
    scale: "natmin",
    quals: [
      { text: "Xmin7", match: [1, 4, 5], type: "qual" },
      { text: "Xmin7&flat;5", match: [2], type: "qual" },
      { text: "Xmaj7", match: [3, 6], type: "qual" },
      { text: "Xmin7", match: [1, 4, 5], type: "qual" },
      { text: "Xmin7", match: [1, 4, 5], type: "qual" },
      { text: "Xmaj7", match: [3, 6], type: "qual" },
      { text: "X7", match: [7], type: "qual" },
    ],
  },
  {
    scale: "harmmin",
    quals: [
      { text: "XminMaj7", match: [1], type: "qual" },
      { text: "Xmin7&flat;5", match: [2], type: "qual" },
      { text: "Xmaj7&sharp;5", match: [3], type: "qual" },
      { text: "Xmin7", match: [4], type: "qual" },
      { text: "X7", match: [5], type: "qual" },
      { text: "Xmaj7", match: [6], type: "qual" },
      { text: "Xdim7", match: [7], type: "qual" },
    ],
  },
  {
    scale: "melmin",
    quals: [
      { text: "XminMaj7", match: [1], type: "qual" },
      { text: "Xmin7", match: [2], type: "qual" },
      { text: "Xmaj7&sharp;5", match: [3], type: "qual" },
      { text: "X7", match: [4, 5], type: "qual" },
      { text: "X7", match: [4, 5], type: "qual" },
      { text: "Xmin7&flat;5", match: [6, 7], type: "qual" },
      { text: "Xmin7&flat;5", match: [6, 7], type: "qual" },
    ],
  },
];

//Functions
const chordFuncs = [
  {
    text: "Tonic",
    match: [1],
    type: "func",
  },
  {
    text: "Supertonic",
    match: [2],
    type: "func",
  },
  {
    text: "Mediant",
    match: [3],
    type: "func",
  },
  {
    text: "Subdominant",
    match: [4],
    type: "func",
  },
  {
    text: "Dominant",
    match: [5],
    type: "func",
  },
  {
    text: "Submediant",
    match: [6],
    type: "func",
  },
  {
    text: "Leading tone",
    match: [7],
    type: "func",
  },
];

function loadScale(tone, acc, mode) {
  let newScale = [];
  for (let i = allNotes.indexOf(tone); i < allNotes.length; i++) {
    newScale.push(allNotes[i]);
  }
  for (let j = 0; j < allNotes.indexOf(tone); j++) {
    newScale.push(allNotes[j]);
  }
  if (acc === "f") {
    for (let i = 0; i <= flatKeys.indexOf(tone); i++) {
      newScale[flatInds[i]] += "&flat;";
    }
  } else {
    for (let i = 0; i <= sharpKeys.indexOf(tone); i++) {
      newScale[sharpInds[i]] += "&sharp;";
    }
  }
  if (mode !== "major") {
    newScale[2] = newScale[2].includes("&sharp;")
      ? newScale[2].slice(0, 1)
      : newScale[2].concat("&flat;");
    if (mode !== "melmin") {
      newScale[5] = newScale[5].includes("&sharp;")
        ? newScale[5].slice(0, 1)
        : newScale[5].concat("&flat;");
      if (mode !== "harmmin") {
        newScale[6] = newScale[6].includes("&sharp;")
          ? newScale[6].slice(0, 1)
          : newScale[6].concat("&flat;");
      }
    }
  }
  return newScale;
}

function loadCards(difficulty) {
  // Empty out playing field
  game.innerHTML = "";
  // Reset flip count
  flipCount = 0;
  let cards = loadScale(
    selectKey.value.charAt(0),
    selectKey.value.charAt(1),
    selectScale.value
  )
    .map((card, index) => {
      return { text: card, match: [index + 1], type: "note" };
    })
    .concat(degrees);
  if (difficulty !== "easy") {
    // Load chord qualities
    cards = cards.concat(
      chordQuals.find((item) => item.scale === selectScale.value).quals
    );
  }
  if (difficulty === "hard") {
    // Load chord functions
    cards = cards.concat(chordFuncs);
  }
  // Shuffle cards
  cards
    .map((card) => ({ value: card, shuffle: Math.random() }))
    .sort((a, b) => a.shuffle - b.shuffle)
    .map((card) => card.value)
    .forEach((card) => {
      // Load into DOM (flipped over)
      let cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      cardDiv.setAttribute("data-match", `${card.match.join(",")}`);
      cardDiv.setAttribute("data-type", `${card.type}`);
      cardDiv.innerHTML = card.text;
      game.appendChild(cardDiv);
      // cardDiv.addEventListener("click", checkMatch());
    });
  // Adjust innerText per li per slot
  updateBar(cards);
}

function flipCard(e) {
  // Check if target is (unflipped) card
  if (
    e.target.classList.contains("card") &&
    !e.target.classList.contains("flip") &&
    !e.target.classList.contains("solved")
  ) {
    // Check number of flipped cards
    if (flipCount >= maxFlipped) {
      document
        .querySelectorAll(".flip")
        .forEach((flippedCard) => flippedCard.classList.remove("flip"));
      // Flip all cards back down, reset flip count
      flipCount = 0;
    }
    // Add flip class to target and update flip count
    if (!e.target.classList.contains("flip")) {
      e.target.classList.add("flip");
      flipCount++;
      //Check match if max number of cards flipped
      if (flipCount === maxFlipped) {
        checkMatch();
      }
    }
  }
}

function checkMatch() {
  let flippedCards = document.querySelectorAll(".flip");
  // Convert NodeList into array
  let flippedArr = [...flippedCards];
  // Get match value from first card in array
  let matchVal = [...flippedCards]
    .filter((card) => card.getAttribute("data-match").toString().length == 1)[0]
    .getAttribute("data-match");
  // Check if all flipped cards have the same match value and different types
  if (
    flippedArr.every((card) =>
      card.getAttribute("data-match").includes(matchVal)
    ) &&
    flippedArr.length ==
      [...new Set(flippedArr.map((card) => card.getAttribute("data-type")))]
        .length
  ) {
    flippedCards.forEach((card) => {
      card.classList.add("solved");
      card.classList.remove("flip");
    });
    showProps(matchVal, selectLevel.value);
    // Reset flip count
    flipCount = 0;
  }
}

function updateBar(cards) {
  let resultBar = document.querySelectorAll(".slot");
  //Remove "found" class from all elements
  resultBar.forEach((slot) =>
    slot.querySelectorAll("li").forEach((li) => li.classList.remove("found"))
  );
  // Fill out note slots
  cards
    .filter((card) => card.type === "note")
    .forEach(
      (card, index) =>
        (resultBar[index].querySelector(".note").innerHTML = card.text)
    );
  //Fill out quality slots
  cards
    .filter((card) => card.type === "qual")
    .forEach(
      (card, index) =>
        (resultBar[index].querySelector(".qual").innerHTML = card.text)
    );
  console.log(cards);
}

function showProps(matchVal, difficulty) {
  let solvedUl = document.getElementById(`slot-${matchVal}`);
  solvedUl
    .querySelectorAll(".note")
    .forEach((note) => note.classList.add("found"));
  if (difficulty !== "easy") {
    solvedUl
      .querySelectorAll(".qual")
      .forEach((qual) => qual.classList.add("found"));
  }
  if (difficulty === "hard") {
    solvedUl
      .querySelectorAll(".chordfunc")
      .forEach((func) => func.classList.add("found"));
  }
}
