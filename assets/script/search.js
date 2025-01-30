const URL = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";

function ricercaMusica() {
  const query = document.getElementById("ricerca").value;
  const risultatiContainer = document.getElementById("risultati");
  const playlistSection = document.getElementById("playlistSection");

  if (query.trim() !== "") {
    playlistSection.classList.add("playlist-hidden");
  } else {
    playlistSection.classList.remove("playlist-hidden");
  }

  if (query.trim() === "") {
    risultatiContainer.innerHTML = "";
    return;
  }

  fetch(`${URL}${query}`)
    .then((response) => response.json())
    .then((data) => {
      risultatiContainer.innerHTML = "";

      const tracks = data.data.slice(0, 10);
      const artists = {};

      tracks.forEach((track) => {
        if (!artists[track.artist.id]) {
          artists[track.artist.id] = {
            name: track.artist.name,
            id: track.artist.id,
            tracks: [],
          };
        }
        artists[track.artist.id].tracks.push(track);
      });

      for (const artistId in artists) {
        const artist = artists[artistId];

        const artistElement = document.createElement("div");
        artistElement.classList.add("artist-result");

        const artistContent = `
          <h3><a href="artist.html?id=${artist.id}">${artist.name}</a></h3>
        `;
        artistElement.innerHTML = artistContent;

        artist.tracks.forEach((track) => {
          const trackElement = document.createElement("div");
          trackElement.classList.add("result-item");

          const trackContent = `
            <img src="${track.album.cover}" alt="${track.title}" width="50" height="50">
            <h4>${track.title}</h4>
          `;

          trackElement.innerHTML = trackContent;

          trackElement.addEventListener("click", () => {
            const albumID = track.album.id;
            window.location.href = `album.html?id=${albumID}`;
          });

          artistElement.appendChild(trackElement);
        });

        risultatiContainer.appendChild(artistElement);
      }
    })
    .catch((error) => {
      console.error("Errore nella ricerca:", error);
      risultatiContainer.innerHTML = "<p>Errore durante la ricerca, riprova.</p>";
    });
}

function getAverageColor(imageUrl, callback) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = imageUrl;

  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    let r = 0,
      g = 0,
      b = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    const pixelCount = data.length / 4;
    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);
    callback(`rgb(${r}, ${g}, ${b})`);
  };

  img.onerror = function () {
    console.error("Errore nel caricamento dell'immagine: " + imageUrl);
  };
}

function applyColorToBanner(imageUrl, bannerId) {
  getAverageColor(imageUrl, function (color) {
    const banner = document.getElementById(bannerId);
    if (banner) {
      banner.style.backgroundColor = color;
    }
  });
}
const images = [
  "./assets/imgs/search/image-1.jpg",
  "./assets/imgs/search/image-2.jpg",
  "./assets/imgs/search/image-3.jpg",
  "./assets/imgs/search/image-4.jpg",
  "./assets/imgs/search/image-5.jpg",
  "./assets/imgs/search/image-6.jpg",
  "./assets/imgs/search/image-7.jpg",
  "./assets/imgs/search/image-8.jpg",
  "./assets/imgs/search/image-9.jpg",
  "./assets/imgs/search/image-10.jpg",
  "./assets/imgs/search/image-11.jpg",
  "./assets/imgs/search/image-12.jpg",
];
images.forEach((imageUrl, index) => {
  const bannerId = `banner-${index}`;
  applyColorToBanner(imageUrl, bannerId);
});
