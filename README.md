# Karaoke King

A lightweight browser-based karaoke stage that uses the Spotify Web API and color-lyrics endpoint for timed lyrics. Paste a temporary OAuth token or connect with your own Spotify account, search for tracks, pick a curated suggestion, and follow highlighted lines with animated styling.

## Running
Open `index.html` in a modern browser. For full functionality you can either paste a token or sign in with your own Spotify app:

**Option A: quick paste**
1. Generate a Spotify Web API access token (from the Spotify Developer Console or any Spotify app flow).
2. Paste it into the **Spotify access token** field in the header.
3. Search for a track or click a suggestion, then press **Play** to start the preview and synced lyrics.

**Option B: Connect with your Spotify account (PKCE, no client secret)**
1. Create a Spotify app and copy its **Client ID**.
2. Add the current page URL (e.g., `http://localhost:3000/index.html`) as a redirect URI in your app settings.
3. Enter the Client ID in the **Connect your Spotify account** box and click **Connect with Spotify**.
4. After the redirect, the page will trade the code for a token, remember the session, and display your account in the header. You can disconnect anytime.

### Features
- Curated suggestions with genre, mood, and tempo filters.
- Spotify search powered by your token.
- Synced lyric highlighting using the color-lyrics endpoint when available.
- Fallback instructional lyrics and metadata when previews or lyrics are missing.
- Responsive layout with neon-inspired gradients for readability.
- Built-in vocal reduction slider to strip or lower centered vocals while keeping instrumentation.
