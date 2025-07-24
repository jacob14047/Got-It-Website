const checkoutForm        = document.getElementById("checkoutForm");
const itemsDiv            = document.getElementById("items");
const totSpan             = document.getElementById("totaleDaPagare");
const checkoutFormContent = document.getElementById("checkoutFormContent");

itemsDiv.innerHTML = `
        <div id="spinner-container">
            <img id="spinner" src="img/caricamento.svg" class="spin" alt="Caricamento..." height="30px" width="30px"/>
        </div>
    `;
if (checkoutForm && itemsDiv && totSpan) {

    fetch('ServletCarrello')
        .then(res => res.json())
        .then(carrelloData => {

            itemsDiv.innerHTML = '';
            let tot = 0;

            carrelloData.forEach(p => {
                const prezzoProdotto = parseFloat(p.prezzo);
                tot += prezzoProdotto;


                const div = document.createElement("div");
                div.className = "checkout-item";
                div.innerHTML = `
                    <img src="${contextPath}/images/${p.img_path}" alt="Immagine prodotto">
                    <div class="checkout-item-details">
                      <span class="nome-prodotto">${p.nome}</span>
                      <!-- La riga della quantità è stata rimossa -->
                      <span class="prezzo-prodotto">€${prezzoProdotto.toFixed(2)}</span>
                    </div>
                `;
                itemsDiv.appendChild(div);
            });

            totSpan.textContent = tot.toFixed(2);
        })
        .catch(err => console.error("Errore fetch carrello per checkout:", err));
}