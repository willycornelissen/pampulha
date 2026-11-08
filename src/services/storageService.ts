import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage } from './firebase';
import { compressImage, dataUrlToBlob } from '../utils/imageCompression';

/**
 * Processa uma imagem selecionada pelo usuário:
 * 1. Comprime no navegador para formato otimizado web (~150-250KB).
 * 2. Se o Firebase Storage estiver disponível, faz o upload para o bucket e retorna o URL público.
 * 3. Caso contrário (Modo Demonstração / Local), retorna o Base64 comprimido imediatamente.
 */
export const processAndUploadNewsImage = async (
  file: File,
  newsId?: string
): Promise<string> => {
  // 1. Compressão imediata no navegador
  const compressedDataUrl = await compressImage(file, {
    maxWidth: 1200,
    maxHeight: 900,
    quality: 0.82,
  });

  const storage = getFirebaseStorage();

  // 2. Upload para o Firebase Storage se configurado
  if (storage) {
    try {
      const blob = dataUrlToBlob(compressedDataUrl);
      const filename = `news/${newsId || 'novo'}_${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      const snapshot = await uploadBytes(storageRef, blob, {
        contentType: 'image/jpeg',
      });

      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.warn('Aviso: upload no Firebase Storage indisponível, utilizando fallback em Base64:', error);
      return compressedDataUrl;
    }
  }

  // 3. Modo Local / Demonstração
  return compressedDataUrl;
};
