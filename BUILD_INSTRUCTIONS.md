# OPS_CORE — Build APK via GitHub (No Android Studio needed)

## What you need on your machine
- Git → https://git-scm.com/downloads
- Node.js 18+ → https://nodejs.org
- A free GitHub account → https://github.com

That's it. The APK builds in GitHub's cloud.

---

## Step-by-step

### 1. Create a GitHub repo
- Go to github.com → New repository
- Name it: `ops-core`
- Keep it Private
- Don't add README (we have files already)
- Click Create

### 2. Push this project to GitHub
Open terminal in the cc-app folder and run:

```bash
git init
git add .
git commit -m "Initial OPS_CORE build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ops-core.git
git push -u origin main
```
Replace YOUR_USERNAME with your GitHub username.

### 3. Watch it build
- Go to your repo on GitHub
- Click the **Actions** tab
- You'll see "Build Android APK" running (takes ~8 minutes)
- When it shows a green checkmark — done

### 4. Download the APK
- Click the completed workflow run
- Scroll down to **Artifacts**
- Download **OPS_CORE-debug**
- Unzip it — inside is `app-debug.apk`

### 5. Install on your phone
- Copy `app-debug.apk` to your phone (WhatsApp, Google Drive, USB, anything)
- Open it from your Files app
- If prompted: Settings → Allow from this source
- Tap Install

---

## Rebuild after changes
Any time you update the code:
```bash
git add .
git commit -m "Update"
git push
```
GitHub automatically rebuilds the APK. Download the new one from Actions.

---

## If the build fails
Common fixes:
- **"gradlew not found"** → The android/ folder wasn't generated. Re-run the workflow.
- **"SDK not found"** → The setup-android action handles this automatically. Retry.
- Any other error → Send me the red error line and I'll fix it.
