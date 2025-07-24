document.addEventListener("DOMContentLoaded", function() {
    const contextPath = document.querySelector("body").getAttribute("data-context-path");

    document.querySelectorAll(".remove-product-btn").forEach(button => {
        button.addEventListener("click", function() {
            const codice = this.getAttribute("data-codice");

            fetch(`/profileServlet`, {
                method: 'POST',
                body: new URLSearchParams({ codice: codice })
            })
                .then(response => response.json())
                .then(updatedProducts => {
                    this.closest("li").remove();
                })
                .catch(error => console.error("Errore durante la rimozione del prodotto:", error));
        });
    });
});
