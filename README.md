# İmtahan biletləri generatoru

Hazırladı: [Ənvər Xalid](https://www.linkedin.com/in/anvarkhalidofficial/)

Suallar faylından (.docx) qrupdakı tələbə sayı + 5 bilet yaradır. Hər biletdə 5 sual olur. Bütün suallar bir dəfə istifadə olunmayınca heç bir sual təkrarlanmır. Bilet Azərbaycan, rus və ingilis sektorları üçün yaradıla bilər.

## Lokal işə salma

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Hazır fayllar `dist` qovluğuna yazılır.

## Netlify

`netlify.toml` artıq hazırdır (build: `npm run build`, publish: `dist`).

- **GitHub ilə:** repozitoriyanı Netlify-a qoşun, ayarlar faylın içindən avtomatik götürüləcək.
- **Əl ilə:** `npm run build` edin, sonra `dist` qovluğunu app.netlify.com/drop səhifəsinə atın.
- **CLI ilə:** `npx netlify deploy --prod --dir=dist`

## Fayllar

- `src/main.js` — interfeys və əsas məntiq
- `src/tickets.js` — sualların biletlərə paylanması
- `src/docx.js` — Word faylını oxuma və yaratma
- `src/i18n.js` — AZ / RU / EN mətnləri və biletin üzərindəki yazılar
- `src/template.js` — Word şablonunun üslubları
- `src/guard.js` — sağ klik və tərtibatçı alətlərinin qısayollarının bağlanması
