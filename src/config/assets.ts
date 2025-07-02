
export const IONOS_CONFIG = {
  bucket_name: "portfoliowebsite",
  region: "us-central-1", 
  endpoint: "https://s3.us-central-1.ionoscloud.com"
};

export const getAssetUrl = (path: string): string => {
  return `${IONOS_CONFIG.endpoint}/${IONOS_CONFIG.bucket_name}/${path}`;
};

// Asset paths - using your uploaded IONOS bucket images
export const ASSETS = {
  apps: {
    cloudLlmAssistant: getAssetUrl('apps/Ashley.png'),
    wolfAiAssistant: getAssetUrl('apps/Wolf.png'),
  },
  projects: {
    // All project images from your uploads - fixed paths to match actual uploaded files
    multipleNatures: getAssetUrl('projects/multiplenatures.png'),
    triuneEntertainment: getAssetUrl('projects/triuneentertainment.png'),
    ta2Music: getAssetUrl('projects/ta2music.png'), // Fixed: removed www. prefix
    abtechExpress: getAssetUrl('projects/abtechexpressshipping.png'),
    reflxnAesthetics: getAssetUrl('projects/reflxnsaesthetics.png'),
    cornerstoneAppliance: getAssetUrl('projects/cornerstoneappliancetrainingcourse.png'),
    eloWellness: getAssetUrl('projects/elowellnessretreat.png'),
    chrisAppliance: getAssetUrl('projects/chrisappliancecompany.png'),
    auroraResearch: getAssetUrl('projects/auroraresearchresources.com.png'), // Fixed: matches uploaded filename
    bridgeCorp: getAssetUrl('projects/thebridgecorp.png'),
    corridorContemporary: getAssetUrl('projects/corridorcontemporary.png'),
    artEmmanuel: getAssetUrl('projects/artemmanuel.png'),
    hayesCarpentry: getAssetUrl('projects/hayescarpentry.png'),
    cmha: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d', // Fallback - missing from uploads
    pcdDover: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158', // Fallback - missing from uploads
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
    // Additional uploaded images
    buddysCashews: getAssetUrl('projects/buddyscashews.png'),
  },
  profile: {
    avatar: getAssetUrl('profile/avatar.jpg'),
    background: getAssetUrl('profile/background.jpg'),
  }
};
