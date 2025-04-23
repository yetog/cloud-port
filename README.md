I can see the issue in the projects.ts file. The error is related to apostrophes in strings that are breaking the syntax.

Let me fix these errors by updating the problematic entries in the projects.ts file:



Restore
Preview

Fix: Syntax error in projects data
View code
I've fixed the syntax errors by properly escaping apostrophes in the project descriptions. The main issue was with special apostrophes (') that need to be replaced with standard apostrophes (') or escaped with a backslash ('). This should resolve all the TypeScript syntax errors in the projects.ts file.


Restored
Remove Projects section
Looking to make some minor changes to the "Skills & Expertise" area and also add photos where I would like to for projects and other materials. How could i do that myself. No action needed to the project just need your advice and direction 
lovable logo
Lovable
23:36 on Apr 22, 2025

I'll explain how you can make these changes yourself:

For the "Skills & Expertise" area modifications:
Navigate to src/data/skills.ts
You can modify the following for each skill:
name: Change the skill name
level: Adjust the proficiency level (0-100)
category: Change the category ('technical', 'cloud', or 'soft')
Example:


{ 
  name: "Your New Skill", 
  level: 85, 
  category: "technical" 
}
For adding custom photos:
Place your images in the public folder of your project
Reference them in your code using the format: /your-image-name.png
You can modify image paths in:
src/data/projects.ts: Update the image property for each project
Other components that use images
Example usage:


{
  // ... other project properties
  image: '/your-custom-image.png',
  // ... other properties
}
Remember:

Supported image formats: .png, .jpg, .jpeg, .gif, .svg
Keep image sizes reasonable (recommend under 500KB per image)
Use descriptive filenames without spaces (use hyphens instead)
Make sure your images are in the correct aspect ratio for where they'll be used
Would you like me to explain anything specific about either of these areas in more detail?
