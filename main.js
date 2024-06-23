import { allNanograms, namesNono } from "./nano.js";

const main = document.createElement("main");
main.classList.add("main");
document.body.appendChild(main);
const wrapper = document.createElement("div");
wrapper.classList.add("wrapper");
main.appendChild(wrapper);
const title = document.createElement("h1");
title.classList.add("title");
title.textContent = "Nonograms Game";
wrapper.appendChild(title);
const line = document.createElement("div");
const line2 = document.createElement("div");
line.classList.add("line");
line2.classList.add("line");
const menu = document.createElement("div");
menu.classList.add("menu");
wrapper.appendChild(menu);
const wrapperForGridAndLeftCl = document.createElement("div");
wrapperForGridAndLeftCl.classList.add("wrapper-left-grid");
const leftClue = document.createElement("div");
leftClue.classList.add("left-clue");
wrapperForGridAndLeftCl.appendChild(leftClue);
const topClue = document.createElement("div");
topClue.classList.add("top-clue");
const aditBtnsWrapper = document.createElement("div");
aditBtnsWrapper.classList.add("adti-btns-wrapper");
wrapper.appendChild(aditBtnsWrapper);
const centerSide = document.createElement("div");
centerSide.appendChild(topClue);
centerSide.appendChild(wrapperForGridAndLeftCl);
const infoArea = document.createElement("div");
infoArea.classList.add("info-area");
centerSide.classList.add("center-side");
wrapper.appendChild(infoArea);
wrapper.appendChild(centerSide);
wrapper.appendChild(line2);
const gridArea = document.createElement("div");
const listWrapper = document.createElement("ul");
listWrapper.classList.add("list-wrapper");
const leftSideBtns = document.createElement("div");
leftSideBtns.classList.add("left-side-btns");
const scoreBtn = document.createElement("button");
scoreBtn.setAttribute("index", 0);
scoreBtn.classList.add("score-btn");
scoreBtn.title = "Score table";
const audioBtn = document.createElement("button");
audioBtn.setAttribute("index", 1);
audioBtn.classList.add("audio-btn");
leftSideBtns.appendChild(scoreBtn);
leftSideBtns.appendChild(audioBtn);
wrapper.appendChild(leftSideBtns);
const switcher = document.createElement("button");
switcher.classList.add("switcher");
switcher.setAttribute("index", 2);
leftSideBtns.appendChild(switcher);

const modal = document.createElement("div");
modal.classList.add("modal");
const modalBody = document.createElement("div");
modalBody.classList.add("modal-body");
modal.appendChild(modalBody);
document.body.appendChild(modal);
const modalBtn = document.createElement("button");
const btnWrapper = document.createElement("div");
const timeInner = document.createElement("span");
timeInner.classList.add("timer");
timeInner.textContent = "00:00";

//sounds
const clickSound = new Audio("./assets/audio/click.mp3");
const cleanSound = new Audio("./assets/audio/cleanSound.mp3");
const crossSound = new Audio("./assets/audio/cross.mp3");
const winSound = new Audio("./assets/audio/win.mp3");
const btnSound = new Audio("./assets/audio/btn.mp3");
const allSounds = [clickSound, cleanSound, crossSound, winSound, btnSound];

//variables global
const startIndex = Math.floor(allNanograms.easy.length * Math.random());
let level = "easy";
let currentNono = allNanograms[level][startIndex];
let indexOfCurrentNano = startIndex;
let intervalTime;
let timer = JSON.parse(localStorage.getItem("storedData"))
  ? JSON.parse(localStorage.getItem("storedData")).time
  : 0;
let isClick = false;
let isLoad = false;
let isMuted = false;
let isDark = false;

function soundPlay(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}

function renderGameArea(nonogram) {
  gridArea.classList.add("grid-area");
  for (let i = 0; i < nonogram.length; i++) {
    for (let j = 0; j < nonogram[i].length; j++) {
      const square = document.createElement("div");
      // square.setAttribute("posY", j)
      // square.setAttribute("posX", i)
      square.classList.add("square");
      gridArea.appendChild(square);
    }
  }
  wrapperForGridAndLeftCl.appendChild(gridArea);
}

function searchClue(nonogram, horizont = true) {
  const outputArr = [];
  for (let i = 0; i < nonogram.length; i++) {
    let curArr = [];
    let counter = 0;
    for (let j = 0; j < nonogram[i].length; j++) {
      if (horizont ? nonogram[i][j] : nonogram[j][i]) {
        counter++;
      } else {
        if (counter > 0) {
          curArr.push(counter);
          counter = 0;
        }
      }
    }
    if (counter > 0) {
      curArr.push(counter);
    }
    outputArr.push(curArr);
  }
  return outputArr;
}

function renderClue(arr, target) {
  target.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    const clueCeil = document.createElement("div");
    clueCeil.classList.add(
      target === topClue ? "clue-ceil-top" : "clue-ceil-left"
    );
    for (let j = 0; j < arr[i].length; j++) {
      const clueSub = document.createElement("div");
      clueSub.classList.add(
        target === topClue ? "sub-clue-top" : "sub-clue-left"
      );
      clueSub.textContent = arr[i][j];
      target === topClue
        ? clueCeil.classList.add("clue-multi-top")
        : clueCeil.classList.add("clue-multi-left");
      clueCeil.appendChild(clueSub);
    }
    target.appendChild(clueCeil);
  }
}

function positioning() {
  // const top = gridArea.getBoundingClientRect().top;
  topClue.style.width = gridArea.offsetWidth + "px";
}

function levelBtns() {
  btnWrapper.classList.add("btn-level-wrapper");
  let btnEasy, btnMedium, btnHard;
  [btnEasy, btnMedium, btnHard].forEach((el, i) => {
    el = document.createElement("button");
    el.classList.add("btn");
    el.setAttribute("num", i);
    i === 0 ? (el.textContent = "Easy") : null;
    i === 1 ? (el.textContent = "Medium") : null;
    i === 2 ? (el.textContent = "Hard") : null;
    btnWrapper.appendChild(el);
  });
  menu.appendChild(btnWrapper);
  btnWrapper.addEventListener("click", (e) => {
    if (e.target === btnWrapper) {
      return;
    }
    soundPlay(btnSound);
    isLoad = false;
    indexOfCurrentNano = 0;
    if (+e.target.getAttribute("num") === 0 && !e.target.disabled) {
      level = "easy";
      e.target.disabled = true;
      btnWrapper.children[1].disabled = false;
      btnWrapper.children[2].disabled = false;
      btnWrapper.children[0].classList.add("btn-active");
      btnWrapper.children[1].classList.remove("btn-active");
      btnWrapper.children[2].classList.remove("btn-active");
    }
    if (+e.target.getAttribute("num") === 1 && !e.target.disabled) {
      level = "medium";
      e.target.disabled = true;
      btnWrapper.children[0].disabled = false;
      btnWrapper.children[2].disabled = false;
      btnWrapper.children[1].classList.add("btn-active");
      btnWrapper.children[0].classList.remove("btn-active");
      btnWrapper.children[2].classList.remove("btn-active");
    }
    if (+e.target.getAttribute("num") === 2 && !e.target.disabled) {
      level = "hard";
      e.target.disabled = true;
      btnWrapper.children[0].disabled = false;
      btnWrapper.children[1].disabled = false;
      btnWrapper.children[2].classList.add("btn-active");
      btnWrapper.children[0].classList.remove("btn-active");
      btnWrapper.children[1].classList.remove("btn-active");
    }
    currentNono = allNanograms[level][indexOfCurrentNano];
    showList(level);
    resetGame();
  });
}

window.addEventListener("resize", positioning);

function addBorders() {
  const arr = document.querySelectorAll(".square");
  arr.forEach((item, index) => {
    if (currentNono.length > 10) {
      if ((index + 1) % 5 === 0 && (index + 1) % 15 !== 0) {
        item.style.borderRight = `2px solid ${
          document.body.classList.contains("night-theme")
            ? "aliceblue"
            : "black"
        }`;
      }
      if (
        (index + 1 > 60 && index + 1 <= 75) ||
        (index + 1 > 135 && index + 1 <= 150)
      ) {
        item.style.borderBottom = `2px solid ${
          document.body.classList.contains("night-theme")
            ? "aliceblue"
            : "black"
        }`;
      }
    }
    if (currentNono.length > 5 && currentNono.length <= 10) {
      if ((index + 1) % 5 === 0 && (index + 1) % 10 !== 0) {
        item.style.borderRight = `2px solid ${
          document.body.classList.contains("night-theme")
            ? "aliceblue"
            : "black"
        }`;
      }
      if (index + 1 > 40 && index + 1 <= 50) {
        item.style.borderBottom = `2px solid ${
          document.body.classList.contains("night-theme")
            ? "aliceblue"
            : "black"
        }`;
      }
    }
  });
}

function clickToCeil() {
  gridArea.addEventListener("click", (e) => {
    if (!isClick) {
      isClick = true;
      console.log(timer);
      setTime(!isLoad ? 0 : timer, timeInner);
    }

    if (!e.target.classList.contains("square-cross")) {
      e.target.classList.toggle("square-active");
    } else {
      e.target.classList.toggle("square-cross");
      e.target.classList.toggle("square-active");
    }
    if (e.target.classList.contains("square-active")) {
      soundPlay(clickSound);
    } else {
      soundPlay(cleanSound);
    }
    checkerForCorrect(e);
    checkBtnStatus();
  });
}

function clickToRightBtn() {
  gridArea.addEventListener("contextmenu", (e) => {
    if (!isClick) {
      isClick = true;
      setTime(!isLoad ? 0 : timer, timeInner);
    }
    e.preventDefault();
    if (e.target.classList.contains("square-active")) {
      e.target.classList.toggle("square-active");
    }
    e.target.classList.toggle("square-cross");
    if (e.target.classList.contains("square-cross")) {
      soundPlay(crossSound);
    } else {
      soundPlay(cleanSound);
    }
    checkerForCorrect(e);
    checkBtnStatus();
  });
}
function styleSettings(arr) {
  if (arr.length <= 5) {
    gridArea.style.gridTemplateColumns = "repeat(5, 1fr)";
    gridArea.style.gridTemplateRows = "repeat(5, 1fr)";
  }
  if (arr.length > 5 && arr.length < 15) {
    gridArea.style.gridTemplateColumns = "repeat(10, 1fr)";
    gridArea.style.gridTemplateRows = "repeat(10, 1fr)";
  }
  if (arr.length > 10) {
    gridArea.style.gridTemplateColumns = "repeat(15, 1fr)";
    gridArea.style.gridTemplateRows = "repeat(15, 1fr)";
  }
}

function showList(level) {
  listWrapper.innerHTML = "";

  for (let i = 0; i < namesNono[level].length; i++) {
    const li = document.createElement("li");
    li.style = `--num:${i};`;
    li.setAttribute("index", i);
    li.textContent = namesNono[level][i];
    listWrapper.appendChild(li);
    if (i === indexOfCurrentNano) {
      li.classList.add("list-active");
    } else {
      li.classList.remove("list-active");
    }
  }
  menu.appendChild(listWrapper);
}

//events
listWrapper.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target === listWrapper) {
    return;
  }
  soundPlay(btnSound);
  isLoad = false;
  indexOfCurrentNano = +e.target.getAttribute("index");
  currentNono = allNanograms[level][indexOfCurrentNano];
  for (let i = 0; i < listWrapper.children.length; i++) {
    if (indexOfCurrentNano === +listWrapper.children[i].getAttribute("index")) {
      listWrapper.children[i].classList.add("list-active");
    } else {
      listWrapper.children[i].classList.remove("list-active");
    }
  }
  resetGame();
});

modalBtn.addEventListener("click", () => {
  soundPlay(btnSound);
  modal.classList.remove("modal-active");
  document.body.style.overflow = "visible";
});

aditBtnsWrapper.addEventListener("click", (e) => {
  if(e.target === aditBtnsWrapper) {
    return;
  }
  soundPlay(btnSound);
  if (+e.target.getAttribute("btn-id") === 0) {
    isLoad = false;
    resetGridArea();
    setBtnDisabled(aditBtnsWrapper.children[1], true);
  }
  if (+e.target.getAttribute("btn-id") === 1) {
    saveGame();
    checkBtnStatus();
    aditBtnsWrapper.children[4].classList.add("btn-saved");
    setTimeout(() => {
      aditBtnsWrapper.children[4].classList.remove("btn-saved");
    }, 2000);
  }
  if (+e.target.getAttribute("btn-id") === 2) {
    setBtnDisabled(aditBtnsWrapper.children[1], true)
    resetGridArea();
    showSolution();
  }
  if (+e.target.getAttribute("btn-id") === 3) {
    isLoad = false;
    randomGameClick();
  }
  if (+e.target.getAttribute("btn-id") === 4) {
    loadGame();
  }
});

leftSideBtns.addEventListener("click", (e) => {
  if (e.target === leftSideBtns) {
    return;
  }
  soundPlay(btnSound);
  if (+e.target.getAttribute("index") === 0) {
    renderScore();
  }
  if (+e.target.getAttribute("index") === 1) {
    checkSoundMode(isMuted, e.target);
    soundsBtnClick(isMuted);
  }
  if (+e.target.getAttribute("index") === 2) {
    isDark = !isDark;
    switcher.classList.toggle("switcher-active");
    document.body.classList.toggle("night-theme");
    addBorders();
  }
});

function checkSoundMode(status, target) {
  if (!status) {
    isMuted = true;
    target.classList.add("audio-btn-active");
  } else {
    isMuted = false;
    target.classList.remove("audio-btn-active");
  }
}

function soundsBtnClick(status) {
  for (let i = 0; i < allSounds.length; i++) {
    if (status) {
      allSounds[i].muted = true;
    } else {
      allSounds[i].muted = false;
    }
  }
}

function randomGameClick() {
  const levels = ["easy", "medium", "hard"];
  let currentLevelNum = levels.indexOf(level);
  let newLevelNum;

  do {
    newLevelNum = Math.floor(Math.random() * 3);
  } while (newLevelNum === currentLevelNum);
  level = levels[newLevelNum];
  indexOfCurrentNano = Math.floor(Math.random() * allNanograms[level].length);
  currentNono = allNanograms[level][indexOfCurrentNano];
  for (let i = 0; i < btnWrapper.children.length; i++) {
    if (
      +btnWrapper.children[i].getAttribute("num") === newLevelNum &&
      !btnWrapper.children[i].disabled
    ) {
      btnWrapper.children[i].classList.add("btn-active");
      btnWrapper.children[i].disabled = true;
    } else {
      btnWrapper.children[i].classList.remove("btn-active");
      btnWrapper.children[i].disabled = false;
    }
  }
  resetGame();
  showList(level);
}

function resetGridArea() {
  for (let i = 0; i < gridArea.children.length; i++) {
    if (
      gridArea.children[i].classList.contains("square-active") ||
      gridArea.children[i].classList.contains("square-cross")
    ) {
      gridArea.children[i].classList.remove("square-active");
      gridArea.children[i].classList.remove("square-cross");
    }
  }
  clearInterval(intervalTime);
  timeInner.textContent = "00:00";
  gridArea.style.pointerEvents = "auto";
  isClick = false;
}

function showSolution() {
  const flatedArr = currentNono.flat(5);
  for (let i = 0; i < flatedArr.length; i++) {
    if (flatedArr[i]) {
      gridArea.children[i].classList.add("square-active");
    }
  }
  gridArea.style.pointerEvents = "none";
}

function checkerForCorrect(e) {
  const usersSolution = [];
  for (let i = 0; i < gridArea.children.length; i++) {
    if (gridArea.children[i].classList.contains("square-active")) {
      usersSolution.push(1);
    } else {
      usersSolution.push(0);
    }
  }
  if (usersSolution.join("") === currentNono.flat(5).join("")) {
    winSound.volume = 0.5;
    soundPlay(winSound);
    openModal();
    saveWinsGames();
  }
}

function renederInfo() {
  infoArea.innerHTML = "";
  infoArea.appendChild(timeInner);
}

//save to local storage
function saveGame() {
  const savedGrid = gridArea.innerHTML;
  const gameStore = {
    levelGame: level,
    index: indexOfCurrentNano,
    game: savedGrid,
    time: timer,
    sound: isMuted,
    mode: isDark,
  };
  localStorage.setItem("storedData", JSON.stringify(gameStore));
}

//load game
function loadGame() {
  isLoad = true;
  const loadData = localStorage.getItem("storedData") || null;
  if (loadData) {
    const parsed = JSON.parse(loadData);
    level = parsed.levelGame;
    indexOfCurrentNano = parsed.index;
    currentNono = allNanograms[level][indexOfCurrentNano];
    isMuted = parsed.sound;
    isDark = parsed.mode;
    if (isMuted) {
      audioBtn.classList.add("audio-btn-active");
    } else {
      audioBtn.classList.remove("audio-btn-active");
    }
    if (isDark) {
      switcher.classList.add("switcher-active");
      document.body.classList.add("night-theme");
    } else {
      switcher.classList.remove("switcher-active");
      document.body.classList.remove("night-theme");
    }
    soundsBtnClick(isMuted);
    resetGame();
    if (timer > 0) {
      timer = parsed.time;
    } else {
      timer = 0;
    }

    gridArea.innerHTML = parsed.game;
    showList(level);
    let levelIndex = ["easy", "medium", "hard"].indexOf(level);
    for (let i = 0; i < btnWrapper.children.length; i++) {
      if (i === levelIndex) {
        btnWrapper.children[i].classList.add("btn-active");
        btnWrapper.children[i].disabled = true;
      } else {
        btnWrapper.children[i].classList.remove("btn-active");
        btnWrapper.children[i].disabled = false;
      }
    }
    timeInner.textContent = formatTime(timer);
  }
  addBorders();
}

function setTime(time, targetEl) {
  timer = time;
  intervalTime = setInterval(() => {
    timer++;
    let min = Math.floor(timer / 60);
    let sec = Math.floor(timer % 60);
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    targetEl.textContent = `${min}:${sec}`;
  }, 1000);
}

function formatTime(tim) {
  let min = Math.floor(tim / 60);
  let sec = Math.floor(tim % 60);
  min = min < 10 ? "0" + min : min;
  sec = sec < 10 ? "0" + sec : sec;
  return `${min}:${sec}`;
}

function checkBtnStatus() {
  const store = localStorage.getItem("storedData") || null;
  if (!store) {
    setBtnDisabled(aditBtnsWrapper.children[
        aditBtnsWrapper.children.length - 1
      ], true);
  } else {
    setBtnDisabled(aditBtnsWrapper.children[
        aditBtnsWrapper.children.length - 1
      ], false);
  }
  if (!isClick) {
    setBtnDisabled(aditBtnsWrapper.children[1], true)
  } else {
    setBtnDisabled(aditBtnsWrapper.children[1], false)
  }
}

function setBtnDisabled(target, status) {
    if(status) {
        target.classList.add("btn-disabled");
        target.disabled = true;
    } else {
        target.classList.remove("btn-disabled");
        target.disabled = false;
    }
}

function openModal() {
  gridArea.style.pointerEvents = "none";
  const winTitle = document.createElement("span");
  modalBtn.classList.add("btn");
  modalBtn.textContent = "Ok";
  winTitle.classList.add("modal-title");
  clearInterval(intervalTime);
  winTitle.textContent = `Great! You have solved the "${namesNono[level][indexOfCurrentNano]}" - nonogram in ${timer} seconds!`;
  modalBody.innerHTML = "";
  modalBody.appendChild(winTitle);
  modalBody.appendChild(modalBtn);
  modal.classList.add("modal-active");
  document.body.style.overflow = "hidden";
}

function saveWinsGames() {
  const winArray = localStorage.getItem("winsGames") || [];
  const userData = {
    winLevel: level,
    nameNano: namesNono[level][indexOfCurrentNano],
    time: timer,
  };
  if (!winArray.length) {
    winArray.push(userData);
    localStorage.setItem("winsGames", JSON.stringify(winArray));
  } else {
    let parsedArr = JSON.parse(localStorage.getItem("winsGames"));
    parsedArr.push(userData);
    if (parsedArr.length > 5) {
      parsedArr.shift();
    }
    localStorage.setItem("winsGames", JSON.stringify(parsedArr));
  }
}

function renderScore() {
  modalBody.innerHTML = "";
  const scoreWrapper = document.createElement("div");
  scoreWrapper.classList.add("score-wrapper");
  modalBody.appendChild(scoreWrapper);
  modalBtn.classList.add("btn");
  modalBtn.textContent = "Ok";
  const nameTitle = document.createElement("div");
  nameTitle.textContent = "Nonogram";
  nameTitle.classList.add("score-title")
  const levelTitle = document.createElement("div");
  levelTitle.textContent = "Level";
  levelTitle.classList.add("score-title")
  const timeTitle = document.createElement("div");
  timeTitle.textContent = "Time";
  timeTitle.classList.add("score-title")
  const posTitle = document.createElement("div");
  posTitle.textContent = "#";
  posTitle.classList.add("score-title")
  const nameWrap = document.createElement("div");
  const levelWrap = document.createElement("div");
  const timeWrap = document.createElement("div");
  const posNum = document.createElement("div");
  posNum.classList.add("scoreWr");
  nameWrap.classList.add("scoreWr");
  levelWrap.classList.add("scoreWr");
  timeWrap.classList.add("scoreWr");
  posNum.appendChild(posTitle);
  nameWrap.appendChild(nameTitle);
  levelWrap.appendChild(levelTitle);
  timeWrap.appendChild(timeTitle);
  const store = localStorage.getItem("winsGames") || null;
  if (store) {
    const parsed = JSON.parse(store);
    parsed.sort((a, b) => a.time - b.time);
    for (let i = 0; i < parsed.length; i++) {
      const name = document.createElement("span");
      name.classList.add("score-unit");
      const winLevel = document.createElement("span");
      winLevel.classList.add("score-unit");
      const time = document.createElement("span");
      const num = document.createElement("span");
      num.classList.add("score-unit");
      time.classList.add("score-unit");
      name.textContent = parsed[i].nameNano;
      winLevel.textContent = parsed[i].winLevel;
      time.textContent = formatTime(parsed[i].time);
      num.textContent = `${i + 1}`;
      posNum.appendChild(num);
      levelWrap.appendChild(winLevel);
      nameWrap.appendChild(name);
      timeWrap.appendChild(time);
      scoreWrapper.appendChild(posNum);
      scoreWrapper.appendChild(nameWrap);
      scoreWrapper.appendChild(levelWrap);
      scoreWrapper.appendChild(timeWrap);
    }
  } else {
    const empty = document.createElement("span");
    empty.classList.add("empty-list");
    empty.textContent = "Score list is empty!";
    scoreWrapper.appendChild(empty);
  }
  modalBody.appendChild(modalBtn);
  modal.classList.add("modal-active");
  document.body.style.overflow = "hidden";
}

function renderAdditionalBns() {
  for (let i = 0; i < 5; i++) {
    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.classList.add("btn-adit");
    btn.setAttribute("btn-id", i);
    i === 0 ? (btn.textContent = "Reset") : null;
    i === 1 ? (btn.textContent = "Save") : null;
    i === 2 ? (btn.textContent = "Solution") : null;
    i === 3 ? (btn.textContent = "Random") : null;
    i === 4 ? (btn.textContent = "Load") : null;
    aditBtnsWrapper.appendChild(btn);
  }
}

function resetGame() {
  gridArea.style.pointerEvents = "auto";
  clearInterval(intervalTime);
  timeInner.textContent = "00:00";
  isClick = false;
  gridArea.innerHTML = "";
  renderGameArea(currentNono);
  styleSettings(currentNono);
  renderClue(searchClue(currentNono, false), topClue);
  renderClue(searchClue(currentNono), leftClue);
  addBorders();
  positioning();
  renederInfo();
  checkBtnStatus();
}

//start

function startGame() {
  renderGameArea(currentNono);
  positioning();
  addBorders();
  renderClue(searchClue(currentNono), leftClue);
  renderClue(searchClue(currentNono, false), topClue);
  clickToCeil();
  clickToRightBtn();
  levelBtns();
  showList(level);
  renderAdditionalBns();
  btnWrapper.children[0].classList.add("btn-active");
  renederInfo();
  checkBtnStatus();
}

startGame();
