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

const params = new URLSearchParams(window.location.search);
const albumId = params.get("id");
const URL = `https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`;

fetch(URL, {
  headers: {
    "x-rapidapi-key": "271b0957d2msh898cbca6a33a65ep19dba8jsn8a8a18b07f6c",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error fetching data from the API");
    }
  })
  .then((album) => {
    console.log(album);

    const row = document.getElementById("albumPresentation");
    row.innerHTML = `
      <div class="col-3">
        <img src="${album.cover_medium}" class="img-fluid" alt="" id="albumImg">
      </div>
      <div class="col-9 align-text-bottom">
        <p class="text-white fw-bold mb-0" id="album">ALBUM</p>
        <h2 id="albumTitle" class="text-white fw-bold pb-3 ps-1">${album.title}</h2>
        <div class="d-flex align-items-center">
          <img src="${album.artist.picture_xl}" alt="" class="rounded-circle" id="roundedImgCentral">
          <p id="albumParag"  class="text-white mb-0 ps-2"><span class="fw-bold">${album.artist.name}</span> • ${album.release_date} • ${album.tracks.data.length} brani,
            <span class="opacity-50">${album.duration}</span>
          </p>
        </div>
      </div>`;

    const tbody = document.querySelector("tbody");
    const tracks = album.tracks.data;
    tracks.forEach((ele, index) => {
      const tr = document.createElement("tr");
      tr.classList.add("mb-2");
      tr.innerHTML = `
        <th class="pt-4">${index + 1}</th>
        <td class="pb-0 pt-4">
          <div>
            <a href="#">
              <h5 class="songTitle mb-0">${ele.title_short}</h5>
            </a>
            <a href="#">
              <p class="mb-0">${ele.artist.name}</p>
            </a>
          </div>
        </td>
        <td class="pt-4">254.365</td>
        <td class="pt-4">${ele.duration}</td>`;
      tbody.appendChild(tr);
    });
  })
  .catch((err) => {
    console.log(err);
  });

document.getElementById("toggleFriendlist").addEventListener("click", function () {
  let col = document.getElementById("attivitaCol");
  col.classList.toggle("d-none");
});

document.getElementById("btnMostraAmici").addEventListener("click", function () {
  let col = document.getElementById("attivitaCol");

  col.classList.toggle("d-none");

  if (col.classList.contains("d-none")) {
    this.innerHTML = '<i class="bi bi-arrow-left-short h2 text-white"></i>';
  } else {
    this.innerHTML = '<i class="bi bi-arrow-right-short h2 text-white"></i>';
  }
});
