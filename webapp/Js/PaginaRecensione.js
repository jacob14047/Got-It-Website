
document.addEventListener("DOMContentLoaded", function() {
    const productId = document.getElementById("productId").value;

    fetch(`ServletRecensione?productId=${productId}`)
        .then(resp => resp.json())
        .then(data => {
            const p = data.prodotto;
            const productInfo = document.getElementById("product-info");
            productInfo.innerHTML = `
        <img src="${contextPath}/images/${p.img_path}" alt="immagine prodotto">
        <div class="rec-product-details">
          <span class="nome-prodotto">${p.nome}</span>
          <span class="prezzo-prodotto">€${p.prezzo.toFixed(2)}</span>
        </div>
      `;
        })
        .catch(() => {
            document.getElementById("product-info").textContent =
                "Impossibile caricare le info prodotto.";
        });

    function fillStars(v) {
        document.querySelectorAll('.star').forEach(star => {
            const val = parseInt(star.dataset.value, 10);
            star.classList.toggle('filled', val <= v);
        });
    }
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('mouseenter', ()=> fillStars(parseInt(star.dataset.value)));
        star.addEventListener('mouseleave', ()=> fillStars(parseInt(document.getElementById('voto').value)));
        star.addEventListener('click',   ()=> {
            const v = parseInt(star.dataset.value);
            document.getElementById('voto').value = v;
            fillStars(v);
        });
    });
    fillStars(0);

    document.getElementById("formRecensione").addEventListener("submit", function(e) {
        e.preventDefault();
        const descr = document.getElementById("descrizione").value.trim();
        const voto  = document.getElementById("voto").value;
        if (!descr || voto === "0") {
            showInfoMsg("Compila tutti i campi e seleziona un voto!", true);
            return;
        }

        const formData = new URLSearchParams();
        formData.append("productId", productId);
        formData.append("descrizione", descr);
        formData.append("voto", voto);

        fetch('ServletRecensione', {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString()
        })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                    return;
                }
                if (response.ok) {
                    showInfoMsg("Recensione inviata con successo!");
                } else {
                    showInfoMsg("Errore nell'invio!", true);
                }
            })
            .catch(() => showInfoMsg("Errore di rete!", true));
    });

    function showInfoMsg(msg, isError = false) {
        const el = document.querySelector(".info-msg");
        el.textContent = msg;
        el.style.color = isError ? "#e29374" : "#7389AE";
    }
});
