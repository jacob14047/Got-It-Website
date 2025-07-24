
document.addEventListener("DOMContentLoaded", function() {
    var promoBtn = document.querySelector('.promo-btn');
    if (promoBtn) {
        promoBtn.addEventListener("click", () => {
            if (accesso) {
                window.location.href = contextPath + "/login.jsp";
            } else {
                window.location.href = contextPath + "/addproduct.jsp";
            }
        });
    }



    function showSlidingBanner(message, urlParamToRemove) {
        let banner = document.querySelector('.slide-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.className = 'slide-banner';
            document.body.appendChild(banner);
        }

        banner.textContent = message;
        banner.classList.add('visible');

        setTimeout(() => {
            banner.classList.remove('visible');
            if (window.history.replaceState) {
                const url = new URL(window.location);
                url.searchParams.delete(urlParamToRemove);
                window.history.replaceState({}, document.title, url.pathname + url.search);
            }
        }, 3000);
    }

    const params = new URLSearchParams(window.location.search);

    if (params.get("recensione") === "ok") {
        showSlidingBanner('Recensione inviata con successo!', 'recensione');
    }

    if (params.get("pagamento") === "ok") {
        showSlidingBanner('Ordine effettuato correttamente!', 'pagamento');
    }

    var add_product = document.getElementById("add-product");
    var accesso = document.getElementById("Accedi");
    add_product.addEventListener("click", () => {
        if(accesso) {
            window.location.href = "login.jsp";
        } else {
            window.location.href = "addproduct.jsp";
        }
    });

    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const track = document.querySelector('.carousel-track');
    let cards = document.querySelectorAll('.carousel-track .product-card');

    if (track && cards.length > 0) {
        const origLen = cards.length;
        cards.forEach(card => track.appendChild(card.cloneNode(true)));
        cards = document.querySelectorAll('.carousel-track .product-card');

        let idx = 0;
        const step = () => cards.length > 1 ? (cards[1].offsetLeft - cards[0].offsetLeft) : 0;

        function showSlide(instant = false) {
            if (step() === 0) return;
            track.style.transition = instant ? 'none' : 'transform .5s ease';
            track.style.transform = `translateX(-${idx * step()}px)`;
        }

        nextBtn.onclick = () => { idx++; showSlide(); };
        prevBtn.onclick = () => { idx--; showSlide(); };

        track.addEventListener('transitionend', () => {
            if (idx >= origLen) {
                idx -= origLen;
                showSlide(true);
            }
            if (idx < 0) {
                idx += origLen;
                showSlide(true);
            }
        });

        let auto = setInterval(() => { idx++; showSlide(); }, 5000);
        track.parentElement.onmouseenter = () => clearInterval(auto);
        track.parentElement.onmouseleave = () => auto = setInterval(() => { idx++; showSlide(); }, 5000);

        window.addEventListener('load', () => showSlide(true));
    }
});