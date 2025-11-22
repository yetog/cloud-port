# Docker Apps Deployment

## Applications
- **dj-visualizer** (Port 3003): Audio visualization and DJ tools
  - URL: https://zaylegend.com/dj-visualizer/
  - Repository: https://github.com/yetog/apr.git
- **fineline** (Port 3004): Personal journaling and reflection app
  - URL: https://zaylegend.com/fineline/
  - Repository: https://github.com/yetog/fineline.git
- **chord-genesis** (Port 3001): Music chord generation and progression tool
  - URL: https://zaylegend.com/chord-genesis/
  - Repository: https://github.com/yetog/chord-genesis.git
- **game-hub** (Port 3005): Retro game collection and arcade
  - URL: https://zaylegend.com/game-hub/
  - Repository: https://github.com/yetog/playful-space-arcade.git
- **spritegen** (Port 3002): AI-powered sprite generation platform
  - URL: https://zaylegend.com/spritegen/
  - Repository: https://github.com/yetog/spritegen.git

## Commands
- Start all apps: `docker-compose up -d`
- Stop all apps: `docker-compose down`
- View logs: `docker-compose logs -f [service-name]`
- Health check: `./health-check.sh`
- Rebuild: `docker-compose up -d --build`

## Ports
- dj-visualizer: 3003
- fineline: 3004
- chord-genesis: 3001
- game-hub: 3005
- spritegen: 3002

## Access URLs
- dj-visualizer: https://zaylegend.com/dj-visualizer/
- fineline: https://zaylegend.com/fineline/
- chord-genesis: https://zaylegend.com/chord-genesis/
- game-hub: https://zaylegend.com/game-hub/
- spritegen: https://zaylegend.com/spritegen/
