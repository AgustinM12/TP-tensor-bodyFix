// * los canvas son un elemento de html que no poseen contendio propio, por lo que requieren de js para dibujar contenido en el.
const canvas = document.getElementById('canvas');
// * variables que guardara el "contexto" de renderizado del canva y su funciones de dibujo, en este caso, un dibujo 2d
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById("fileInput");
const deleteBackground = document.getElementById("deleteBackground")
const deleteBody = document.getElementById("deleteBody")
const blurBackground = document.getElementById("blurBackground")

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

            // * Dibujar la imagen en el canvas mediante el metodo drawImage, pasandolo como parametros la imagen, las coordenadas y el ancho y alto de la imagen
            ctx.drawImage(img, 0, 0, img.width, img.height);
            canvas.classList.remove("hidden")
        };
    });
}

deleteBackground.addEventListener("click", async () => {

    //* Cargar el canva original
    const originalCanvas = document.querySelector('canvas');
    const originalCtx = originalCanvas.getContext('2d');

    // * Crear un nuevo canvas
    const newCanvas = document.createElement('canvas');
    const newCtx = newCanvas.getContext('2d');

    // * Establecer el tamaño del nuevo canvas igual al del canvas original
    newCanvas.width = originalCanvas.width;
    newCanvas.height = originalCanvas.height;

    // * Agregar el nuevo canvas al DOM (por ejemplo, después del canvas original)
    originalCanvas.parentNode.appendChild(newCanvas);

    // * Cargar modelo y sus configuraciones
    const net = await bodyPix.load({
        architecture: 'MobileNetV1', // ResNet50 //* MobileNetV1
        // * que tan precio seran, cuanto mas pequeño mas preciso pero mas pesado. 
        outputStride: 16,
        // * tamaño del modelo
        // multiplier: 0.75,
        // * el peso en bytes que usara el modelo, cuanto mas grande, mas lento redes neuronales
        quantBytes: 2
    });

    // * Segmentación de una persona en el canva.
    const { data: map } = await net.segmentPerson(originalCanvas, {
        // * la precision, afecta la velodcidad
        internalResolution: 'medium',
    });

    // *  Extraer data (mapa de bits) de la imagen
    const imgData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);

    // * Crear nueva image data para el nuevo canvas
    const newImg = newCtx.createImageData(newCanvas.width, newCanvas.height);
    const newImgData = newImg.data;

    // * un bucle itera sobre los pixeles copiando los pixeles que cumplan con la condicion en un nuevo canva.
    for (let i = 0; i < map.length; i++) {
        // *  Extrae los bits segun cada color del array del mapa de bits
        const [r, g, b, a] = [imgData.data[i * 4], imgData.data[i * 4 + 1], imgData.data[i * 4 + 2], imgData.data[i * 4 + 3]];
        [
            newImgData[i * 4],
            newImgData[i * 4 + 1],
            newImgData[i * 4 + 2],
            newImgData[i * 4 + 3]

            // * map[i] contiene el valor de cada pixel, 0 es el fondo y 1 es la persona
        ] = !map[i] ? [255, 255, 255, 0] : [r, g, b, a];
    }

    // * Dibujar la nueva imagen en el nuevo canvas
    newCtx.putImageData(newImg, 0, 0);
})

deleteBody.addEventListener("click", async () => {
    const originalCanvas = document.querySelector('canvas');
    const originalCtx = originalCanvas.getContext('2d');

    // Crear un nuevo canvas
    const newCanvas = document.createElement('canvas');
    const newCtx = newCanvas.getContext('2d');

    // Establecer el tamaño del nuevo canvas igual al del canvas original
    newCanvas.width = originalCanvas.width;
    newCanvas.height = originalCanvas.height;

    // Agregar el nuevo canvas al DOM (por ejemplo, después del canvas original)
    originalCanvas.parentNode.appendChild(newCanvas);

    // Cargar modelo
    const net = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
    });

    // Segmentación
    const { data: map } = await net.segmentPerson(originalCanvas, {
        internalResolution: 'medium',
    });

    // Extraer data de la imagen
    const imgData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);

    // Crear nueva image data para el nuevo canvas
    const newImg = newCtx.createImageData(newCanvas.width, newCanvas.height);
    const newImgData = newImg.data;

    for (let i = 0; i < map.length; i++) {
        // The data array stores four values for each pixel
        const [r, g, b, a] = [imgData.data[i * 4], imgData.data[i * 4 + 1], imgData.data[i * 4 + 2], imgData.data[i * 4 + 3]];
        [
            newImgData[i * 4],
            newImgData[i * 4 + 1],
            newImgData[i * 4 + 2],
            newImgData[i * 4 + 3]
        ] = map[i] ? [255, 255, 255, 255] : [r, g, b, a];
    }

    // Dibujar la nueva imagen en el nuevo canvas
    newCtx.putImageData(newImg, 0, 0);
})

blurBackground.addEventListener("click", async () => {
    const originalCanvas = document.querySelector('canvas');
    const originalCtx = originalCanvas.getContext('2d');

    // Crear un nuevo canvas
    const newCanvas = document.createElement('canvas');
    const newCtx = newCanvas.getContext('2d');

    // Establecer el tamaño del nuevo canvas igual al del canvas original
    newCanvas.width = originalCanvas.width;
    newCanvas.height = originalCanvas.height;

    // Agregar el nuevo canvas al DOM (por ejemplo, después del canvas original)
    originalCanvas.parentNode.appendChild(newCanvas);

    // Cargar modelo
    const net = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
    });

    // Segmentación
    const { data: map } = await net.segmentPerson(originalCanvas, {
        internalResolution: 'medium',
    });

    // Extraer data de la imagen
    const imgData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);

    // Crear nueva image data para el nuevo canvas
    const newImg = newCtx.createImageData(newCanvas.width, newCanvas.height);
    const newImgData = newImg.data;

    // Crear un canvas temporal para aplicar el desenfoque
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = originalCanvas.width;
    tempCanvas.height = originalCanvas.height;

    // Dibujar la imagen original en el canvas temporal
    tempCtx.putImageData(imgData, 0, 0);

    // Aplicar desenfoque al canvas temporal
    tempCtx.filter = 'blur(10px)';
    tempCtx.drawImage(tempCanvas, 0, 0);

    // Obtener los datos de imagen del canvas desenfocado
    const blurredImgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

    for (let i = 0; i < map.length; i++) {
        const [r, g, b, a] = [imgData.data[i * 4], imgData.data[i * 4 + 1], imgData.data[i * 4 + 2], imgData.data[i * 4 + 3]];
        const [blurR, blurG, blurB, blurA] = [blurredImgData.data[i * 4], blurredImgData.data[i * 4 + 1], blurredImgData.data[i * 4 + 2], blurredImgData.data[i * 4 + 3]];

        if (map[i]) {
            // Si es parte de la persona, usar los valores originales
            newImgData[i * 4] = r;
            newImgData[i * 4 + 1] = g;
            newImgData[i * 4 + 2] = b;
            newImgData[i * 4 + 3] = a;
        } else {
            // Si es parte del fondo, usar los valores desenfocados
            newImgData[i * 4] = blurR;
            newImgData[i * 4 + 1] = blurG;
            newImgData[i * 4 + 2] = blurB;
            newImgData[i * 4 + 3] = blurA;
        }
    }
    // Dibujar la nueva imagen en el nuevo canvas
    newCtx.putImageData(newImg, 0, 0);

})

window.onload = function () {
    runModel();
}
