const recensioniBox = document.getElementById("recensioni-items");
const header       = document.getElementById("header-rece");

recensioniBox.innerHTML = `
        <div id="spinner-container">
            <img id="spinner" src="img/caricamento.svg" class="spin" alt="Caricamento..." height="30px" width="30px"/>
        </div>
    `;



fetch(`${contextPath}/ServletRecensione?productId=${productId}`)
    .then(resp => {
        if (!resp.ok) {
            throw new Error(`Server ha risposto con status: ${resp.status}`);
        }
        return resp.json();
    })
    .then(data => {
        const venditoreNome = data.prodotto.nomeVenditore;
        renderRecensioni(data.recensioni, venditoreNome);
    })
    .catch(err => {
        console.error("Errore nel fetch delle recensioni:", err);
        header.textContent = "Impossibile caricare le recensioni";
    });
function renderRecensioni(recensioni, venditore) {
    recensioniBox.innerHTML = "";

    if (!recensioni || recensioni.length === 0) {
        header.textContent = `Al momento non ci sono recensioni per ${venditore}`;
        return;
    }

    header.textContent = `Recensioni degli utenti riguardo a ${venditore}`;

    recensioni.forEach(r => {
        const div = document.createElement("div");
        div.className = "recensione-card";
        div.innerHTML = `
      <div class="header-recensione">
        <img class="rec-img"
             src="${contextPath}/images/${r.img_path}"
             alt="Immagine prodotto"
             width="52" height="52">
        <div class="rec-info">
          <span class="nome-utente">${r.username}</span>
          <span class="data-recensione">${r.data}</span>
          <span class="voto">★${r.voto}</span>
        </div>
        <div class="rec-prodotto">
          <span class="nome-prodotto">${r.nome_prodotto}</span>
          <span class="prezzo-prodotto">
            €${Number(r.prezzo_prodotto).toFixed(2)}
          </span>
        </div>
      </div>
      <div class="linea-recensione"></div>
      <div class="body-recensione">
        ${r.descrizione}
      </div>
    `;
        recensioniBox.appendChild(div);
    });
}
(() => {
    const imgs = Array.from(document.querySelectorAll('.viewer-img'));
    if (!imgs.length) return;

    let idx = 0;

    const setActive = () => {
        imgs.forEach((img, i) =>
            img.classList.toggle('active', i === idx)
        );
    };

    document.querySelector('.img-nav.next')
        .addEventListener('click', () => {
            idx = (idx + 1) % imgs.length;  // ciclico
            setActive();
        });

    document.querySelector('.img-nav.prev')
        .addEventListener('click', () => {
            idx = (idx - 1 + imgs.length) % imgs.length;
            setActive();
        });

    setActive();
})();