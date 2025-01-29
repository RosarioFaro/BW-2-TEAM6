const params = new URLSearchParams(window.location.search);
const albumId = params.get("id");
const URL = "https://deezerdevs-deezer.p.rapidapi.com/album/683724061" + albumId;
fetch(URL, {
  headers: {
    "x-rapidapi-key": "271b0957d2msh898cbca6a33a65ep19dba8jsn8a8a18b07f6c",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then((album) => {
    console.log(album);
    const row = document.getElementById("albumPresentation");
    row.innerHTML = `<div class="col-3">
                        <img src="${album.cover_medium}" class="img-fluid" alt="" id="albumImg">
                    </div>
                    <div class="col-9 align-text-bottom">
                        <p class="text-white fw-bold mb-0" id="album">ALBUM</p>
                        <h2 id="albumTitle" class="text-white fw-bold pb-3 ps-1">${album.title}</h2>
                        <div class="d-flex">
                            <img src="${album.artist.picture_xl}" alt="" class="rounded-circle"
                                id="roundedImgCentral">
                            <p class="text-white mb-0 ps-2"><span class="fw-bold">${album.artist.name}</span> • ${album.release_date} • ${album.tracks.data.length} brani,
                                <span class="opacity-50">minutaggio
                                </span>
                            </p>
                        </div>
                    </div>`;
    const tbody = document.querySelector("tbody");
    const tracks = album.tracks.data;
    tracks.forEach((ele) => {
      const tr = document.createElement("tr");
      tr.classList.add("mb-2");
      tr.innerHTML = `<th class="pt-4">1</th>
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
