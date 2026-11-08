export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Redimensiona e comprime uma imagem selecionada pelo usuário no navegador.
 * Reduz arquivos pesados (ex.: 5MB - 15MB de fotos de celular) para arquivos otimizados (~100KB - 300KB).
 */
export const compressImage = (
  file: File,
  options: CompressImageOptions = {}
): Promise<string> => {
  const { maxWidth = 1200, maxHeight = 900, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('O arquivo selecionado não é uma imagem válida.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Falha ao ler dados da imagem.'));
        return;
      }

      // Em ambiente jsdom ou sem suporte a canvas/Image (ex.: vitest)
      const isJsdom = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('jsdom');
      if (isJsdom || typeof Image === 'undefined' || typeof document === 'undefined') {
        resolve(dataUrl);
        return;
      }

      let hasCanvasSupport = false;
      try {
        const testCanvas = document.createElement('canvas');
        hasCanvasSupport = Boolean(testCanvas && testCanvas.getContext && testCanvas.getContext('2d'));
      } catch {
        hasCanvasSupport = false;
      }

      if (!hasCanvasSupport) {
        resolve(dataUrl);
        return;
      }

      const img = new Image();

      const timer = setTimeout(() => {
        resolve(dataUrl);
      }, 5000);

      img.onload = () => {
        clearTimeout(timer);
        try {
          let { width, height } = img;

          if (width <= 0 || height <= 0) {
            resolve(dataUrl);
            return;
          }

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.max(1, Math.round(width * ratio));
            height = Math.max(1, Math.round(height * ratio));
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch {
          resolve(dataUrl);
        }
      };

      img.onerror = () => {
        clearTimeout(timer);
        resolve(dataUrl);
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo do dispositivo.'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Converte uma string Base64 Data URL para Blob para upload em Storage
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const parts = dataUrl.split(';base64,');
  const contentType = parts[0]?.split(':')[1] || 'image/jpeg';
  const base64Data = parts[1] || '';
  const binaryString = typeof atob === 'function' ? atob(base64Data) : '';
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: contentType });
};
