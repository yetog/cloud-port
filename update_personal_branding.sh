#!/bin/bash

# Script to update knowledge base with personal branding and favicon
echo "🎨 Updating knowledge base with your personal branding..."

# Find all HTML files in knowledge base
HTML_FILES=$(find /var/www/zaylegend -name "*.html" -path "*/knowledge-base/*")

if [ -z "$HTML_FILES" ]; then
    echo "✅ No knowledge base HTML files found"
    exit 0
fi

echo "📁 Found $(echo "$HTML_FILES" | wc -l) files to update"

# Counter for progress
count=0
total=$(echo "$HTML_FILES" | wc -l)

# Process each file
while IFS= read -r file; do
    count=$((count + 1))
    echo "[$count/$total] Adding personal branding to $file"
    
    # Add favicon link after the charset meta tag if it doesn't exist
    if ! grep -q "favicon" "$file"; then
        sed -i '/<meta charset="utf-8">/a\    <link rel="icon" type="image/x-icon" href="favicon.ico">\n    <link rel="apple-touch-icon" href="favicon.ico">' "$file"
    fi
    
    # Update page descriptions to be more personal
    sed -i 's/Knowledge repository and learning insights/Personal knowledge base and learning insights by Isayah Young Burke/g' "$file"
    
    # Add Open Graph meta tags for better social sharing after the description meta tag
    if ! grep -q "og:title" "$file"; then
        sed -i '/<meta name="description"/a\    <meta property="og:title" content="Isayah Young Burke - Knowledge Base">\n    <meta property="og:description" content="Personal knowledge base and learning insights by Isayah Young Burke">\n    <meta property="og:image" content="https://portfoliowebsite.s3.us-central-1.ionoscloud.com/favicon.jpg">\n    <meta property="og:url" content="https://zaylegend.com/knowledge-base/">\n    <meta property="og:type" content="website">\n    <meta name="twitter:card" content="summary">\n    <meta name="twitter:site" content="@zaylegend">\n    <meta name="twitter:creator" content="@zaylegend">' "$file"
    fi
    
done <<< "$HTML_FILES"

echo "✅ Personal branding update complete!"
echo "📋 Summary:"
echo "   - Updated $total HTML files"
echo "   - Added your favicon to all pages"
echo "   - Enhanced meta descriptions with personal branding"
echo "   - Added Open Graph meta tags for better social sharing"
echo "   - Added Twitter Card meta tags"