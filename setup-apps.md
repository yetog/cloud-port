
# Setting Up App Submodules

This guide will help you set up the Git submodules for your portfolio apps.

## Step 1: Add Git Submodules

Run these commands in your project root to add each app as a submodule:

```bash
# Add each app repository as a submodule in the public directory
git submodule add https://github.com/yetog/questful-living-adventure.git public/questful-living-adventure
git submodule add https://github.com/yetog/media-magic-streamer.git public/media-magic-streamer
git submodule add https://github.com/yetog/script-scribe-ai-editor.git public/script-scribe-ai-editor
git submodule add https://github.com/yetog/playful-space-arcade.git public/playful-space-arcade
git submodule add https://github.com/yetog/pdf-saga-summarize.git public/pdf-saga-summarize
git submodule add https://github.com/yetog/serene-chord-scapes.git public/serene-chord-scapes
```

## Step 2: Initialize and Update Submodules

```bash
# Initialize and fetch all submodules
git submodule init
git submodule update --remote
```

## Step 3: Build Apps (Optional)

If your apps need to be built, you can add build scripts to handle this automatically.

## Updating Apps

To update all apps to their latest versions:

```bash
git submodule update --remote
```

## Notes

- Each app will be available at `/app-name/` in your portfolio
- The apps will be served directly from the public folder
- Make sure each app has an `index.html` file in its root or dist folder
- You may need to adjust base paths in individual apps for proper routing
