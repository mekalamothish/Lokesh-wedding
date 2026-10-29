LOKESH & MAMATHA — COMPLETE WEDDING WEBSITE

This package contains the complete ready-to-host website, including the new
Kalyanam Vybhogam MP3, floral artwork, English/Telugu content and countdown.
No build step, installation, database or backend is needed.

HOW TO HOST
1. Extract this ZIP file.
2. Upload index.html, invitation.css, invitation.js, translations.json and the
   entire assets folder to your web hosting public folder (often public_html).
3. Make sure index.html is directly inside the folder your domain serves.
4. Open your domain in a browser.

You can also deploy the extracted folder using a static website host's upload
or drag-and-drop feature. Select the folder containing index.html as the
publish folder. Leave the build command empty.

Keep the directory structure unchanged. Relative asset links also support
hosting the invitation in a subfolder.

FILES
index.html          Invitation content, page structure and audio reference
invitation.css      Colours, spacing and responsive layouts
invitation.js       Language switch, page navigation, music and live countdown
translations.json   English and Telugu content reference
assets/             Template styles, artwork and Kalyanam Vybhogam MP3

EDITING
Edit index.html for the initial English content. Edit the translations object
at the top of invitation.js for text shown when changing languages. Keep
translations.json in sync when you edit translations; it is a reference file.
The invitation opens in Telugu by default; the language toggle remembers a
newly selected language.
Change colours and spacing in invitation.css.
The countdown target is in invitation.js: 15 November 2026, 4:00 AM IST.
The song is assets/kalyanam-vybhogam.mp3.

NOTES
Music tries to play automatically on page load. Browsers often block audible
autoplay until a user interaction; tap the L & M envelope seal to open the
invitation and start the music.
The music button pauses/resumes it; choosing Pause is respected.
Google Fonts loads the typefaces over the internet; fallback fonts are included
in the styles. Your host does not need a connection to the current Sites host.

BUTTON ENTRANCE ANIMATION
Buttons and links play one slow bounce when at least 60% enters the viewport.
Below-the-fold controls wait until guests scroll to them; hidden-screen
controls wait until their screen is opened and they come into view. Each
control plays only once per page load or refresh.
Returning to a screen does not replay the effect. Reduced-motion preferences
are respected. Adjust DURATION, STAGGER and START_DELAY in button-entrance.js
to change the timing (milliseconds).
