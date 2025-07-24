const wishButton = document.getElementById("bottoneWishlist");
const wishlist = document.getElementById("wishlist");
const overlays = document.getElementById("overlays");

function wishlistUtente() {
    const container = document.getElementById("oggetti");

    container.innerHTML = `
        <div id="spinner-container">
            <img id="spinner" src="img/caricamento.svg" class="spin" alt="Caricamento..." height="30px" width="30px"/>
        </div>
    `;

    fetch('ServletWishlist')
        .then(response => response.json())
        .then(wishlist => {
            renderWishlist(wishlist);
            const spinner = document.getElementById("spinner");
            if (spinner) spinner.remove();
        })
        .catch(err => {
            console.error("Errore nel fetch della wishlist:", err);
            const spinner = document.getElementById("spinner");
            if (spinner) spinner.remove();
        });
}

function renderWishlist(wishlist) {
    const contenitoreProdotti = document.getElementById("oggetti");
    contenitoreProdotti.innerHTML = "";

    const addAllBtn = document.getElementById("addToCart");

    if (!wishlist || wishlist.length === 0) {
        contenitoreProdotti.innerHTML = "<p class='no-wishlist-msg'>Non ci sono prodotti in wishlist</p>";
        if (addAllBtn) addAllBtn.style.display = "none";
        return;
    } else {
        if (addAllBtn) addAllBtn.style.display = "inline-block";
    }

    wishlist.forEach(prodotto => {
        const prodottoDiv = document.createElement("div");
        prodottoDiv.className = "wishlist-item";
        prodottoDiv.innerHTML = `
            <span class="wishlist-product-info">${prodotto.nome}</span>
            <button class="addToCartButton" data-codice="${prodotto.codice}" title="Aggiungi al carrello">
                <img src="img/addToCart.svg" width="18px" height="18px" alt="Aggiungi al carrello">
            </button>
            <button class="removeWishlistButton" data-codice="${prodotto.codice}" title="Rimuovi">x</button>
        `;

        const btnAdd = prodottoDiv.querySelector('.addToCartButton');
        btnAdd.addEventListener('click', async () => {
            await fetch(`ServletWishlist?action=remove&codice=${btnAdd.dataset.codice}`, { method: 'POST' });
            wishlistUtente();
            if (typeof carrelloUtente === "function") carrelloUtente();
        });

        const btnDel = prodottoDiv.querySelector('.removeWishlistButton');
        btnDel.addEventListener('click', () => {
            fetch(`ServletWishlist?action=delete&codice=${btnDel.dataset.codice}`, { method: 'POST' })
                .then(res => res.json())
                .then(updated => renderWishlist(updated))
                .catch(err => console.error("Errore nel delete wishlist:", err));
        });

        contenitoreProdotti.appendChild(prodottoDiv);
    });
}

wishButton.addEventListener("click", () => {
    const isVisible = wishlist.classList.toggle("visible");
    overlays.classList.toggle("visible");
    if (isVisible) {
        wishlistUtente();
    }
});

document.addEventListener("click", (e) => {
    if (!wishlist.contains(e.target) && !wishButton.contains(e.target)) {
        wishlist.classList.remove("visible");
        overlays.classList.remove("visible");
    }
});

overlays.addEventListener("click", () => {
    wishlist.classList.remove("visible");
    overlays.classList.remove("visible");
});

if (document.getElementById("addToCart")) {
    document.getElementById("addToCart").addEventListener("click", async () => {
        const items = document.querySelectorAll("#oggetti [data-codice]");
        for (const item of items) {
            const codice = item.dataset.codice;
            await fetch(`ServletWishlist?action=remove&codice=${codice}`, { method: 'POST' });
        }
        wishlistUtente();
        if (typeof carrelloUtente === "function") carrelloUtente();
    });
}
