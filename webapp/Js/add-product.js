document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const mainImageContainer = document.getElementById("main-image-container");
    const mainImagePreview = document.getElementById("main-image-preview");
    const imageInput = document.getElementById("imageInput");
    const thumbnailContainer = document.getElementById("thumbnail-container");
    const descriptionInput = document.getElementById("description");
    const charCountElement = document.getElementById("charCount");
    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");
    const pesoInput = document.getElementById("peso");


    let uploadedFiles = [];

    const renderImages = () => {
        thumbnailContainer.innerHTML = '';

        if (uploadedFiles.length === 0) {
            mainImagePreview.src = `${form.action.substring(0, form.action.lastIndexOf('/'))}/img/add-icon.svg`;
            mainImageContainer.querySelector('p').style.display = 'block';
            return;
        }

        mainImageContainer.querySelector('p').style.display = 'none';

        mainImagePreview.src = URL.createObjectURL(uploadedFiles[0]);

        uploadedFiles.forEach((file, index) => {
            if (index > 0) {
                const thumb = document.createElement("img");
                thumb.className = "thumbnail";
                thumb.src = URL.createObjectURL(file);
                thumb.alt = `Anteprima ${index + 1}`;
                thumb.addEventListener("click", () => swapImages(index));
                thumbnailContainer.appendChild(thumb);
            }
        });
    };

    const swapImages = (indexToBecomeMain) => {
        if (indexToBecomeMain === 0 || indexToBecomeMain >= uploadedFiles.length) return;

        const temp = uploadedFiles[0];
        uploadedFiles[0] = uploadedFiles[indexToBecomeMain];
        uploadedFiles[indexToBecomeMain] = temp;

        renderImages();
    };

    const updateCharCount = () => {
        const length = descriptionInput.value.trim().length;
        charCountElement.textContent = `${length} caratteri`;
        if (length < 50) {
            charCountElement.style.color = "#e74c3c"; // Red for error
            descriptionInput.style.borderColor = "#e74c3c";
        } else {
            charCountElement.style.color = "#2ecc71"; // Green for success
            descriptionInput.style.borderColor = "#2ecc71";
        }
    };


    const prepareFilesForSubmission = () => {
        const dataTransfer = new DataTransfer();
        uploadedFiles.forEach(file => {
            dataTransfer.items.add(file);
        });
        imageInput.files = dataTransfer.files;
    };



    mainImageContainer.addEventListener("click", () => {
        imageInput.click();
    });

    imageInput.addEventListener("change", (event) => {
        const newFiles = Array.from(event.target.files);

        newFiles.forEach(file => {
            if (!uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
                uploadedFiles.push(file);
            }
        });

        renderImages();
    });

    descriptionInput.addEventListener("input", updateCharCount);

    form.addEventListener("submit", (e) => {
        let isValid = true;
        let errorMsg = "";

        if (uploadedFiles.length === 0) {
            isValid = false;
            errorMsg = "Devi caricare almeno un'immagine.";
        } else if (nameInput.value.trim() === "") {
            isValid = false;
            errorMsg = "Il nome del prodotto è obbligatorio.";
        } else if (descriptionInput.value.trim().length < 50) {
            isValid = false;
            errorMsg = "La descrizione deve contenere almeno 50 caratteri.";
        } else if (!priceInput.value || parseFloat(priceInput.value) <= 0) {
            isValid = false;
            errorMsg = "Inserisci un prezzo valido e maggiore di zero.";
        } else if (!pesoInput.value || parseFloat(pesoInput.value) <= 0) {
            isValid = false;
            errorMsg = "Inserisci un peso valido e maggiore di zero.";
        }

        if (!isValid) {
            e.preventDefault();
            alert(errorMsg);
        } else {
            prepareFilesForSubmission();
        }
    });
    updateCharCount();
});