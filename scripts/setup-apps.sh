
#!/bin/bash

# Setup Git Submodules for Portfolio Apps
echo "Setting up Git submodules..."

# Add each app repository as a submodule in the public directory
echo "Adding submodules..."
git submodule add https://github.com/yetog/questful-living-adventure.git public/questful-living-adventure
git submodule add https://github.com/yetog/media-magic-streamer.git public/media-magic-streamer
git submodule add https://github.com/yetog/script-scribe-ai-editor.git public/script-scribe-ai-editor
git submodule add https://github.com/yetog/playful-space-arcade.git public/playful-space-arcade
git submodule add https://github.com/yetog/pdf-saga-summarize.git public/pdf-saga-summarize
git submodule add https://github.com/yetog/serene-chord-scapes.git public/serene-chord-scapes

# Initialize and fetch all submodules
echo "Initializing and updating submodules..."
git submodule init
git submodule update --remote

echo "Submodules setup complete!"
echo "You can now run './scripts/build-apps.sh' to build all apps"
