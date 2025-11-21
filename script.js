const music = document.getElementById("bgMusic");

const quiz = [
  {
    q: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    answer: 3
  },
  {
    q: "Sino si Don Aldrich?",
    options: [
      "BADJAO",
      "UGHH SARAP!",
      "Mag-ggym",
      "Masarap"
    ],
    answer: 1
  },
  {
    q: "What year was JavaScript created?",
    options: ["1995", "2001", "1990", "1998"],
    answer: 0
  }
];

let current = 0;
let score = 0;

let timeLeft = 10;
let timerInterval;

// Start Quiz
function startQuiz() {
  music.play();
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("questionCard").style.display = "flex";
  loadQuestion();
}

// Load Question
function loadQuestion() {
  startTimer();

  const q = quiz[current];
  document.getElementById("questionText").innerText = q.q;

  const options = document.querySelectorAll(".option");

  options.forEach((opt, index) => {
    opt.innerText = q.options[index];
    opt.classList.remove("correct", "wrong");
    opt.style.pointerEvents = "auto";  // enable clicking again
  });
}

// Start Timer
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 10;
  const timerEl = document.getElementById("timer");

  timerEl.innerText = "Time: " + timeLeft;
  timerEl.classList.remove("shake"); // make sure shake is removed at start

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.innerText = "Time: " + timeLeft;

    // When timer is 3 seconds or less → shake!
    if (timeLeft <= 3) {
      timerEl.classList.add("shake");
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerEl.classList.remove("shake"); // stop shaking after time ends

      current++; // move to next question
      if (current < quiz.length) {
        loadQuestion();
      } else {
        showResult();
      }
    }
  }, 1000);
}

function selectAnswer(choice) {
  clearInterval(timerInterval);

  const correctIndex = quiz[current].answer;
  const options = document.querySelectorAll(".option");

  // Disable clicking after answering
  options.forEach(opt => opt.style.pointerEvents = "none");

  // If correct answer selected
  if (choice === correctIndex) {
    score++;
    options[choice].classList.add("correct");
  } 
  else {
    // Wrong answer
    options[choice].classList.add("wrong");

    // Highlight correct answer
    options[correctIndex].classList.add("correct");
  }

  // Wait 1 second before going to next question
  setTimeout(() => {
    current++;
    if (current < quiz.length) {
      loadQuestion();
    } else {
      showResult();
    }
  }, 1000);
}

// Show Final Score
function showResult() {
  document.getElementById("questionCard").style.display = "none";
  document.getElementById("resultScreen").style.display = "flex";

  document.getElementById("resultText").innerText =
    "Your Score: " + score + " / " + quiz.length;
}

// Restart
function restartQuiz() {
  current = 0;
  score = 0;
  clearInterval(timerInterval);

  document.getElementById("resultScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
}

