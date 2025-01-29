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

      tracks.forEach((track) => {
        const trackElement = document.createElement("div");
        trackElement.classList.add("result-item");
        const trackContent = `
          <img src="${track.album.cover}" alt="${track.title}" width="50" height="50">
          <h4>${track.title}</h4>
          <p>${track.artist.name}</p>
          
        `;

        trackElement.innerHTML = trackContent;
        risultatiContainer.appendChild(trackElement);
      });
    })
    .catch((error) => {
      console.error("Errore nella ricerca:", error);
      risultatiContainer.innerHTML = "<p>Errore durante la ricerca, riprova.</p>";
    });
}
