const music = document.getElementById("bgMusic");

const quiz = [
  {
    q: "Which keyword is used to declare a variable in JavaScript?",
    options: ["var", "let", "const", "All of the above"],
    answer: 3
  },
  {
    q: "What does typeof NaN return?",
    options: [
      "number",
      "NaN",
      "undefined",
      "object"
    ],
    answer: 0
  },
  {
    q: "Which operator is used for equality without type coercion?",
    options: ["==", "===", "=", "!="],
    answer: 1
  },
  {
    q: "How do you write a comment in JavaScript?",
    options: [
      " <!-- Comment -->",
      " /* Comment */",
      "// Comment",
      "# Comment"
    ],
    answer: 2
  },
  {
    q: "What is the output of console.log(0.1 + 0.2 === 0.3);?",
    options: [
      "true",
      "false",
      "undefined",
      "TypeError"
    ],
    answer: 1
  },
  {
    q: " Which method converts a JSON string to a JavaScript object?",
    options: [
      "true",
      "false",
      "undefined",
      "TypeError"
    ],
    answer: 1
  }
];

let current = 0;
let score = 0;

let timeLeft = 10;
let timerInterval;

// Start Quiz
function startQuiz() {
  //music.play();
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("questionCard").style.display = "flex";
  loadQuestion();
}

// Load Question
function loadQuestion() {
  startTimer();
  music.play();
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

