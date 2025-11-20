# Karaoke King

A lightweight browser-based karaoke stage that uses the Spotify Web API and color-lyrics endpoint for timed lyrics. Paste a temporary OAuth token, search for tracks, pick a curated suggestion, and follow highlighted lines with animated styling.

## Running
Open `index.html` in a modern browser. For full functionality:
1. Generate a Spotify Web API access token (from the Spotify Developer Console or your app flow).
2. Paste it into the **Spotify access token** field in the header.
3. Search for a track or click a suggestion, then press **Play** to start the preview and synced lyrics.

### Features
- Curated suggestions with genre, mood, and tempo filters.
- Spotify search powered by your token.
- Synced lyric highlighting using the color-lyrics endpoint when available.
- Fallback instructional lyrics and metadata when previews or lyrics are missing.
- Responsive layout with neon-inspired gradients for readability.
