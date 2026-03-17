
#!/bin/bash

# Update and build all apps in one command
echo "Updating and building all portfolio apps..."

./scripts/update-apps.sh
./scripts/build-apps.sh

echo "Complete! All apps are updated and built."
