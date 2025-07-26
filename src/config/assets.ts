
export const IONOS_CONFIG = {
  bucket_name: "portfoliowebsite",
  region: "us-central-1", 
  endpoint: "https://s3.us-central-1.ionoscloud.com"
};

export const getAssetUrl = (path: string): string => {
  const url = `${IONOS_CONFIG.endpoint}/${IONOS_CONFIG.bucket_name}/${path}`;
  console.log(`Asset URL generated: ${url}`);
  return url;
};

// Asset paths - using your uploaded IONOS bucket images
export const ASSETS = {
  apps: {
    cloudLlmAssistant: getAssetUrl('apps/Ashley.png'),
    wolfAiAssistant: getAssetUrl('apps/Wolf.png'),
    zenReset: getAssetUrl('apps/zen-reset.png'),
  },
  projects: {
    // All project images from your uploads - fixed paths to match actual uploaded files
    multipleNatures: getAssetUrl('projects/multiplenatures.png'),
    triuneEntertainment: getAssetUrl('projects/triuneentertainment.png'),
    ta2Music: 'https://portfoliowebsite.s3.us-central-1.ionoscloud.com/projects/TA2.png', // Updated to new URL
    abtechExpress: getAssetUrl('projects/abtechexpressshipping.png'),
    reflxnAesthetics: getAssetUrl('projects/reflxnsaesthetics.png'),
    cornerstoneAppliance: getAssetUrl('projects/cornerstoneappliancetrainingcourse.png'),
    eloWellness: getAssetUrl('projects/elowellnessretreat.png'),
    chrisAppliance: getAssetUrl('projects/chrisappliancecompany.png'),
    auroraResearch: getAssetUrl('projects/auroraresearchresources.com.png'),
    bridgeCorp: getAssetUrl('projects/thebridgecorp.png'),
    corridorContemporary: getAssetUrl('projects/corridorcontemporary.png'),
    artEmmanuel: getAssetUrl('projects/artemmanuel.png'),
    hayesCarpentry: getAssetUrl('projects/hayescarpentry.png'),
    cmha: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d', // Fallback - missing from uploads
    pcdDover: 'https://images.unsplash.com/photo-1581091225-a6a2a5aee158', // Fallback - missing from uploads
    achieveCmo: getAssetUrl('projects/achievecmo.png'),
    zeartsGallery: getAssetUrl('projects/zearts.png'),
    nutritionalParty: getAssetUrl('projects/thenutritionalpartybook.png'),
    starfuraSpace: getAssetUrl('projects/starfura-space.png'),
    cubbysCruises: getAssetUrl('projects/cubbyscruises.png'),
    oww1Association: getAssetUrl('projects/oww1.png'),
    blucciFurniture: getAssetUrl('projects/blucci.png'),
    iyfeiEntertainment: getAssetUrl('projects/iyfei.png'),
    agnesMas: getAssetUrl('projects/agnesmasdexaxars.png'),
    wraRealty: getAssetUrl('projects/wrarealty.png'),
    musicWorks: getAssetUrl('projects/musicworksnyc.png'),
    hudsonBoxing: getAssetUrl('projects/hudsonboxinggym.png'),
    castellLp: getAssetUrl('projects/castelllp.png'),
    buddysCashews: getAssetUrl('projects/buddyscashews.png'),
  },
  profile: {
    // Try both extensions to see which one works
    avatar: getAssetUrl('profile/avatar.jpg'),
    avatarPng: getAssetUrl('profile/avatar.png'), // Alternative in case it's PNG
    background: getAssetUrl('profile/background.jpg'),
  }
};
