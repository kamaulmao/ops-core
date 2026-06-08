# YouTube OAuth Setup for APK

When running as an Android app, the OAuth redirect needs updating.

## In Google Cloud Console

1. Go to https://console.cloud.google.com
2. Your project → APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs" add:
   - `com.crimsoncactus.opscore:/oauth2redirect`
5. Under "Authorized JavaScript origins" add:
   - `https://localhost`
   - `capacitor://localhost`

## In the app

In Settings, paste your Client ID — the OAuth flow will open
your phone's browser, authenticate, then return to the app.
