
export const IONOS_CONFIG = {
  bucket_name: "portfoliowebsite",
  region: "us-central-1", 
  endpoint: "https://s3.us-central-1.ionoscloud.com"
};

export const getAssetUrl = (path: string): string => {
  return `${IONOS_CONFIG.endpoint}/${IONOS_CONFIG.bucket_name}/${path}`;
};

// Asset paths - you can update these when you upload your images
export const ASSETS = {
  apps: {
    cloudLlmAssistant: getAssetUrl('apps/cloud-llm-assistant.png'),
    wolfAiAssistant: getAssetUrl('apps/wolf-ai-assistant.png'),
  },
  projects: {
    // Placeholder paths for existing projects - replace with actual uploaded images
    cloudMigration: getAssetUrl('projects/cloud-migration.jpg'),
    devopsPipeline: getAssetUrl('projects/devops-pipeline.jpg'),
    cloudSecurity: getAssetUrl('projects/cloud-security.jpg'),
    scalableArchitecture: getAssetUrl('projects/scalable-architecture.jpg'),
    serverlessApi: getAssetUrl('projects/serverless-api.jpg'),
    nextjsHosting: getAssetUrl('projects/nextjs-hosting.jpg'),
    artExhibition: getAssetUrl('projects/art-exhibition.jpg'),
    mixedMediaSalon: getAssetUrl('projects/mixed-media-salon.jpg'),
    galleryTech: getAssetUrl('projects/gallery-tech.jpg'),
    musicProduction: getAssetUrl('projects/music-production.jpg'),
    remoteMix: getAssetUrl('projects/remote-mix.jpg'),
    immersiveAudio: getAssetUrl('projects/immersive-audio.jpg'),
  },
  profile: {
    avatar: getAssetUrl('profile/avatar.jpg'),
    background: getAssetUrl('profile/background.jpg'),
  }
};
