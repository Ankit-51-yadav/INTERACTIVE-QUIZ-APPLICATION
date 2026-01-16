let quizData = [];

fetch('https://opentdb.com/api.php?amount=10&category=18&type=multiple')
  .then(response => response.json())
  .then(data => {
    quizData = data.results.map(item => {
      const question = item.question;
      const correctAnswer = item.correct_answer;
      const options = [...item.incorrect_answers, item.correct_answer];
      shuffleArray(options);
      const answer = options.indexOf(correctAnswer);
      return { question, options, answer };
    });
    loadQuestion();
  });

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const scoreEl = document.getElementById("score");

function loadQuestion() {
  feedbackEl.textContent = "";
  nextBtn.style.display = "none";
  optionsEl.innerHTML = "";

  const current = quizData[currentQuestion];
  questionEl.textContent = current.question;

  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => checkAnswer(index, button);
    optionsEl.appendChild(button);
  });
}

function checkAnswer(selectedIndex, button) {
  const correctIndex = quizData[currentQuestion].answer;
  const buttons = optionsEl.querySelectorAll("button");

  buttons.forEach(btn => btn.disabled = true);

  if (selectedIndex === correctIndex) {
    button.classList.add("correct");
    feedbackEl.textContent = "Correct Answer!";
    score++;
  } else {
    button.classList.add("wrong");
    buttons[correctIndex].classList.add("correct");
    feedbackEl.textContent = "Wrong Answer!";
  }

  nextBtn.style.display = "block";
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  questionEl.textContent = "Quiz Completed!";
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  nextBtn.style.display = "none";
  scoreEl.textContent = `Your Score: ${score} / ${quizData.length}`;
}
