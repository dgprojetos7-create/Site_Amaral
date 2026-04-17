const MAX_INLINE_IMAGE_LENGTH = 60000;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Nao foi possivel processar a imagem selecionada.'));
    image.src = src;
  });

export const isOversizedInlineImage = (value: string) => value.startsWith('data:image/') && value.length > MAX_INLINE_IMAGE_LENGTH;

export const optimizeImageForStorage = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Selecione um arquivo de imagem valido.');
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    let width = image.width;
    let height = image.height;
    let quality = 0.82;
    let iteration = 0;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('O navegador nao conseguiu preparar a imagem para upload.');
    }

    while (iteration < 6) {
      const scale = Math.min(1, 1400 / width, 1400 / height);
      const nextWidth = Math.max(1, Math.round(width * scale));
      const nextHeight = Math.max(1, Math.round(height * scale));

      canvas.width = nextWidth;
      canvas.height = nextHeight;
      context.clearRect(0, 0, nextWidth, nextHeight);
      context.drawImage(image, 0, 0, nextWidth, nextHeight);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      if (dataUrl.length <= MAX_INLINE_IMAGE_LENGTH) {
        return dataUrl;
      }

      width = Math.round(nextWidth * 0.86);
      height = Math.round(nextHeight * 0.86);
      quality = Math.max(0.52, quality - 0.08);
      iteration += 1;
    }

    throw new Error('A imagem continua grande demais para salvar no artigo. Use uma versao menor ou selecione uma imagem da biblioteca.');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};
