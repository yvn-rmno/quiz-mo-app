const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const music = document.getElementById("bgMusic");

// New: Constant for Local Storage key
const HIGH_SCORES_KEY = 'quizMoHighScores';

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
        " Comment ",
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
    q: "Which method converts a JSON string to a JavaScript object?",
    options: [
        "JSON.stringify()",
        "JSON.parse()",
        "Object.convert()",
        "String.toObject()"
    ],
    answer: 1
},
{
    q: "Which data type in Python is an ordered, immutable sequence of elements?",
    options: [
    "tuple",
    "list",
    "set",
    "dictionary"
    ],
  answer: 0
},
{
    q: "What is the correct signature for the main method in a standard Java application?",
    options: [
    "public static int main(String[] args)",
    "private static void main(String[] args)",
    "public static void main(String args[])",
    "public void main(String[] args)"
    ],
  answer: 2
},
{
    q: "In Python, which built-in function is used to print output to the console?",
    options: [
    "write()",
    "printf()",
    "console.log()",
    "print()"
    ],
  answer: 3
},
{
    q: "What is the primary purpose of the semicolon (;) at the end of a statement in Java?",
    options: [
    "To define a code block",
    "To denote a comment",
    "To mark the end of a statement",
    "To declare a variable"
    ],
  answer: 2
},
];

let current = 0;
let score = 0;

let timeLeft = 10;
let timerInterval;

// --- HIGH SCORE FUNCTIONS ---

/** Safely retrieves high scores from Local Storage, returns array or empty array. */
function getHighScores() {
    const scoresJSON = localStorage.getItem(HIGH_SCORES_KEY);
    return scoresJSON ? JSON.parse(scoresJSON) : [];
}

/** Saves a new score, sorts the list, and keeps only the top 5. */
function saveHighScore(newScore) {
    const scores = getHighScores();
    
    // Create score object with the score and current date
    const newEntry = { score: newScore, date: new Date().toLocaleDateString() };
    scores.push(newEntry);
    
    // Sort scores from highest to lowest
    scores.sort((a, b) => b.score - a.score);
    
    // Keep only the top 5 scores
    const topScores = scores.slice(0, 5); 
    
    // Save back to Local Storage
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(topScores));
}

/** Updates the result screen with the final score and the high score list. */
function displayHighScores(resultMessage) {
    // Save the current score only if the quiz was completed (not quit)
    if (resultMessage.includes("Your Score")) {
        saveHighScore(score);
    }

    const highScores = getHighScores();
    
    // Build the high score list HTML
    let highScoresHTML = '<h3>🏆 Top Scores 🏆</h3><ul style="list-style: none; padding: 0;">';
    if (highScores.length > 0) {
        highScores.forEach((entry, index) => {
            // Using a simple list structure for display
            highScoresHTML += `<li style="background: rgba(255, 255, 255, 0.1); padding: 10px; margin-bottom: 8px; border-radius: 8px; display: flex; justify-content: space-between;">
                                <span>#${index + 1} | Score: ${entry.score} / ${quiz.length}</span>
                                <span>${entry.date}</span>
                              </li>`;
        });
    } else {
        highScoresHTML += '<li>No scores yet. Be the first!</li>';
    }
    highScoresHTML += '</ul>';

    // Update the result screen text using innerHTML
    document.getElementById("resultText").innerHTML = `
        ${resultMessage}
        <hr>
        ${highScoresHTML}
    `;
}

// --- GAME FLOW FUNCTIONS ---

// Start Quiz (no change)
function startQuiz() {
 document.getElementById("startScreen").style.display = "none";
 document.getElementById("questionCard").style.display = "flex";
 loadQuestion();
}

// Tutorial (no change)
function tutorial() {
 clearInterval(timerInterval); 
 alert("📚 QUIZ-MO Tutorial 📚\n\n" +
  "1. **Goal:** Answer all questions correctly to maximize your score.\n" +
  "2. **Time Limit:** You have 10 seconds to answer each question.\n" +
  "3. **Scoring:** You earn 1 point for each correct answer.\n" +
  "4. **Feedback:** Correct answers turn green, and incorrect answers turn red (showing the correct one).\n\n" +
  "Good luck!");

  if (document.getElementById("questionCard").style.display === "flex") {
   startTimer(); 
  }
}

// Exit Game (MODIFIED to call displayHighScores)
function exit() {
 clearInterval(timerInterval);
 music.pause();
 music.currentTime = 0;

 document.getElementById("startScreen").style.display = "none";
 document.getElementById("questionCard").style.display = "none";
 document.getElementById("resultScreen").style.display = "flex";

 // Call the new function to show "Game Quit" and the high score list
 displayHighScores("Game Quit. Thanks for playing!");
}

// Load Question (no change)
function loadQuestion() {
 startTimer();
 music.play();
 const q = quiz[current];
 document.getElementById("questionText").innerText = q.q;

 const options = document.querySelectorAll(".option");

 options.forEach((opt, index) => {
  opt.innerText = q.options[index];
  opt.classList.remove("correct", "wrong");
  opt.style.pointerEvents = "auto"; // enable clicking again
 });
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 10;

  const timerEl = document.getElementById("timer");
  const bar = document.getElementById("timerBar");

  // Reset text
  timerEl.innerText = "Time: " + timeLeft;
  timerEl.classList.remove("shake");

  // Reset bar instantly
  bar.style.transition = "none";
  bar.style.width = "100%";
  bar.classList.remove("timer-warning");

  // Begin animation after reset applies
  setTimeout(() => {
    bar.style.transition = "width 10s linear";
    bar.style.width = "0%";
  }, 50);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.innerText = "Time: " + timeLeft;

    // Under 3 seconds → shake + red bar
    if (timeLeft <= 3) {
      timerEl.classList.add("shake");
      bar.classList.add("timer-warning");
    }

    // Timer finished
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerEl.classList.remove("shake");
      bar.classList.remove("timer-warning");

      current++;
      if (current < quiz.length) {
        loadQuestion();
      } else {
        showResult();
      }
    }
  }, 1000);
}

// Select Answer (no change)
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

    // Play correct sound
    correctSound.currentTime = 0;
    correctSound.play();
}
else {
    options[choice].classList.add("wrong");
    options[correctIndex].classList.add("correct");

    // Play wrong sound
    wrongSound.currentTime = 0;
    wrongSound.play();
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

// Show Final Score (MODIFIED to stop music and call displayHighScores)
function showResult() {
 music.pause();
 music.currentTime = 0;
    
 document.getElementById("questionCard").style.display = "none";
 document.getElementById("resultScreen").style.display = "flex";

 // Call the new function to save score and display the high score list
 displayHighScores("Your Score: " + score + " / " + quiz.length);
}

// Restart (MODIFIED to stop music)
function restartQuiz() {
 current = 0;
 score = 0;
 clearInterval(timerInterval);

 music.pause();
 music.currentTime = 0;

 document.getElementById("resultScreen").style.display = "none";
 document.getElementById("startScreen").style.display = "flex";
}

function showScreen(screenId) {
    const screens = document.querySelectorAll('.container');
    
    screens.forEach(screen => {
        screen.classList.add('fade-out');
        setTimeout(() => {
            screen.style.display = "none";
        }, 400);
    });

    setTimeout(() => {
        const screen = document.getElementById(screenId);
        screen.style.display = "flex";
        screen.classList.remove('fade-out');
        screen.classList.add('fade-in');
    }, 450);
}