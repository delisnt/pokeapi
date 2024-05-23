const containerCards = document.querySelector(".container-cards");
const filterBtn = document.querySelectorAll(".filter-btns");
const searchBar = document.querySelector('#search-bar')
const searchBtn = document.querySelector('.search-btn')
const img = document.querySelector('img')
const loader = document.querySelector('.loader-container')
const switchBtns = Array.from(document.querySelectorAll('.shiny-btns'))
const typeColor = {
  bug: "#26de81",
  dragon: "#ffeaa7",
  electric: "#fed330",
  fairy: "#FF0069",
  fighting: "#30336b",
  fire: "#f0932b",
  flying: "#81ecec",
  grass: "#00b894",
  ground: "#EFB549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afc0",
  poison: "#6c5ce7",
  psychic: "#a29bfe",
  rock: "#2d3436",
  water: "#0190FF",
};

function render(obj) {
    const hp = obj.stats[0].base_stat;
    const imgSrc = obj.sprites.front_default;
    const pokeName = obj.name[0].toUpperCase() + obj.name.slice(1);
    const statAttack = obj.stats[1].base_stat;
    const statDefense = obj.stats[2].base_stat;
    const statSpeed = obj.stats[5].base_stat;
    const frontShiny = obj.sprites.front_shiny;
    const pokemonID = obj.id
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "zoom");
    containerCards.appendChild(cardDiv);
    cardDiv.innerHTML = `        
            <div class="circle-div">   
            <h3>${pokeName}</h3>
                <img src="${imgSrc}" alt="">
            </div>
            <span id="hp-stat">HP ${hp}</span>
            <div class="types">
            </div>
            <div class="stats">
                <div class="stat-attack">
                    <span>${statAttack}</span>
                    <span>Attack</span>
                </div>
                <div class="stat-defense">
                    <span>${statDefense}</span>
                    <span>Defense</span>
                </div>
                <div class="stat-speed">
                    <span>${statSpeed}</span>
                    <span>Speed</span>
                </div>`;
    obj.types.forEach(item => {
      let span = document.createElement('span');
      span.textContent = item.type.name;
      cardDiv.querySelector(".types").appendChild(span);
    });
    cardDiv.addEventListener('click', ()=> {
      sessionStorage.setItem(pokeName, hp)
    })
    styleCard(cardDiv, obj);

    switchBtns.forEach((btn) => {
      btn.addEventListener('click')
      img.setAttribute("src", frontShiny)
    })
}




function styleCard(card, cardData) {
  if (cardData.types && cardData.types.length > 0) {
    const firstType = cardData.types[0].type.name.toLowerCase();
    const color = typeColor[firstType];
    if (color) {
      card.querySelector(".circle-div").style.backgroundColor = color;
    }}
  cardData.types.forEach(item => {
    const color = typeColor[item.type.name.toLowerCase()];
    if (color) {
      card.querySelectorAll(".types span").forEach((spanColor) => {
        if (spanColor.textContent.toLowerCase() === item.type.name.toLowerCase()) {
          spanColor.style.backgroundColor = color;
        }
      });
    }
  });
};



function hideLoader() {
  loader.classList.add('hidden');
}


window.addEventListener("load", async () => {
  try {
    loader.classList.remove('hidden')
    containerCards.classList.add('hidden')
    const pokemonArr = []
    const fetchData = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0"
    );
    const pokemonData = await fetchData.json();
    const fetchSinglePokemon = pokemonData.results;
    async function fetchPokemon(url) {
      const fetchedData = await fetch(url);
      return await fetchedData.json();
    }

    for (const poke of fetchSinglePokemon) {
      const url = poke.url;
      const fetchedPokemon = await fetchPokemon(url);
      render(fetchedPokemon);
      pokemonArr.push(fetchedPokemon)
    }


  


filterBtn.forEach((btn) => {
  if (typeColor.hasOwnProperty(btn.dataset.type)) {
    btn.style.backgroundColor = typeColor[btn.dataset.type];
  }
  btn.addEventListener("click", () => {
    const type = btn.dataset.type;
    console.log(type);
    if (type === "clear") {
      containerCards.innerHTML = "";
      pokemonArr.forEach(pkmn => {
        render(pkmn)
      })
    } else {
      containerCards.innerHTML = "";
      const filteredPokemon = pokemonArr.filter(pokemon => pokemon.types.some(item => item.type.name.toLowerCase() === type));
      filteredPokemon.forEach(pkmn => {
        render(pkmn);
      })
    }
  });
});
searchBtn.addEventListener('click', () => {
  const input = searchBar.value.toLowerCase();
  const searchedPokemon = pokemonArr.find(e => e.name === input);
  if (!searchedPokemon){
    alert("Pokemon not found!")
  } else {
    containerCards.innerHTML = "";
    render(searchedPokemon)
  }
})
  } catch (error) {
    console.error(error);
  } finally {
    loader.classList.add('hidden');
    containerCards.classList.remove('hidden')
  }
});
