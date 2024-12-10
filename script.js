'use strict';

// Selecting elements
const player0EL = document.querySelector('.player--0');
const player1EL = document.querySelector('.player--1');
const score0EL = document.getElementById('score--0');
const score1EL = document.getElementById('score--1');
const diceEL = document.querySelector('.dice');
const btnNewEL = document.querySelector('.btn--new');
const btnRollEL = document.querySelector('.btn--roll');
const btnHoldEL = document.querySelector('.btn--hold');
const current0EL = document.getElementById('current--0');
const current1EL = document.getElementById('current--1');
const gameTitle = document.querySelector('.game-title');

// Game state variables
let scores, currentScore, activePlayer, playing, player1Timer;

// Initialize the game
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0EL.textContent = 0;
  score1EL.textContent = 0;
  current0EL.textContent = 0;
  current1EL.textContent = 0;

  diceEL.classList.add('hidden');
  player0EL.classList.add('player--active');
  player1EL.classList.remove('player--active');
  player0EL.classList.remove('player--winner');
  player1EL.classList.remove('player--winner');

  gameTitle.textContent = 'Your Turn';

  clearTimeout(player1Timer); // Clear any existing timers
};

// Switch player
const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0EL.classList.toggle('player--active');
  player1EL.classList.toggle('player--active');
  gameTitle.textContent = activePlayer === 0 ? 'Your Turn' : 'Computer Playing';

  if (activePlayer === 1) {
    setTimeout(computerPlay, 1000); // Computer starts playing after 1 second
  } else {
    startPlayer1Timer(); // Restart timer for Player 1
  }
};

// Roll the dice
const diceRolling = function () {
  diceEL.classList.remove('hidden');
  const dice = Math.trunc(Math.random() * 6) + 1;
  diceEL.src = `dice-${dice}.png`;
  return dice;
};

// Computer's turn
const computerPlay = function () {
  if (!playing) return;

  let dice;
  while (currentScore < 20) {
    dice = diceRolling();
    if (dice === 1) {
      switchPlayer();
      return;
    } else {
      currentScore += dice;
      current1EL.textContent = currentScore;
    }
  }
  scores[1] += currentScore;
  score1EL.textContent = scores[1];
  if (scores[1] >= 100) {
    playing = false;
    diceEL.classList.add('hidden');
    player1EL.classList.add('player--winner');
    gameTitle.textContent = 'Computer Wins! 🤖';
  } else {
    switchPlayer();
  }
};

// Timer for Player 1
const startPlayer1Timer = function () {
  clearTimeout(player1Timer); // Clear any existing timer
  player1Timer = setTimeout(() => {
    if (activePlayer === 0 && playing) {
      gameTitle.textContent = "Time's Up! Computer's Turn.";
      switchPlayer();
    }
  }, 10000); // 10-second timer
};

// Button: Roll Dice
btnRollEL.addEventListener('click', function () {
  if (playing && activePlayer === 0) {
    clearTimeout(player1Timer); // Clear timer when Player 1 rolls
    const dice = diceRolling();
    if (dice !== 1) {
      currentScore += dice;
      current0EL.textContent = currentScore;
    } else {
      gameTitle.textContent = 'Oops! You rolled a 1.';
      switchPlayer();
    }
  }
});

// Button: Hold
btnHoldEL.addEventListener('click', function () {
  if (playing && activePlayer === 0) {
    clearTimeout(player1Timer); // Clear timer when Player 1 holds
    scores[0] += currentScore;
    score0EL.textContent = scores[0];
    if (scores[0] >= 100) {
      playing = false;
      diceEL.classList.add('hidden');
      player0EL.classList.add('player--winner');
      gameTitle.textContent = 'You Win! 🎉';
    } else {
      gameTitle.textContent = "Turn held! Computer's Turn.";
      switchPlayer();
    }
  }
});

// Button: New Game
btnNewEL.addEventListener('click', init);

// Initialize the game at the start
init();
