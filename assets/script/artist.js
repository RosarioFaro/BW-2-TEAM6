const playBtn = document.getElementById("play-btn");
const tempoCorrenteEl = document.getElementById("tempo-corrente");
const barraAvanzamento = document.getElementById("barra-avanzamento");
const tempoTotaleEl = document.getElementById("tempo-totale");

const [minutiTotali, secondiTotali] = tempoTotaleEl.innerText
  .split(":")
  .map(Number);
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
  tempoCorrenteSecondi = Math.round(
    (barraAvanzamento.value / barraAvanzamento.max) * tempoTotaleSecondi
  );
  tempoCorrenteEl.innerText = formatTime(tempoCorrenteSecondi);
});

barraAvanzamento.addEventListener("change", () => {
  if (isPlaying) {
    clearInterval(intervalId);
    intervalId = setInterval(updateProgress, 1000);
  }
});
function getArtistIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

const artistId = getArtistIdFromURL();

if (artistId) {
  loadArtistData(artistId);
  loadArtistSongs(artistId);
} else {
  console.error("Nessun ID artista trovato nell'URL.");
}

function loadArtistData(artistId) {
  const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((artist) => {
      console.log("Dati ricevuti dall'API:", artist);

      document.getElementById("artist-name").innerText = artist.name;
      document.getElementById(
        "artist-listeners"
      ).innerHTML = `Ascoltatori mensili: <span>${artist.nb_fan.toLocaleString()}</span>`;

      if (artist.picture_xl) {
        document.querySelector(
          ".artist-header"
        ).style.backgroundImage = `url('${artist.picture_xl}')`;
      } else {
        console.warn(
          "L'API non ha restituito un'URL valido per la copertina dell'artista."
        );
      }
    })
    .catch((error) =>
      console.error("Errore nel caricamento dell'artista:", error)
    );
}

function loadArtistSongs(artistId) {
  const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=5`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const songList = document.getElementById("song-list");
      songList.innerHTML = "";

      data.data.forEach((song, index) => {
        const songItem = document.createElement("li");
        songItem.classList.add(
          "song-item",
          "list-group-item",
          "bg-transparent",
          "text-white"
        );

        songItem.innerHTML = `
          <div class="song-info">
            <span>${index + 1}.</span>
            <img src="${song.album.cover_small}" alt="${song.title}">
            <div>
              <span class="song-title">${song.title}</span>
              <p class="song-plays">${song.rank.toLocaleString()} ascolti</p>
            </div>
          </div>
          <span class="song-duration">${formatDuration(song.duration)}</span>
        `;

        songList.appendChild(songItem);
      });
    })
    .catch((error) =>
      console.error("Errore nel caricamento delle canzoni:", error)
    );
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
}

function loadArtistData(artistId) {
  const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((artist) => {
      console.log("Dati ricevuti dall'API:", artist);

      document.getElementById("artist-name").innerText = artist.name;
      document.getElementById(
        "artist-listeners"
      ).innerHTML = `Ascoltatori mensili: <span>${artist.nb_fan.toLocaleString()}</span>`;

      if (artist.picture_xl) {
        document.querySelector(
          ".artist-header"
        ).style.backgroundImage = `url('${artist.picture_xl}')`;
      } else {
        console.warn(
          "L'API non ha restituito un'URL valido per la copertina dell'artista."
        );
      }

      loadArtistSongs(artistId);
    })
    .catch((error) =>
      console.error("Errore nel caricamento dell'artista:", error)
    );
}
let songsLoaded = 5;
let allSongs = [];

function loadArtistSongs(artistId) {
  const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=25`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      allSongs = data.data;
      displaySongs();
    })
    .catch((error) =>
      console.error("Errore nel caricamento delle canzoni:", error)
    );
}

function displaySongs() {
  const songList = document.getElementById("song-list");
  const loadMoreBtn = document.getElementById("load-more");
  const showLessBtn = document.getElementById("show-less");

  songList.innerHTML = "";

  allSongs.slice(0, songsLoaded).forEach((song, index) => {
    const songItem = document.createElement("li");
    songItem.classList.add(
      "song-item",
      "list-group-item",
      "bg-transparent",
      "text-white"
    );

    songItem.innerHTML = `
      <div class="song-info">
        <span>${index + 1}.</span>
        <img src="${song.album.cover_small}" alt="${song.title}">
        <div>
          <span class="song-title">${song.title}</span>
          <p class="song-plays">${song.rank.toLocaleString()} ascolti</p>
        </div>
      </div>
      <span class="song-duration">${formatDuration(song.duration)}</span>
    `;

    songList.appendChild(songItem);
  });

  if (songsLoaded >= allSongs.length) {
    loadMoreBtn.style.display = "none";
    showLessBtn.style.display = "block";
  } else {
    loadMoreBtn.style.display = "block";
    showLessBtn.style.display = "none";
  }
}

document.getElementById("load-more").addEventListener("click", function () {
  songsLoaded = 25;
  displaySongs();
});

document.getElementById("show-less").addEventListener("click", function () {
  songsLoaded = 5;
  displaySongs();
});
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
}

document.getElementById("load-more").addEventListener("click", function () {
  songsLoaded = 25;
  displaySongs();
});

function loadArtistData(artistId) {
  const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((artist) => {
      console.log("Dati ricevuti dall'API:", artist);

      document.getElementById("artist-name").innerText = artist.name;
      document.getElementById(
        "artist-listeners"
      ).innerHTML = `Ascoltatori mensili: <span>${artist.nb_fan.toLocaleString()}</span>`;

      if (artist.picture_xl) {
        document.querySelector(
          ".artist-header"
        ).style.backgroundImage = `url('${artist.picture_xl}')`;
      } else {
        console.warn(
          "L'API non ha restituito un'URL valido per la copertina dell'artista."
        );
      }

      loadArtistSongs(artistId);
    })
    .catch((error) =>
      console.error("Errore nel caricamento dell'artista:", error)
    );
}

const defaultArtistId = loadArtistData(defaultArtistId);

document
  .getElementById("toggleFriendlist")
  .addEventListener("click", function () {
    let col = document.getElementById("attivitaCol");
    col.classList.toggle("scomparsa");
  });
