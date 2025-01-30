/* GESTIONE ELEMENTI PLAYER */
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const tempoCorrenteEl = document.getElementById("tempo-corrente");
const barraAvanzamento = document.getElementById("barra-avanzamento");
const tempoTotaleEl = document.getElementById("tempo-totale");
const barraVolume = document.getElementById("barra-volume");
const titoloCanzone = document.querySelector(".barra-lettore p");
const artistaCanzone = document.querySelector(".barra-lettore .text-secondary");
const copertinaCanzone = document.querySelector(".copertina-canzone");

let isPlaying = false;
let currentTrackIndex = 0;
let trackElements = [];

/* FORMATTAZIONE TEMPO IN MM:SS */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/* RACCOLTA DATI TRACCE DALL'API */
const params = new URLSearchParams(window.location.search);
const albumId = params.get("id");
const URL = `https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`;

fetch(URL, {
  headers: {
    "x-rapidapi-key": "271b0957d2msh898cbca6a33a65ep19dba8jsn8a8a18b07f6c",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
})
  .then((response) => (response.ok ? response.json() : Promise.reject("Errore API")))
  .then((album) => {
    /* CREAZIONE INTERFACCIA GRAFICA ALBUM */
    const row = document.getElementById("albumPresentation");
    row.innerHTML = `
        <div class="col-12 col-md-4 px-0 d-flex">
          <div class="d-md-none col-2">
            <a href="./index.html"><i class="bi bi-arrow-left text-white"></i></a>
          </div>
          <div class="col-10">
            <img src="${album.cover_medium}" class="img-fluid" alt="" id="albumImg">
          </div>            
        </div>
        <h2 id="albumTitle" class="text-white pb-2 px-0 d-md-none mb-0">${album.title}</h2>
        <div class="col-12 col-md-8 align-text-bottom px-0 divNomeAlbum">
            <p class="text-white fw-bold mb-0 d-none d-md-block" id="album">ALBUM</p>
            <h2 id="albumTitle" class="text-white pb-3 ps-1 d-none d-md-block fw-bold">${album.title}</h2>
            <div class="d-flex align-items-center d-none d-md-flex">
                <img src="${album.artist.picture_xl}" alt="" class="rounded-circle roundedImgCentral">
                <p class="albumParag text-white mb-0 ps-2">
                    <a href="artist.html?id=${album.artist.id}" class="text-white text-decoration-none">
                        <span >${album.artist.name}</span>
                    </a> • ${album.release_date} • ${album.tracks.data.length} brani
                </p>                
            </div>
            
            <div class="d-flex d-md-none">
                <img src="./assets/imgs/main/image-16.jpg" alt="" class="rounded-circle roundedImgCentral">
                <p class="albumParag text-white mb-0 ps-2 ">${album.artist.name}</p>
              </div>
            <div class="d-md-none">
              <p class="albumParag text-secondary mb-0 pt-2">Album • ${album.release_date}</p>
            </div>
        </div>`;

    /* CREAZIONE LISTA BRANI */
    const tbody = document.querySelector("tbody");
    const tracks = album.tracks.data;
    trackElements = [];

    tracks.forEach((ele, index) => {
      const tr = document.createElement("tr");
      tr.classList.add("mb-2");
      tr.innerHTML = `
          <th class="pt-4">${index + 1}</th>
          <td class="pb-0 pt-4">
              <div>
                  <a href="#" class="play-track" data-title="${ele.title}" 
                      data-artist="${ele.artist.name}" 
                      data-cover="${album.cover_medium}" 
                      data-src="${ele.preview}" 
                      data-duration="${ele.duration}">
                      <h5 class="songTitle mb-0">${ele.title_short}</h5>
                  </a>
                  <a href="artist.html?id=${album.artist.id}">
                      <p class="mb-0">${ele.artist.name}</p>
                  </a>
              </div>
          </td>
          <td class="pt-4">${(ele.rank || "N/A").toLocaleString()}</td>
          <td class="pt-4">${formatTime(ele.duration)}</td>
          <td class="pt-4 d-md-none"><i class="bi bi-three-dots-vertical text-secondary fs-3 ps-3"></i></td>`;
      tbody.appendChild(tr);
      trackElements.push(tr.querySelector(".play-track"));
    });

    /* FUNZIONE PER RIPRODURRE UNA TRACCIA */
    function playTrack(index) {
      if (index >= trackElements.length) return;

      const track = trackElements[index];
      const title = track.getAttribute("data-title");
      const artist = track.getAttribute("data-artist");
      const cover = track.getAttribute("data-cover");
      const src = track.getAttribute("data-src");
      const totalDuration = track.getAttribute("data-duration");

      titoloCanzone.textContent = title;
      artistaCanzone.textContent = artist;
      copertinaCanzone.src = cover;
      audio.src = src;

      tempoTotaleEl.textContent = formatTime(totalDuration);

      audio.play();
      isPlaying = true;
      playBtn.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");

      currentTrackIndex = index;
    }

    /* AVVIARE LA TRACCIA QUANDO CLICCATA */
    document.addEventListener("click", function (event) {
      if (event.target.closest(".play-track")) {
        event.preventDefault();
        const track = event.target.closest(".play-track");
        const index = trackElements.indexOf(track);
        playTrack(index);
      }
    });

    /* EVENTO PER PASSARE ALLA TRACCIA SUCCESSIVA AUTOMATICAMENTE */
    audio.addEventListener("ended", () => {
      playTrack(currentTrackIndex + 1);
    });

    /* AGGIORNAMENTO DATI NEL PLAYER */
    audio.addEventListener("timeupdate", () => {
      const duration = isNaN(audio.duration) ? parseInt(tempoTotaleEl.textContent) : audio.duration;
      barraAvanzamento.value = (audio.currentTime / duration) * 100;
      tempoCorrenteEl.textContent = formatTime(audio.currentTime);
    });

    /* CONTROLLO MANUALE DELLA BARRA DI AVANZAMENTO */
    barraAvanzamento.addEventListener("input", () => {
      const newTime = (barraAvanzamento.value / 100) * audio.duration;
      audio.currentTime = newTime;
    });

    /* GESTIONE PLAY/PAUSE */
    playBtn.addEventListener("click", () => {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playBtn.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
      } else {
        audio.play();
        isPlaying = true;
        playBtn.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
      }
    });

    /* CONTROLLO VOLUME */
    barraVolume.addEventListener("input", () => {
      audio.volume = barraVolume.value / 300;
    });
  });
