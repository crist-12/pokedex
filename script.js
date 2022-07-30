// API variable setup

const url = "https://pokeapi.co/api/v2/pokemon/";
let pokemon = "";

// HTML element variable setup

const searchBox = document.getElementsByClassName("search-box")[0];
const searchButton = document.getElementsByClassName("search-button")[0];
const resultDiv = document.getElementsByClassName("result")[0];
const lights = document.getElementsByClassName("pokedex-lights-sm-light");

const pokemonImg = document.getElementsByClassName("pokedex-screen-image")[0];
const pokemonName = document.getElementsByClassName("pokemon-name")[0];
const pokemonTypes = document.getElementsByClassName("pokemon-types")[0];

const PRESS_SOUND = new Audio(
  'https://freesound.org/data/previews/467/467552_9892063-lq.mp3');

  const UPDATE_SOUND = new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/pokedex.mp3');
    
const FOUND_SOUND = new Audio("pokecenter.mp3");
// Search Button on click event

const LOADING_SOUND = new Audio("loading.wav");
LOADING_SOUND.loop = true;

searchButton.addEventListener("click", function() {
  runSearch();
})

// Event Listener for Enter keypress in search-box

searchBox.addEventListener("keypress", function(e) {
  if (e.which == 13) {
    runSearch();
  }
})

// runSearch function

function runSearch() {
  clearPokemon();
  
  pokemon = searchBox.value.toLowerCase();
  searchBox.value = "";
  
  // Start the blinking lights!
  for (let i = 0; i < lights.length; i++) {
    lights[i].classList.add("blink");
  }
  
  pokemonName.innerHTML = "Loading...";
  
  // Call API
  setTimeout(function() {
  let fullURL = url + pokemon;
  
    fetch(fullURL)
    .then(function(response) {
        if (!response.ok) { // No Pokemon found
            displayError();
        }
        return response.json();
    })
    .then(displayPokemon);
  }, 1500);
}

// Display no Pokemon found function

function displayError() {
  // Stop the blinking lights!
  for (let i = 0; i < lights.length; i++) {
    lights[i].classList.remove("blink");
  }
  
  clearPokemon();
  pokemonName.innerHTML = "No Pokemon found!";
}

// Display Pokemon function

function displayPokemon(result) {
  // Stop the blinking lights!
  for (let i = 0; i < lights.length; i++) {
    lights[i].classList.remove("blink");
  }
  
  // Clear any existing result first
  clearPokemon();
  
  let name = result.name.charAt(0).toUpperCase() + result.name.substring(1)
  FOUND_SOUND.play()
  pokemonImg.src = result.sprites["front_default"];
  pokemonName.innerHTML = name + "  #" + result.id;
  LOADING_SOUND.pause();
  for (let i = 0; i < result.types.length; i++) {
    let li = document.createElement("li");
    li.classList.add("pokemon-type");
    li.innerHTML = result.types[i].type.name;
    pokemonTypes.appendChild(li);
  }
}

// Clear pokemon from result

function clearPokemon() {
  pokemonImg.src = "";
  pokemonName.innerHTML = "";
  pokemonTypes.innerHTML = "";
}

// API FUNCTIONS //

var openFile = function(file) {
  PRESS_SOUND.play()
  pokemonImg.src = "loader.gif"
  var input = file.target;
  LOADING_SOUND.play();
  pokemonName.innerHTML = "Buscando..."
  pokemonTypes.innerHTML = ""
  console.log("Entrando")
  var reader = new FileReader();
  reader.onload = function(){
      var dataURL = reader.result;

      var parts = dataURL.split(';base64,');
      var contentType = parts[0].split(':')[1];
      var raw = window.atob(parts[1]);
      var rawLength = raw.length;

      var uInt8Array = new Uint8Array(rawLength);

      for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
      }
      console.log("Aqui 2")
      var imgContent = new Blob([uInt8Array], { type: contentType });

      $.ajax({
          url: "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/fcb00adb-ab06-4006-8262-6c2c6c202a90/classify/iterations/PokeClassification/image",
          beforeSend: function(xhrObj){
              // Request headers
              xhrObj.setRequestHeader("Prediction-Key","782e7affa5804a7f8df3929e2b91dac0");
              xhrObj.setRequestHeader("Content-Type","application/octet-stream");
          },
          type: "POST",
          // Request body
          data: imgContent,
          processData: false
      })
      .done(function(data) {
          //alert(data.predictions[0].tagName);
          var poke = data.predictions[0].tagName;
          searchBox.value = poke;
          runSearch()
          PRESS_SOUND.play()
          
        //  displayPokemon(poke)
         // console.log(data.predictions[0].tagName);
      })
      .fail(function() {
          alert("error");
          pokemonName.innerHTML = "Error :("
      });
  };

  reader.readAsDataURL(input.files[0]);
};