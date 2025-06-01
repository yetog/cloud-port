
# Setting Up App Submodules

This guide will help you set up the Git submodules for your portfolio apps using the provided scripts.

## Prerequisites

- Git installed on your system
- Node.js and npm installed
- Access to the app repositories (public or with proper authentication)

## Step 1: Make Scripts Executable

First, make the setup scripts executable:

```bash
chmod +x scripts/*.sh
```

## Step 2: Setup Submodules

Run the setup script to add all app repositories as submodules:

```bash
./scripts/setup-apps.sh
```

This script will:
- Add each app repository as a submodule in the `public/` directory
- Initialize and fetch all submodules
- Set up the proper directory structure

## Step 3: Build All Apps

Build all the apps and prepare them for serving:

```bash
./scripts/build-apps.sh
```

This script will:
- Navigate to each app directory
- Install dependencies (`npm install`)
- Build the app (`npm run build`)
- Copy built files from `dist/` or `build/` to the app root for serving

## Quick Commands

- **Setup everything**: `./scripts/setup-apps.sh`
- **Update apps**: `./scripts/update-apps.sh`
- **Build apps**: `./scripts/build-apps.sh`
- **Update and build**: `./scripts/build-all.sh`

## Manual Alternative

If you prefer to run commands manually:

```bash
# Add submodules
git submodule add https://github.com/yetog/questful-living-adventure.git public/questful-living-adventure
git submodule add https://github.com/yetog/media-magic-streamer.git public/media-magic-streamer
git submodule add https://github.com/yetog/script-scribe-ai-editor.git public/script-scribe-ai-editor
git submodule add https://github.com/yetog/playful-space-arcade.git public/playful-space-arcade
git submodule add https://github.com/yetog/pdf-saga-summarize.git public/pdf-saga-summarize
git submodule add https://github.com/yetog/serene-chord-scapes.git public/serene-chord-scapes

# Initialize and update
git submodule init
git submodule update --remote

# Build individual apps (repeat for each)
cd public/questful-living-adventure
npm install
npm run build
cp -r dist/* ./  # or build/* if using build directory
cd ../..
```

## Updating Apps

To update all apps to their latest versions:

```bash
./scripts/update-apps.sh
```

Then rebuild if needed:

```bash
./scripts/build-apps.sh
```

## Notes

- Each app will be available at `/app-name/` in your portfolio
- The apps will be served directly from the public folder
- Make sure each app has an `index.html` file in its root or dist folder after building
- Some apps may need environment variables - configure these in each app's directory
- If an app fails to build, the script will continue with the remaining apps

## Troubleshooting

### Permission Issues
```bash
chmod +x scripts/*.sh
```

### Submodule Authentication
For private repositories, ensure you have proper Git credentials configured:
```bash
git config --global credential.helper store
```

### App Not Loading
- Check that the app has an `index.html` file in its root after building
- Verify the build output directory (some apps use `build/` instead of `dist/`)
- Check browser console for any path-related errors

### Build Failures
- Ensure Node.js and npm are installed
- Check if the app requires specific Node.js version
- Look for missing environment variables in the app's documentation
