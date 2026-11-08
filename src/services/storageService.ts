import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage, getFirebaseAuth } from './firebase';
import { compressImage, dataUrlToBlob } from '../utils/imageCompression';

/**
 * Processa uma imagem selecionada pelo usuário:
 * 1. Comprime no navegador em altíssima velocidade (< 100ms) para formato otimizado web (~40KB - 80KB).
 * 2. Se houver usuário autenticado no Firebase E o Storage estiver configurado, tenta o upload com timeout estrito de 4s.
 * 3. Se for modo local, demonstração ou se o upload falhar/expirar, retorna imediatamente a imagem comprimida local.
 */
export const processAndUploadNewsImage = async (
  file: File,
  newsId?: string
): Promise<string> => {
  // 1. Compressão imediata no navegador (gera um JPEG leve de ~40-80KB)
  const compressedDataUrl = await compressImage(file, {
    maxWidth: 1000,
    maxHeight: 750,
    quality: 0.76,
  });

  const storage = getFirebaseStorage();
  const auth = getFirebaseAuth();

  // 2. Upload para o Firebase Storage APENAS se houver sessão ativa do Firebase Auth.
  // Sem usuário Firebase real logado (ex.: login simulado admin@pampulha.org),
  // as regras de segurança padrão do Storage bloqueiam o upload e o SDK entra em loop de retries por minutos.
  if (storage && auth?.currentUser) {
    try {
      storage.maxUploadRetryTime = 3000;
      storage.maxOperationRetryTime = 3000;

      const blob = dataUrlToBlob(compressedDataUrl);
      const filename = `news/${newsId || 'novo'}_${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      const uploadPromise = (async () => {
        const snapshot = await uploadBytes(storageRef, blob, {
          contentType: 'image/jpeg',
        });
        return await getDownloadURL(snapshot.ref);
      })();

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Tempo limite de upload no Firebase Storage excedido')), 4000)
      );

      const downloadUrl = await Promise.race([uploadPromise, timeoutPromise]);
      return downloadUrl;
    } catch (error) {
      console.warn('Aviso: upload no Firebase Storage indisponível ou tempo excedido. Utilizando fallback local comprimido:', error);
      return compressedDataUrl;
    }
  }

  // 3. Modo Local / Demonstração / Sem usuário Firebase logado:
  // Retorna diretamente a imagem comprimida em milissegundos
  return compressedDataUrl;
};
