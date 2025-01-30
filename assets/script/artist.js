const playBtn = document.getElementById("play-btn");
const tempoCorrenteEl = document.getElementById("tempo-corrente");
const barraAvanzamento = document.getElementById("barra-avanzamento");
const tempoTotaleEl = document.getElementById("tempo-totale");
const songList = document.getElementById("song-list");
const loadMoreBtn = document.getElementById("load-more");
const showLessBtn = document.getElementById("show-less");
const volumeControl = document.getElementById("barra-volume");
const audioElement = document.getElementById("audio");

let songsLoaded = 5;
let allSongs = [];
let isPlaying = false;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function loadArtistData(artistId) {
  const apiUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((artist) => {
      document.getElementById("artist-name").innerText = artist.name;
      document.getElementById(
        "artist-listeners"
      ).innerHTML = `Ascoltatori mensili: <span>${artist.nb_fan.toLocaleString()}</span>`;

      if (artist.picture_xl) {
        document.querySelector(".artist-header").style.backgroundImage = `url('${artist.picture_xl}')`;
      }

      loadArtistTracklist(artistId);
    })
    .catch((error) => console.error("Errore nel caricamento dell'artista:", error));
}

function getArtistIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

const artistId = getArtistIdFromURL();
if (artistId) {
  loadArtistData(artistId);
} else {
  console.error("Nessun ID artista trovato nell'URL.");
}

function loadArtistTracklist(artistId) {
  const tracklistUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=25`;

  fetch(tracklistUrl)
    .then((response) => response.json())
    .then((data) => {
      allSongs = data.data;
      displaySongs();
    })
    .catch((error) => console.error("Errore nel caricamento della tracklist:", error));
}

function displaySongs() {
  songList.innerHTML = "";

  allSongs.slice(0, songsLoaded).forEach((song, index) => {
    const songItem = document.createElement("li");
    songItem.classList.add("song-item", "list-group-item", "bg-transparent", "text-white");

    songItem.innerHTML = `
      <div class="song-info">
        <span>${index + 1}.</span>
        <img src="${song.album.cover_small}" alt="${song.title}">
        <div>
          <span class="song-title">${song.title}</span>
          <p class="song-plays">${song.rank.toLocaleString()} ascolti</p>
        </div>
      </div>
      <span class="song-duration">${formatTime(song.duration)}</span>
    `;

    songList.appendChild(songItem);
  });

  loadMoreBtn.style.display = songsLoaded >= allSongs.length ? "none" : "block";
  showLessBtn.style.display = songsLoaded >= allSongs.length ? "block" : "none";
}

loadMoreBtn.addEventListener("click", function () {
  songsLoaded += 5;
  displaySongs();
});

showLessBtn.addEventListener("click", function () {
  songsLoaded = 5;
  displaySongs();
});

function playTrack(selectedSong) {
  if (!selectedSong) return;

  audioElement.src = selectedSong.preview;
  document.querySelector(".copertina-canzone").src = selectedSong.album.cover_medium;
  document.querySelector(".barra-lettore p").textContent = selectedSong.title;
  document.querySelector(".barra-lettore .text-secondary").textContent = selectedSong.artist.name;

  const realDuration = selectedSong.duration;
  tempoTotaleEl.innerText = formatTime(realDuration);
  barraAvanzamento.max = 30;

  audioElement.play();
  isPlaying = true;
  playBtn.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
}

songList.addEventListener("click", function (event) {
  const songInfoDiv = event.target.closest(".song-info");

  if (songInfoDiv) {
    const songTitle = songInfoDiv.querySelector(".song-title").textContent;
    const selectedSong = allSongs.find((song) => song.title === songTitle);

    playTrack(selectedSong);
  }
});

audioElement.addEventListener("timeupdate", () => {
  tempoCorrenteEl.innerText = formatTime(Math.floor(audioElement.currentTime));
  barraAvanzamento.value = Math.floor(audioElement.currentTime);
});

barraAvanzamento.addEventListener("input", () => {
  audioElement.currentTime = barraAvanzamento.value;
  tempoCorrenteEl.innerText = formatTime(barraAvanzamento.value);
});

audioElement.addEventListener("ended", () => {
  isPlaying = false;
  playBtn.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
  tempoCorrenteEl.innerText = formatTime(0);
  barraAvanzamento.value = 0;
});

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    audioElement.pause();
    isPlaying = false;
    playBtn.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
  } else {
    audioElement.play();
    isPlaying = true;
    playBtn.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
  }
});

audioElement.volume = volumeControl.value / 100;

volumeControl.addEventListener("input", () => {
  audioElement.volume = volumeControl.value / 100;
});

function playNextTrack() {
  let currentIndex = allSongs.findIndex((song) => song.preview === audioElement.src);

  if (currentIndex !== -1 && currentIndex < allSongs.length - 1) {
    const nextSong = allSongs[currentIndex + 1];
    playTrack(nextSong);
  } else {
    playTrack(allSongs[0]);
  }
}

audioElement.addEventListener("ended", playNextTrack);

document.getElementById("toggleFriendlist").addEventListener("click", function () {
  document.getElementById("attivitaCol").classList.toggle("d-md-none");
});
