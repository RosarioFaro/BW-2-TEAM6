document.getElementById("toggleFriendlist").addEventListener("click", function () {
  let col = document.getElementById("attivitaCol");
  col.classList.toggle("d-md-none");
});

document.getElementById("btnMostraAmici").addEventListener("click", function () {
  let col = document.getElementById("attivitaCol");

  col.classList.toggle("d-md-none");

  if (col.classList.contains("d-md-none")) {
    this.innerHTML = '<i class="bi bi-arrow-left-short h2 text-white"></i>';
  } else {
    this.innerHTML = '<i class="bi bi-arrow-right-short h2 text-white"></i>';
  }
});

const playBtn = document.getElementById("play-btn");
const tempoCorrenteEl = document.getElementById("tempo-corrente");
const barraAvanzamento = document.getElementById("barra-avanzamento");
const tempoTotaleEl = document.getElementById("tempo-totale");

const [minutiTotali, secondiTotali] = tempoTotaleEl.innerText.split(":").map(Number);
const tempoTotaleSecondi = minutiTotali * 60 + secondiTotali;

let tempoCorrenteSecondi = 0;
let intervalId;
let isPlaying = false;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function updateProgress() {
  if (tempoCorrenteSecondi < tempoTotaleSecondi) {
    tempoCorrenteSecondi++;
    tempoCorrenteEl.innerText = formatTime(tempoCorrenteSecondi);
    barraAvanzamento.value = (tempoCorrenteSecondi / tempoTotaleSecondi) * 200;
  } else {
    tempoCorrenteSecondi = 0;
    tempoCorrenteEl.innerText = formatTime(tempoCorrenteSecondi);
    barraAvanzamento.value = 0;

    if (isPlaying) {
      clearInterval(intervalId);
      intervalId = setInterval(updateProgress, 1000);
    }
  }
}

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    clearInterval(intervalId);
    isPlaying = false;
    playBtn.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
  } else {
    intervalId = setInterval(updateProgress, 1000);
    isPlaying = true;
    playBtn.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
  }
});

barraAvanzamento.addEventListener("input", () => {
  tempoCorrenteSecondi = Math.round((barraAvanzamento.value / barraAvanzamento.max) * tempoTotaleSecondi);
  tempoCorrenteEl.innerText = formatTime(tempoCorrenteSecondi);
});

barraAvanzamento.addEventListener("change", () => {
  if (isPlaying) {
    clearInterval(intervalId);
    intervalId = setInterval(updateProgress, 1000);
  }
});

const URL = "https://striveschool-api.herokuapp.com/api/deezer/search?q=rock";

function fetchAlbum(apiUrl, nvolte) {
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Errore nella richiesta: ${response.status}`);
      }
      return response.json();
    })
    .then((album) => {
      console.log(album);

      const randomObjects = album.data?.sort(() => Math.random() - 0.5).slice(0, nvolte);

      if (randomObjects) {
        const container = document.getElementById("consigliati");

        randomObjects.forEach((album) => {
          const cardDiv = document.createElement("div");
          cardDiv.className = "col-5 col-md-4 col-lg-2 p-0 overflow-hidden cardDiv";

          cardDiv.innerHTML = `
          <div class="card">
          <a href=album.html?id=${album.album.id} class="text-decoration-none text-white">
            <div class="imgCard">
              <img src="${album.album.cover_medium}" class="card-img-top" alt="${album.title_short}" />
            </div>
            <div class="card-body">
              <h6 class="card-title">${album.title_short}</h6>
              </a>
              <p class="card-text">${album.album.title}</p>
            </div>
          </div>`;

          container.appendChild(cardDiv);
        });
      } else {
        console.error("Data is not in expected format or missing 'data' key.");
      }
    })
    .catch((error) => {
      console.error("Errore:", error.message);
    });
}

fetchAlbum(URL, 10);

function adjustStyles() {
  const footer = document.querySelector("footer");
  const consigliati = document.querySelector("#parteCentrale");
  const listPlaylist = document.querySelector("#sinistra");

  if (footer) {
    const footerHeight = footer.offsetHeight;

    if (consigliati) {
      consigliati.style.height = `calc(100vh - ${footerHeight}px)`;
    }

    if (listPlaylist) {
      listPlaylist.style.height = `calc(100vh - ${footerHeight}px)`;
    }
  }
}

window.addEventListener("resize", adjustStyles);
window.addEventListener("load", adjustStyles);

document.addEventListener("DOMContentLoaded", function () {
  let activeNavItem = document.querySelector(".nav-link.active");

  if (activeNavItem) {
    let icon = activeNavItem.querySelector("i");

    if (icon && icon.classList.contains("bi-house")) {
      icon.classList.replace("bi-house", "bi-house-fill");
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  fetchPopularAlbums();
});

function fetchPopularAlbums() {
  const keywords = ["relax", "chill", "lofi"];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  const url = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${randomKeyword}`;

  const albumContainer = document.getElementById("playlist");

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (!data || !data.data || data.data.length === 0) {
        console.error("Nessun album trovato");
        return;
      }

      const albums = [];
      const albumIds = new Set();

      data.data.forEach((track) => {
        if (!albumIds.has(track.album.id)) {
          albumIds.add(track.album.id);
          albums.push(track.album);
        }
      });

      albums.sort(() => Math.random() - 0.5);

      albums.slice(0, 6).forEach((album) => createAlbumItem.call(albumContainer, album));

      console.log(`Ricerca effettuata con parola chiave: ${randomKeyword}`);
    })
    .catch((error) => console.error("Errore:", error));
}

function createAlbumItem(album) {
  const albumElement = document.createElement("div");
  albumElement.classList.add("Hplaylist", "d-flex", "align-items-center", "rounded", "col-6", "col-md-4", "mb-3");

  albumElement.innerHTML = `
      <div class="w-25">
          <a href="album.html?id=${album.id}">
              <img src="${album.cover_medium}" alt="${album.title}" class="img-fluid rounded-start" />
          </a>
      </div>
      <div>
          <p class="text-white">${album.title}</p>
      </div>
  `;

  this.appendChild(albumElement);
}
