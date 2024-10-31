document.addEventListener("DOMContentLoaded", () => {
  loadGamesFromStorage();
});

document.getElementById("gameInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addGame();
  }
});

function addGame() {
  const gameInput = document.getElementById("gameInput");
  const gameName = gameInput.value.trim();

  if (gameName === "") {
    alert("Please enter a game name.");
    return;
  }

  addGameToList(gameName, "playingList");
  gameInput.value = "";
  saveGamesToStorage();
}

function addGameToList(name, listId) {
  const list = document.getElementById(listId);

  const listItem = document.createElement("li");
  listItem.textContent = name;

  listItem.appendChild(createButtons(listId));

  list.appendChild(listItem);
}

function moveGame(item, targetListId) {
  const targetList = document.getElementById(targetListId);

  item.querySelector(".list-buttons").remove();
  item.appendChild(createButtons(targetListId));

  targetList.appendChild(item);
  saveGamesToStorage();
}

function createButtons(currentListId) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("list-buttons");

  if (currentListId !== "playingList") {
    const playingButton = document.createElement("button");
    playingButton.textContent = "Currently Playing";
    playingButton.onclick = () =>
      moveGame(buttonContainer.parentElement, "playingList");
    buttonContainer.appendChild(playingButton);
  }

  if (currentListId !== "wantToPlayList") {
    const wantToPlayButton = document.createElement("button");
    wantToPlayButton.textContent = "Want to Play";
    wantToPlayButton.onclick = () =>
      moveGame(buttonContainer.parentElement, "wantToPlayList");
    buttonContainer.appendChild(wantToPlayButton);
  }

  if (currentListId !== "finishedList") {
    const finishedButton = document.createElement("button");
    finishedButton.textContent = "Finished";
    finishedButton.onclick = () =>
      moveGame(buttonContainer.parentElement, "finishedList");
    buttonContainer.appendChild(finishedButton);
  }

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.onclick = () => {
    buttonContainer.parentElement.remove();
    saveGamesToStorage();
  };
  buttonContainer.appendChild(removeButton);

  return buttonContainer;
}

function saveGamesToStorage() {
  const playingGames = Array.from(
    document.getElementById("playingList").children
  ).map((item) => item.firstChild.textContent);
  const wantToPlayGames = Array.from(
    document.getElementById("wantToPlayList").children
  ).map((item) => item.firstChild.textContent);
  const finishedGames = Array.from(
    document.getElementById("finishedList").children
  ).map((item) => item.firstChild.textContent);

  const gamesData = {
    playing: playingGames,
    wantToPlay: wantToPlayGames,
    finished: finishedGames,
  };

  localStorage.setItem("gamesData", JSON.stringify(gamesData));
}

function loadGamesFromStorage() {
  const storedGames = JSON.parse(localStorage.getItem("gamesData"));

  if (storedGames) {
    storedGames.playing.forEach((game) => addGameToList(game, "playingList"));
    storedGames.wantToPlay.forEach((game) =>
      addGameToList(game, "wantToPlayList")
    );
    storedGames.finished.forEach((game) => addGameToList(game, "finishedList"));
  }
}
