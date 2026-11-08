import { describe, it, expect } from 'vitest';
import { compressImage, dataUrlToBlob } from './imageCompression';

describe('imageCompression utils', () => {
  describe('dataUrlToBlob', () => {
    it('converte uma dataUrl base64 em um Blob com o contentType correto', () => {
      // 1x1 transparent png
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const blob = dataUrlToBlob(dataUrl);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/png');
      expect(blob.size).toBeGreaterThan(0);
    });

    it('assume image/jpeg por padrão se contentType não for especificado no cabeçalho', () => {
      const dataUrl = 'dadossemtipo;base64,AQID';
      const blob = dataUrlToBlob(dataUrl);

      expect(blob.type).toBe('image/jpeg');
    });
  });

  describe('compressImage', () => {
    it('rejeita arquivos que não sejam do tipo image/*', async () => {
      const textFile = new File(['conteudo texto'], 'documento.txt', { type: 'text/plain' });

      await expect(compressImage(textFile)).rejects.toThrow('O arquivo selecionado não é uma imagem suportada.');
    });

    it('rejeita arquivos com mais de 25MB', async () => {
      const largeFile = new File([''], 'imagem-gigante.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 30 * 1024 * 1024 });

      await expect(compressImage(largeFile)).rejects.toThrow('A imagem é muito grande');
    });

    it('processa e retorna dataUrl para arquivos de imagem válidos', async () => {
      // Cria um File do tipo image/jpeg com dados simulados
      const file = new File(['fake-image-bytes'], 'foto.jpg', { type: 'image/jpeg' });

      const result = await compressImage(file);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.startsWith('data:')).toBe(true);
    });
  });
});
