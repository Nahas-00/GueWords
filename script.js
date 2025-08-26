let solution = "";
let allowedWords = [];

 fetch("words.json")
  .then(res=>res.json())
  .then(words=>{
    solution = getDailyWord(words);

    if (hasPlayedToday()) {
      Toastify({
        text: "✅ You already played today! Come back tomorrow.",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#b27c25ff",
      }).showToast();
    }

  });

  fetch("guesses.json")
    .then(res=>res.json())
    .then(data=>{
      allowedWords = data;
    });

  let currentRow = 0;
  let currentCol = 0;
  const rows = document.querySelectorAll('.grid');

  if(!hasPlayedToday()){
    document.addEventListener('keydown',handleKeyPress);
  }

  function handleKeyPress(e){
    const key = e.key.toLowerCase();

    if(key === 'backspace' && currentCol>0){
      currentCol--;
      rows[currentRow].children[currentCol].textContent = "";
    }else if(key === 'enter' && currentCol === 5){
      checkGuess();
    }else if (/^[a-z]$/.test(key) && currentCol < 5) {
      rows[currentRow].children[currentCol].textContent = key.toUpperCase();
      currentCol++;
    }
  }

  function checkGuess() {
  let guess = "";
  for (let cell of rows[currentRow].children) {
    guess += cell.textContent.toLowerCase();
  }

  if (!allowedWords.includes(guess)) {
    Toastify({
      text: "❌ Not a valid word!",
      duration: 2000,
      gravity: "top",
      position: "center",
      backgroundColor: "orange",
    }).showToast();
    return;
  }

  const cells = Array.from(rows[currentRow].children);

  cells.forEach((cell, i) => {
    setTimeout(() => {
      cell.classList.add('flip');

      // After flip animation, set the color
      setTimeout(() => {
        if (guess[i] === solution[i]) {
          cell.classList.add('correct');
        } else if (solution.includes(guess[i])) {
          cell.classList.add('present');
        } else {
          cell.classList.add('absent');
        }
        cell.classList.remove('flip');
      }, 300); 
    }, i * 300); 
  });


  setTimeout(() => {
    if (guess === solution) {
      Toastify({
        text: "🎉 You Win!",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "green",
      }).showToast();
      markPlayed();
      document.removeEventListener("keydown", handleKeyPress);
      return;
    }

    currentRow++;
    currentCol = 0;

    if (currentRow === 5) {
      Toastify({
        text: `❌ You Lose! Word was: ${solution.toUpperCase()}`,
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();
      markPlayed();
      document.removeEventListener("keydown", handleKeyPress);
    }
  }, cells.length * 300 + 100); 
}


  function getDailyWord(words){
    const startDate = new Date(2025,7,24);
    const today = new Date();
    const diff = Math.floor((today-startDate)/(1000*60*60*24));
    return words[diff % words.length];
  }

  function hasPlayedToday() {
  const today = new Date().toDateString();
  const lastPlayed = localStorage.getItem("lastPlayedDate");
  return lastPlayed === today;
  }

  function markPlayed(){
    const today = new Date().toDateString();
    localStorage.setItem("lastPlayedDate",today);
  }