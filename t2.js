let btnRef = document.querySelectorAll(".button-option");
let popupRef = document.querySelector(".popup");
let newgameBtn = document.getElementById("new-game");
let restartBtn = document.getElementById("restart");
let msgRef = document.getElementById("message");

// Winning Pattern Array
let winningPattern = [
  [0, 1, 2],
  [0, 3, 6],
  [2, 5, 8],
  [6, 7, 8],
  [3, 4, 5],
  [1, 4, 7],
  [0, 4, 8],
  [2, 4, 6],
];

let xTurn = true;
let count = 0;
let singlePlayer = true;

// Disable All Buttons
const disableButtons = () => {
  btnRef.forEach((element) => (element.disabled = true));
  // Enable popup
  popupRef.classList.remove("hide");
};

// Enable all buttons (For New Game and Restart)
const enableButtons = () => {
  btnRef.forEach((element) => {
    element.innerText = "";
    element.disabled = false;
  });
  // Disable popup
  popupRef.classList.add("hide");
  xTurn = true;
  count = 0;
};

// This function is executed when a player wins
const winFunction = (letter) => {
  disableButtons();
  if (letter == "X") {
    msgRef.innerHTML = "&#x1F389; <br> 'X' Wins";
  } else {
    msgRef.innerHTML = "&#x1F389; <br> 'O' Wins";
  }
};

// Function for draw
const drawFunction = () => {
  disableButtons();
  msgRef.innerHTML = "&#x1F60E; <br> It's a Draw";
};

// New Game
newgameBtn.addEventListener("click", () => {
  choice();
  enableButtons();
});

restartBtn.addEventListener("click", () => {
  enableButtons();
});

// Win Logic
const winChecker = () => {
  // Loop through all win patterns
  for (let i of winningPattern) {
    let [element1, element2, element3] = [
      btnRef[i[0]].innerText,
      btnRef[i[1]].innerText,
      btnRef[i[2]].innerText,
    ];
    // Check if elements are filled
    // If 3 elements are same and non-empty, we have a win
    if (element1 != "" && element2 != "" && element3 != "") {
      if (element1 == element2 && element2 == element3) {
        // If all 3 buttons have same values then pass the value to winFunction
        winFunction(element1);
        return true;
      }
    }
  }
  return false;
};

// AI Move
const aiMove = () => {
  // Prioritize winning, then blocking, then random
  const findBestMove = () => {
    // Try to find a winning move
    for (let i of winningPattern) {
      let [a, b, c] = i;
      if (btnRef[a].innerText == "O" && btnRef[b].innerText == "O" && btnRef[c].innerText == "") return c;
      if (btnRef[a].innerText == "O" && btnRef[c].innerText == "O" && btnRef[b].innerText == "") return b;
      if (btnRef[b].innerText == "O" && btnRef[c].innerText == "O" && btnRef[a].innerText == "") return a;
    }
    // Try to block opponent's winning move
    for (let i of winningPattern) {
      let [a, b, c] = i;
      if (btnRef[a].innerText == "X" && btnRef[b].innerText == "X" && btnRef[c].innerText == "") return c;
      if (btnRef[a].innerText == "X" && btnRef[c].innerText == "X" && btnRef[b].innerText == "") return b;
      if (btnRef[b].innerText == "X" && btnRef[c].innerText == "X" && btnRef[a].innerText == "") return a;
    }
    // Random move as fallback
    let availableCells = [];
    btnRef.forEach((btn, index) => {
      if (btn.innerText === "") {
        availableCells.push(index);
      }
    });
    return availableCells[Math.floor(Math.random() * availableCells.length)];
  };

  let bestMove = findBestMove();
  btnRef[bestMove].innerText = "O";
  btnRef[bestMove].disabled = true;
  xTurn = true;
  count += 1;
  if (winChecker()) {
    return;
  }
  if (count === 9) {
    drawFunction();
  }
};

// Display X/O on click
btnRef.forEach((element) => {
  element.addEventListener("click", () => {
    if (xTurn) {
      xTurn = false;
      // Display X
      element.innerText = "X";
      element.disabled = true;
      count += 1;
      if (winChecker()) {
        return;
      }
      if (count === 9) {
        drawFunction();
      }
      if (singlePlayer && !xTurn) {
        setTimeout(aiMove, 500); // Adding delay for better UX
      }
    } else if (!singlePlayer) {
      element.innerText = "O";
      element.disabled = true;
      xTurn = true;
      count += 1;
      if (winChecker()) {
        return;
      }
      if (count === 9) {
        drawFunction();
      }
    }
  });
});

// Choose single or multiplayer
const choice = () => {
  let playerChoice = prompt("Enter 1 for single player, 2 for multiplayer:");
  if (playerChoice === "1") {
    singlePlayer = true;
  } else {
    singlePlayer = false;
  }
};

// Enable Buttons and disable popup on page load
window.onload = () => {
  choice();
  enableButtons();
};
