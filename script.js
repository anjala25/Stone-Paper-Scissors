let userScore = 0;
let computerScore = 0;
let round = 1;
let totalGames = 0;
let wins = 0;
let matchOver = false;

const userScoreSpan = document.getElementById('user-score');
const computerScoreSpan = document.getElementById('computer-score');
const userBar = document.getElementById('user-bar');
const computerBar = document.getElementById('computer-bar');
const userChoiceP = document.getElementById('user-choice');
const computerChoiceP = document.getElementById('computer-choice');
const resultP = document.getElementById('game-result');
const historyList = document.getElementById('history-list');
const statusMessage = document.getElementById('status-message');
const totalGamesSpan = document.getElementById('total-games');
const winRateSpan = document.getElementById('win-rate');
const victoryBanner = document.getElementById('victory-banner');
const defeatBanner = document.getElementById('defeat-banner');

window.onload = () => {
  loadHistory();
};

function getComputerChoice(userChoice) {
  const difficulty = document.getElementById('difficulty').value;
  const choices = ['rock', 'paper', 'scissors'];

  if (difficulty === 'easy') {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  if (difficulty === 'medium') {
    return Math.random() < 0.7
      ? choices[Math.floor(Math.random() * choices.length)]
      : counterChoice(userChoice);
  }

  return counterChoice(userChoice);
}

function counterChoice(userChoice) {
  const counter = {
    rock: 'paper',
    paper: 'scissors',
    scissors: 'rock'
  };
  return counter[userChoice];
}

function determineWinner(userChoice, computerChoice) {
  if (!userChoice) return "lose";
  if (userChoice === computerChoice) return "tie";
  if (
    (userChoice === 'rock' && computerChoice === 'scissors') ||
    (userChoice === 'paper' && computerChoice === 'rock') ||
    (userChoice === 'scissors' && computerChoice === 'paper')
  ) return "win";
  return "lose";
}

function playGame(userChoice) {
  if (matchOver) return;

  disableButtons();

  const computerChoice = getComputerChoice(userChoice);
  const outcome = determineWinner(userChoice, computerChoice);
  let message = "";

  clearHighlights();
  if (userChoice) document.getElementById(userChoice).classList.add('highlight');

  if (outcome === "win") {
    userScore++;
    wins++;
    message = `✅ You win! ${userChoice} beats ${computerChoice}.`;
  } else if (outcome === "lose") {
    computerScore++;
    message = `❌ You lose! ${computerChoice} beats ${userChoice}.`;
  } else {
    message = "🤝 It's a tie!";
  }

  totalGames++;
  updateStats();
  updateUI(userChoice, computerChoice, message);
  checkMatchEnd();
  saveHistory();

  if (!matchOver) {
    setTimeout(() => {
      enableButtons();
    }, 1000);
  }
}

function updateUI(userChoice, computerChoice, message) {
  userScoreSpan.textContent = userScore;
  computerScoreSpan.textContent = computerScore;
  userBar.value = userScore;
  computerBar.value = computerScore;
  userChoiceP.textContent = `Your choice: ${userChoice || "None"}`;
  computerChoiceP.textContent = `Computer's choice: ${computerChoice}`;
  resultP.textContent = `Result: ${message}`;
  resultP.classList.add('animate');
  setTimeout(() => resultP.classList.remove('animate'), 500);
  statusMessage.textContent = `🎯 Round ${round} complete. Choose again!`;

  const li = document.createElement('li');
  li.textContent = `🎮 Round ${round}: ${message}`;
  historyList.prepend(li);
  round++;
}

function updateStats() {
  totalGamesSpan.textContent = totalGames;
  const rate = totalGames ? Math.round((wins / totalGames) * 100) : 0;
  winRateSpan.textContent = `${rate}%`;
}

function checkMatchEnd() {
  const maxRounds = parseInt(document.getElementById('match-format').value);
  const requiredWins = Math.ceil(maxRounds / 2);

  if (userScore >= requiredWins || computerScore >= requiredWins) {
    matchOver = true;
    statusMessage.textContent = userScore > computerScore
      ? "🏆 You won the match!"
      : "💻 Computer won the match!";
    disableButtons();
    document.getElementById('play-again-btn').style.display = 'inline-block';

    if (userScore > computerScore) {
      victoryBanner.style.display = 'block';
      victoryBanner.scrollIntoView({ behavior: 'smooth' });
    } else {
      defeatBanner.style.display = 'block';
      defeatBanner.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function resetGame() {
  userScore = 0;
  computerScore = 0;
  round = 1;
  totalGames = 0;
  wins = 0;
  matchOver = false;

  userScoreSpan.textContent = 0;
  computerScoreSpan.textContent = 0;
  userBar.value = 0;
  computerBar.value = 0;
  userChoiceP.textContent = "Your choice: ";
  computerChoiceP.textContent = "Computer's choice: ";
  resultP.textContent = "Result: ";
  statusMessage.textContent = "Make your move!";
  totalGamesSpan.textContent = 0;
  winRateSpan.textContent = "0%";
  historyList.innerHTML = "";

  clearHighlights();
  enableButtons();
  document.getElementById('play-again-btn').style.display = 'none';
  victoryBanner.style.display = 'none';
  defeatBanner.style.display = 'none';
}

function clearHighlights() {
  ['rock', 'paper', 'scissors'].forEach(id => {
    document.getElementById(id).classList.remove('highlight');
  });
}

function disableButtons() {
  ['rock', 'paper', 'scissors'].forEach(id => {
    document.getElementById(id).disabled = true;
  });
}

function enableButtons() {
  ['rock', 'paper', 'scissors'].forEach(id => {
    document.getElementById(id).disabled = false;
  });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  document.querySelector('.game-container').classList.toggle('dark-mode');
}

function saveHistory() {
  localStorage.setItem('rps-history', historyList.innerHTML);
}

function loadHistory() {
  const saved = localStorage.getItem('rps-history');
  if (saved) historyList.innerHTML = saved;
}