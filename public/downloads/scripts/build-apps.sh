
#!/bin/bash

# Build all portfolio apps and copy their dist files
echo "Building all portfolio apps..."

apps=(
  "questful-living-adventure"
  "media-magic-streamer" 
  "script-scribe-ai-editor"
  "playful-space-arcade"
  "pdf-saga-summarize"
  "serene-chord-scapes"
)

for app in "${apps[@]}"; do
  echo "Building $app..."
  
  if [ -d "public/$app" ]; then
    cd "public/$app"
    
    # Install dependencies if needed
    if [ -f "package.json" ]; then
      echo "Installing dependencies for $app..."
      npm install
      
      echo "Building $app..."
      npm run build
      
      # Check if dist directory exists and copy files
      if [ -d "dist" ]; then
        echo "Copying dist files for $app..."
        cp -r dist/* ./
      elif [ -d "build" ]; then
        echo "Copying build files for $app..."
        cp -r build/* ./
      else
        echo "Warning: No dist or build directory found for $app"
      fi
    else
      echo "Warning: No package.json found for $app"
    fi
    
    cd "../.."
  else
    echo "Warning: Directory public/$app does not exist"
  fi
done

echo "All apps built successfully!"
