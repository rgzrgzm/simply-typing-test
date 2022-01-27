// Init vars
const api_quote = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteContainer = document.getElementById("quote");
const textarea = document.querySelector("textarea");
const startBtn = document.getElementById("start-test");
const stopBtn = document.getElementById("stop-test");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

document.addEventListener("DOMContentLoaded", () => {
  textarea.value = "";

  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";

  textarea.disabled = true;
  fetchNewQuote();
});

async function fetchNewQuote() {
  const response = await fetch(api_quote);

  const data = await response.json();
  quote = data.content;

  console.log(quote);

  //Extraer el valor de quote y retornar cada letra en un span
  let arr = quote.split("").map((value) => {
    return "<span class='quote-chars'>" + value + "</span>";
  });

  quoteContainer.innerHTML += arr.join("");
  //   console.log(quoteContainer);
}

startBtn.addEventListener("click", () => {
  mistakes = 0;
  timer = "";
  textarea.disabled = false;
  startTimer();

  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
});

textarea.addEventListener("input", () => {
  //Obtener todos los spans con los chars
  let quoteChars = document.querySelectorAll(".quote-chars");

  //Crear un array de los spans capturados
  quoteChars = Array.from(quoteChars);

  //array de letras ingresadas por el usuario
  let userInputChars = textarea.value.split("");

  //Recorrer cada letra del arreglo, extraidos de la frase
  quoteChars.forEach((char, index) => {
    //Comparar la letra de la frase corresponda al que escribe usuario
    if (char.innerText == userInputChars[index]) {
      char.classList.add("success");
    }
    // Pero si no escribe nada o no coincide...
    else if (userInputChars[index] == null) {
      // quitamos todas las clases
      if (char.classList.contains("success")) {
        char.classList.remove("success");
      } else {
        char.classList.remove("fail");
      }
    } else {
      if (!char.classList.contains("fails")) {
        char.classList.add("fail");
        mistakes += 1;
      }

      const mistakesText = document.getElementById("mistakes");
      mistakesText.innerText = mistakes;
      mistakesText.classList.add("fail");
    }
  });

  let check = quoteChars.every((element) => {
    return element.classList.contains("succes");
  });

  if (check) {
    showResults();
  }
});

stopBtn.addEventListener("click", showResults);

function showResults() {
  document.querySelector(".result").style.display = "block";
  // quitamos el temporizador
  clearInterval(timer);
  //Ocultamos boton de "stop"
  document.getElementById("stop-test").style.display = "none";
  textarea.disabled = true;

  let timeTaken = 1;
  if (time != 0) {
    timeTaken = (60 - time) / 100;
  }

  document.getElementById("wpm").innerText =
    (textarea.value.length / 5 / timeTaken).toFixed(2) + "wpm";

  document.getElementById("accuracy").innerText =
    Math.round(
      ((textarea.value.length - mistakes) / textarea.value.length) * 100
    ) + "%";
}

function updateTime() {
  if (time == 0) {
    //Juego terminado...
    showResults();
  } else {
    document.getElementById("timer").innerText = `${--time}s`;
  }
}

//Temporizador
function startTimer() {
  time = 60;
  timer = setInterval(updateTime, 1000);
}
