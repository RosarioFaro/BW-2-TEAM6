const URL = "https://striveschool-api.herokuapp.com/api/deezer/search?q={query}";

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
          cardDiv.className = "col-2 p-0";

          cardDiv.innerHTML = `
            <div class="card">
              <div class="imgCard">
                <img src="${album.album.cover_medium}" class="card-img-top" alt="${album.title_short}" />
              </div>
              <div class="card-body">
                <h5 class="card-title">${album.title_short}</h5>
                <p class="card-text">${album.album.title}</p>
              </div>
            </div>
          `;

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

document.getElementById("toggleFriendlist").addEventListener("click", function () {
  let col = document.getElementById("attivitaCol");
  col.classList.toggle("scomparsa"); // Aggiunge o rimuove la classe per nascondere/mostrare la colonna
});
