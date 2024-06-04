const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById("fileInput");

function runModel() {
    // * Cargar la imagen
    fileInput.addEventListener('change', async function () {
        const file = fileInput.files[0];
        const imgUrl = URL.createObjectURL(file);

        const img = new Image();
        img.src = imgUrl;

        img.onload = function () {
            // * Establecer el tamaño del canvas igual al tamaño de la imagen
            canvas.width = img.width;
            canvas.height = img.height;

            // * Dibujar la imagen en el canvas
            ctx.drawImage(img, 0, 0, img.width, img.height);
            canvas.classList.remove("hidden")
        };
    });
}

window.onload = function () {
    runModel();
}
