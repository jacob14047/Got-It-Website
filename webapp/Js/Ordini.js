document.addEventListener('DOMContentLoaded', function() {
    var orderButton   = document.getElementById("bottoneOrdini");
    var ordiniSidebar = document.getElementById("Ordini");
    var overlay       = document.getElementById("overlay-ordini");



    function OrdiniUtente() {
        const container = document.getElementById("Ordini-items");
        container.innerHTML = `<div id="spinner-container"><img id="spinner" src="img/caricamento.svg" class="spin" alt="Caricamento..." height="30px" width="30px"/></div>`;

        fetch(servletOrdiniUrl)
            .then(r => {
                if (!r.ok) {
                    throw new Error(`Errore HTTP: ${r.status}`);
                }
                return r.json();
            })
            .then(data => {
                const spinner = document.getElementById("spinner");
                if(spinner) {
                    spinner.parentElement.remove();
                }
                renderOrdini(data);
            })
            .catch(err => {
                console.error("Errore nel recupero degli ordini:", err);
                const spinner = document.getElementById("spinner");
                if(spinner) {
                    spinner.parentElement.remove();
                }
                const container = document.getElementById("Ordini-items");
                container.innerHTML = "<p class='no-orders-msg'>Impossibile caricare gli ordini.</p>";
            });
    }

    function renderOrdini(ordini) {
        const contenitore = document.getElementById("Ordini-items");
        contenitore.innerHTML = "";

        if (!ordini || ordini.length === 0) {
            contenitore.innerHTML = "<p class='no-orders-msg'>Non ci sono ordini</p>";
            return;
        }

        ordini.forEach(ordine => {
            const wrapper = document.createElement("div");
            wrapper.className = "ordine-wrapper";

            const header = document.createElement("h3");
            header.textContent = "Ordine #" + ordine.ID_Ordine;
            wrapper.appendChild(header);

            ["dataAcquisto", "stato", "consegnaStimata"].forEach(prop => {
                const p = document.createElement("p");
                p.textContent = (prop === "dataAcquisto" ? "Data: " : prop === "stato"  ? "Stato: " :  "Consegna stimata: ") + ordine[prop];
                wrapper.appendChild(p);
            });

            const ul = document.createElement("ul");
            ordine.prodotti.forEach(item => {
                const li = document.createElement("li");
                const info = document.createElement("span");

                info.textContent = `${item.nome} - €${item.prezzo.toFixed(2)}`;
                li.appendChild(info);

                if (!item.reviewed) {
                    const a = document.createElement("a");
                    a.className = "link-recensione";

                    a.href = `${reviewPageUrl}?productId=${item.prodottoCodice}`;
                    a.textContent = "Recensisci";
                    li.appendChild(a);
                }

                ul.appendChild(li);
            });

            wrapper.appendChild(ul);
            contenitore.appendChild(wrapper);
        });
    }

    orderButton.addEventListener("click", () => {
        const isVisible = ordiniSidebar.classList.toggle("visible");
        overlay.classList.toggle("visible", isVisible);
        if (isVisible && loggato) {
            OrdiniUtente();
        }
    });

    overlay.addEventListener("click", () => {
        ordiniSidebar.classList.remove("visible");
        overlay.classList.remove("visible");
    });
});