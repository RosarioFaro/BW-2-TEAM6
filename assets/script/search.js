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

        // Ciclo sulle tracce dell'artista corrente
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
