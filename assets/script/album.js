/* NASCONDI BARRA AMICI */
document.getElementById("toggleFriendlist").addEventListener("click", function () {
  document.getElementById("attivitaCol").classList.toggle("d-md-none");
});

document.getElementById("btnMostraAmici").addEventListener("click", function () {
  let col = document.getElementById("attivitaCol");
  col.classList.toggle("d-md-none");
  this.innerHTML = col.classList.contains("d-md-none")
    ? '<i class="bi bi-arrow-left-short h2 text-white"></i>'
    : '<i class="bi bi-arrow-right-short h2 text-white"></i>';
});

/* GESTIONE ELEMENTI PLAYER */
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
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
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

/* RACCOLTA DATI TRACCE DALL'API */
const params = new URLSearchParams(window.location.search);
const albumId = params.get("id");
const URL = `https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`;
const API_HEADERS = {
  "x-rapidapi-key": "271b0957d2msh898cbca6a33a65ep19dba8jsn8a8a18b07f6c",
  "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
};

fetch(URL, {
  headers: {
    "x-rapidapi-key": "271b0957d2msh898cbca6a33a65ep19dba8jsn8a8a18b07f6c",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
})
  //cambio sfondo
  .then((response) => (response.ok ? response.json() : Promise.reject("Errore API")))
  .then((album) => {
    function getAverageColor(imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        const colorThief = new ColorThief();
        let dominantColor;

        try {
          dominantColor = colorThief.getColor(img);
        } catch (err) {
          console.error("Errore nell'estrazione del colore dominante:", err);
          dominantColor = [0, 0, 0];
        }

        const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;

        const gradient = `linear-gradient(to bottom, ${rgbColor}, black)`;

        document.body.style.backgroundImage = gradient;
      };

      img.onerror = (err) => {
        console.error("Errore nel caricamento dell'immagine", err);
      };
    }

    fetch(URL, {
      headers: {
        "x-rapidapi-key": "271b0957d2msh898cbca6a33a65ep19dba8jsn8a8a18b07f6c",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    })
      .then((response) => (response.ok ? response.json() : Promise.reject("Errore API")))
      .then((album) => {
        getAverageColor(album.cover_medium);
      });

    /* CREAZIONE INTERFACCIA GRAFICA ALBUM */
    document.getElementById("albumPresentation").innerHTML = `
      <div class="col-12 col-md-4 px-0 d-flex">
        <div class="d-md-none col-2">
          <a href="./index.html"><i class="bi bi-arrow-left text-white"></i></a>
        </div>
        <div class="col-10">
          <img src="${album.cover_medium}" class="img-fluid" alt="" id="albumImg">
        </div>            
      </div>
      <h2 id="albumTitle" class="text-white pb-2 px-0 d-md-none mb-0">${album.title}</h2>
      <div class="col-12 col-md-8 px-0">
        <p class="text-white fw-bold mb-0 d-none d-md-block">ALBUM</p>
        <h2 class="text-white pb-3 ps-1 d-none d-md-block fw-bold">${album.title}</h2>
        <div class="d-flex align-items-center">
          <img src="${album.artist.picture_xl}" alt="" class="rounded-circle roundedImgCentral">
          <p class="text-white mb-0 ps-2">
            <a href="artist.html?id=${album.artist.id}" class="text-white text-decoration-none">
              <span>${album.artist.name}</span>
            </a> • ${album.release_date} • ${album.tracks.data.length} brani
          </p>                
        </div>
      </div>`;

    /* CREAZIONE LISTA BRANI */
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    trackElements = [];

    album.tracks.data.forEach((ele, index) => {
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
        <td class="pt-4">${ele.rank.toLocaleString()}</td>
        <td class="pt-4">${formatTime(ele.duration)}</td>
      `;
      tbody.appendChild(tr);
      trackElements.push(tr.querySelector(".play-track"));
    });

    /* FUNZIONE PER AVVIARE UNA TRACCIA */
    const playTrack = (index) => {
      if (index < 0 || index >= trackElements.length) return;

      // Rimuove l'evidenziazione da tutte le tracce
      document.querySelectorAll("h5").forEach((h5) => {
        h5.classList.remove("playing-track");
      });

      // Imposta la nuova traccia in riproduzione
      const track = trackElements[index];
      audio.src = track.dataset.src;
      titoloCanzone.textContent = track.dataset.title;
      artistaCanzone.textContent = track.dataset.artist;
      copertinaCanzone.src = track.dataset.cover;

      tempoTotaleEl.textContent = formatTime(track.dataset.duration);
      barraAvanzamento.max = 30;

      audio.play();
      isPlaying = true;
      playBtn.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
      currentTrackIndex = index;

      // Evidenzia la traccia attualmente in riproduzione
      track.querySelector("h5").classList.add("playing-track");
    };

    /* STILE CSS PER EVIDENZIARE LA TRACCIA */
    const style = document.createElement("style");
    style.innerHTML = `
  .playing-track {
    color: #1ed760; /* Verde di Spotify */
    font-weight: bold;
  }
`;
    document.head.appendChild(style);

    /* EVENTI CLICK SULLE TRACCE */
    document.addEventListener("click", (event) => {
      if (event.target.closest(".play-track")) {
        event.preventDefault();
        playTrack(trackElements.indexOf(event.target.closest(".play-track")));
      }
    });

    /* AVANZA ALLA PROSSIMA TRACCIA O TORNA ALLA PRIMA */
    nextBtn.addEventListener("click", () => {
      if (currentTrackIndex < trackElements.length - 1) {
        playTrack(currentTrackIndex + 1);
      } else {
        playTrack(0); // Se siamo all'ultima, riparte dalla prima
      }
    });

    /* TORNA ALLA TRACCIA PRECEDENTE O ALL'ULTIMA */
    prevBtn.addEventListener("click", () => {
      if (currentTrackIndex > 0) {
        playTrack(currentTrackIndex - 1);
      } else {
        playTrack(trackElements.length - 1); // Se siamo alla prima, torna all'ultima
      }
    });

    /* PASSAGGIO AUTOMATICO ALLA PROSSIMA TRACCIA */
    audio.addEventListener("ended", () => {
      if (currentTrackIndex < trackElements.length - 1) {
        playTrack(currentTrackIndex + 1);
      } else {
        playTrack(0);
      }
    });

    /* AGGIORNAMENTO BARRA AVANZAMENTO */
    audio.addEventListener("timeupdate", () => {
      barraAvanzamento.value = audio.currentTime;
      tempoCorrenteEl.textContent = formatTime(audio.currentTime);
    });

    /* CONTROLLO SULLA BARRA */
    barraAvanzamento.addEventListener("input", () => {
      audio.currentTime = barraAvanzamento.value;
    });

    /* CONTROLLO PLAY/PAUSA */
    playBtn.addEventListener("click", () => {
      isPlaying ? audio.pause() : audio.play();
      isPlaying = !isPlaying;
      playBtn.classList.toggle("bi-play-circle-fill");
      playBtn.classList.toggle("bi-pause-circle-fill");
    });

    /* CONTROLLO VOLUME */
    barraVolume.addEventListener("input", () => {
      audio.volume = barraVolume.value / 300;
    });
  });

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
