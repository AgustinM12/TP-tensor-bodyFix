export async function removebackground() {
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
    ] = !map[i] ? [255, 255, 255, 0] : [r, g, b, a];
  }

  // Dibujar la nueva imagen en el nuevo canvas
  newCtx.putImageData(newImg, 0, 0);
}
