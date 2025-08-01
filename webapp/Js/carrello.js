var cartButton = document.getElementById("bottoneCarrello");
var carrello    = document.getElementById("carrello");
var overlay     = document.getElementById("overlay-carrello");
function carrelloUtente() {
    const container = document.getElementById("items");

    container.innerHTML = `<div id="spinner-container"><img id="spinner" src="img/caricamento.svg" class="spin" alt="Caricamento..." height="30px" width="30px"/></div>`;

    fetch('ServletCarrello')
        .then(res => res.json())
        .then(data => {
            if (document.getElementById("spinner")) {
                document.getElementById("spinner").remove();
            }
            renderCarrello(data);
        })
        .catch(err => {
            console.error("Errore fetch carrello:", err);
            if (document.getElementById("spinner")) {
                document.getElementById("spinner").remove();
            }
        });
}

function renderCarrello(carrelloData) {
    const itemsContainer = document.getElementById("items");
    itemsContainer.innerHTML = "";
    const totaleContainer = document.getElementById("totale");
    const totaleSpan = document.getElementById("totaleDaPagare");

    if (!carrelloData || carrelloData.length === 0) {
        itemsContainer.innerHTML = "<p class='no-cart-msg'>Non ci sono prodotti nel carrello</p>";
        totaleSpan.textContent = "0.00";
        const oldCheckout = document.getElementById("checkout");
        if (oldCheckout) oldCheckout.remove();
        return;
    }

    const oldCheckout = document.getElementById("checkout");
    if (oldCheckout) oldCheckout.remove();

    let tot = 0;

    carrelloData.forEach(p => {
        const linea = p.prezzo;
        tot += linea;

        const div = document.createElement("div");
        div.className = "carrello-item";
        div.innerHTML = `
            <span class="carrello-product-info">${p.nome}</span>
            <span class="carrello-prezzo">&euro;${linea.toFixed(2)}</span>
            <button class="removeButton" data-codice="${p.codice}" title="Rimuovi">x</button>
        `;

        const btn = div.querySelector('.removeButton');
        btn.addEventListener('click', () => {
            fetch(`ServletCarrello?action=remove&codice=${btn.dataset.codice}`, {
                method: 'POST'
            })
                .then(resp => resp.json())
                .then(updatedCart => {
                    renderCarrello(updatedCart);
                })
                .catch(err => console.error("Errore nell'aggiornamento del carrello:", err));
        });

        itemsContainer.appendChild(div);
    });

    totaleSpan.textContent = tot.toFixed(2);

    if (tot > 0 && loggato) {
        const btn = document.createElement("button");
        btn.id = "checkout";
        btn.textContent = "Vai al pagamento";
        btn.style.display = "inline-block";
        btn.addEventListener("click", () => {
            // Assumendo che tu abbia una variabile globale 'refCheckout' o un path fisso
            window.location.href = 'checkout.jsp';
        });
        totaleContainer.appendChild(btn);
    }
}

cartButton.addEventListener("click", () => {
    const isVisible = carrello.classList.toggle("visible");
    overlay.classList.toggle("visible", isVisible);
    if (isVisible) carrelloUtente();
});

overlay.addEventListener("click", () => {
    carrello.classList.remove("visible");
    overlay.classList.remove("visible");
});