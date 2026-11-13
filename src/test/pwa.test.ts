import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('PWA & Favicon Configuration', () => {
  const publicDir = path.resolve(__dirname, '../../public');
  const indexHtmlPath = path.resolve(__dirname, '../../index.html');
  const manifestPath = path.resolve(publicDir, 'manifest.webmanifest');

  it('deve conter o arquivo de manifesto Web App válido com suporte a PWA', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    expect(manifestContent.name).toContain('Diário da Pampulha');
    expect(manifestContent.short_name).toBe('Diário');
    expect(manifestContent.display).toBe('standalone');
    expect(manifestContent.theme_color).toBe('#086357');
    expect(manifestContent.start_url).toBe('./');
    expect(Array.isArray(manifestContent.icons)).toBe(true);
    expect(manifestContent.icons.length).toBeGreaterThanOrEqual(4);
  });

  it('deve possuir todos os ícones necessários para instalação no Android (192px, 512px, maskable)', () => {
    const requiredIcons = [
      'icon-192.png',
      'icon-512.png',
      'icon-192-maskable.png',
      'icon-512-maskable.png',
      'favicon.svg',
      'favicon-32x32.png',
      'favicon-16x16.png',
      'favicon.ico',
      'apple-touch-icon.png',
    ];

    for (const iconFile of requiredIcons) {
      const iconPath = path.resolve(publicDir, iconFile);
      expect(fs.existsSync(iconPath), `Arquivo ${iconFile} deve existir em public/`).toBe(true);
      const stat = fs.statSync(iconPath);
      expect(stat.size, `Arquivo ${iconFile} não deve ser vazio`).toBeGreaterThan(100);
    }
  });

  it('deve incluir links corretos para favicon, ícones e manifesto em index.html', () => {
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

    expect(indexHtml).toContain('rel="icon" type="image/svg+xml" href="./favicon.svg"');
    expect(indexHtml).toContain('rel="shortcut icon" href="./favicon.ico"');
    expect(indexHtml).toContain('rel="manifest" href="./manifest.webmanifest"');
    expect(indexHtml).toContain('rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png"');
    expect(indexHtml).toContain('name="mobile-web-app-capable" content="yes"');
  });

  it('deve conter arquivo sw.js para suporte a PWA', () => {
    const swPath = path.resolve(publicDir, 'sw.js');
    expect(fs.existsSync(swPath)).toBe(true);
  });
});
