
const ctx = window.contextPath || '';

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.edit-price-btn').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.product-item');
            const form = item.querySelector('.edit-price-form');
            form.style.display = form.style.display === 'block' ? 'none' : 'block';
        });
    });

    document.querySelectorAll('.save-price-btn').forEach(button => {
        button.addEventListener('click', () => {
            const form = button.closest('.edit-price-form');
            const idField = form.querySelector('input[name="id"]');
            const priceField = form.querySelector('input[name="prezzo_scontato"]');
            const originalField = form.querySelector('input[name="originale"]');
            const prodId = idField ? idField.value : '';
            const newPriceRaw = priceField ? priceField.value : '';
            const origPriceRaw = originalField ? originalField.value : '';
            if (!prodId || !newPriceRaw || !origPriceRaw) {
                alert('Impossibile leggere id, prezzo scontato o prezzo originale');
                return;
            }
            const newPrice = parseFloat(newPriceRaw.replace(',', '.')).toFixed(2);
            const origPrice = parseFloat(origPriceRaw.replace(',', '.')).toFixed(2);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', ctx + '/modifypriceServlet', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            const resp = JSON.parse(xhr.responseText);
                            if (resp.success) {
                                const item = form.closest('.product-item');
                                const originalSpan = item.querySelector('.original-price, .product-price');
                                if (originalSpan) {
                                    originalSpan.classList.add('original-price');
                                    originalSpan.style.textDecoration = 'line-through';
                                    originalSpan.style.color = '#999';
                                    originalSpan.removeAttribute('id');
                                }
                                let discountSpan = item.querySelector('.discounted-price');
                                if (!discountSpan) {
                                    discountSpan = document.createElement('span');
                                    discountSpan.classList.add('discounted-price');
                                    discountSpan.id = 'price-' + prodId;
                                    discountSpan.style.fontWeight = 'bold';
                                    discountSpan.style.color = '#e60000';
                                    originalSpan.insertAdjacentElement('afterend', discountSpan);
                                }
                                discountSpan.textContent = '€' + resp.prezzoFormattato;
                                form.style.display = 'none';
                            } else {
                                alert('Errore: ' + resp.message);
                            }
                        } catch (e) {
                            console.error(e);
                            alert('Risposta non valida dal server');
                        }
                    } else {
                        alert('Errore di rete, riprova.');
                    }
                }
            };
            const body = 'id=' + encodeURIComponent(prodId)
                + '&prezzo_scontato=' + encodeURIComponent(newPrice)
                + '&originale=' + encodeURIComponent(origPrice);
            xhr.send(body);
        });
    });
});