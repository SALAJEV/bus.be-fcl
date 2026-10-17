# Filmcodelijsten

Filmcodelijsten is een interne website voor medewerkers van bus.be en Demuynck & Vansteelandt. **bus.be is de merknaam van Demuynck & Vansteelandt.**

De website biedt:

- filmcodelijsten voor lijnbussen per stelplaats en als totaaloverzicht;
- filmcodelijsten voor touringcars;
- een zoekfunctie om lijnnummers, bestemmingen, filmcodes en lijncodes op te zoeken;
- richtlijnen voor het gebruik van filmbeelden op lijnbussen.

## Gebruik en lokaal testen

Open `index.html` om de website te bekijken. Voor de zoekfunctie en PWA-functionaliteit is een lokale webserver nodig; service workers werken niet via `file://`. Met Python kan je vanuit deze map een lokale server starten:

```powershell
py -m http.server 8000
```

Open daarna <http://localhost:8000>. De PWA kan op een productieserver alleen betrouwbaar werken via HTTPS.

## Bestanden

- `index.html` bevat de pagina, vormgeving en interacties.
- `manifest.webmanifest` bevat de naam en installatie-instellingen van de PWA.
- `sw.js` beheert de offline app-shell en cache.
- `media/route-search-data.csv` bevat de gegevens voor de zoekfunctie.
- `media/*-film-codes.pdf` bevat de filmcodelijsten.
- De overige bestanden in `media/` zijn de logo's, het app-pictogram, de favicon en de achtergronden.

Wanneer je de zoekgegevens of PDF-lijsten vervangt, behoud dan de bestaande bestandsnamen of pas ook de verwijzingen in `index.html` en `sw.js` aan. Verhoog bij wijzigingen aan bestanden in de offline app-shell de cacheversie in `sw.js`.

## Intern gebruik

Deze site en de gegevens zijn uitsluitend bedoeld voor medewerkers van bus.be / Demuynck & Vansteelandt. Deel de website of de inhoud niet met derden zonder toestemming.

De toegangscode in de website is alleen een eenvoudige gebruiksdrempel en geen beveiligde toegangscontrole. Host vertrouwelijke gegevens uitsluitend achter passende server-side toegangsbeveiliging.
