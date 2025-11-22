#!/bin/bash

# Simple Infrastructure Documentation to Knowledge Base Converter
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }

# Paths
DOCS_DIR="/var/www/zaylegend/infrastructure-docs"
KB_DIR="/var/www/zaylegend/apps/knowledge-base/infrastructure"

# Create infrastructure directory
mkdir -p "$KB_DIR"
log_info "Created infrastructure directory"

# Simple conversion function using Python
convert_md_to_html() {
    local md_file="$1"
    local html_file="$2"
    local title="$3"
    local description="$4"
    
    log_info "Converting $md_file to $html_file"
    
    python3 << EOF
import markdown
import re

# Read markdown
with open('$DOCS_DIR/$md_file', 'r') as f:
    md_content = f.read()

# Convert to HTML
md = markdown.Markdown(extensions=['fenced_code', 'tables', 'toc'])
html_content = md.convert(md_content)

# Add header anchors
html_content = re.sub(r'<h([1-6])>([^<]*)</h([1-6])>', r'<h\1 id="\2"><a href="#\2" class="header-anchor">#</a> \2</h\3>', html_content)

# Clean IDs
html_content = re.sub(r'id="([^"]*)"', lambda m: f'id="{re.sub(r"[^a-zA-Z0-9-]", "-", m.group(1).lower())}"', html_content)

# Write HTML template
html_template = '''<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8">
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="apple-touch-icon" href="../favicon.ico">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>$title | Isayah Young Burke</title>
    <meta name="description" content="$description">
    <meta property="og:title" content="Isayah Young Burke - Infrastructure Documentation">
    <meta property="og:description" content="$description">
    <meta property="og:image" content="https://portfoliowebsite.s3.us-central-1.ionoscloud.com/favicon.jpg">
    <meta property="og:url" content="https://zaylegend.com/knowledge-base/infrastructure/">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@zaylegend">
    <meta name="twitter:creator" content="@zaylegend">
    <link rel="stylesheet" href="../assets/css/styles.css">
</head>
<body>
    <div id="app">
        <div class="theme-container">
            <header class="navbar">
                <a href="https://zaylegend.com/" class="home-link">
                    <span class="site-name">Isayah Young Burke</span>
                </a>
                <div class="links">
                    <nav class="nav-links">
                        <div class="nav-item"><a href="https://zaylegend.com/blog/" class="nav-link">Blog</a></div>
                        <div class="nav-item"><a href="../index.html" class="nav-link">Knowledge</a></div>
                    </nav>
                </div>
            </header>
            <aside class="sidebar">
                <ul class="sidebar-links">
                    <li><section class="sidebar-group depth-0">
                        <p class="sidebar-heading open"><span>Infrastructure</span></p>
                        <ul class="sidebar-links sidebar-group-items">
                            <li><a class='sidebar-link' href='index.html'>Documentation Overview</a></li>
                            <li><a class='sidebar-link' href='overview.html'>Architecture Overview</a></li>
                            <li><a class='sidebar-link' href='ci-cd-pipeline.html'>CI/CD Pipeline</a></li>
                            <li><a class='sidebar-link' href='docker-strategy.html'>Docker Strategy</a></li>
                            <li><a class='sidebar-link' href='deployment-process.html'>Deployment Process</a></li>
                            <li><a class='sidebar-link' href='server-configuration.html'>Server Configuration</a></li>
                            <li><a class='sidebar-link' href='orchestration-guide.html'>Orchestration Guide</a></li>
                        </ul>
                    </section></li>
                </ul>
            </aside>
            <main class="page">
                <div class="theme-default-content content__default">
                    ''' + html_content + '''
                </div>
                <footer class="page-edit">
                    <div class="last-updated">
                        <span class="prefix">Last Updated:</span>
                        <span class="time">November 2024</span>
                    </div>
                </footer>
            </main>
        </div>
    </div>
</body>
</html>'''

with open('$KB_DIR/$html_file', 'w') as f:
    f.write(html_template)
EOF

    log_success "Converted $md_file"
}

# Convert all files
convert_md_to_html "README.md" "index.html" "Infrastructure Documentation" "Complete infrastructure documentation for zaylegend.com portfolio platform"
convert_md_to_html "overview.md" "overview.html" "Infrastructure Overview" "High-level architecture and technology stack overview"
convert_md_to_html "ci-cd-pipeline.md" "ci-cd-pipeline.html" "CI/CD Pipeline" "Continuous integration and deployment workflows"
convert_md_to_html "docker-strategy.md" "docker-strategy.html" "Docker Strategy" "Containerization approach and management strategies"
convert_md_to_html "deployment-process.md" "deployment-process.html" "Deployment Process" "Step-by-step deployment procedures and best practices"
convert_md_to_html "server-configuration.md" "server-configuration.html" "Server Configuration" "Nginx, SSL, and system configuration details"
convert_md_to_html "orchestration-guide.md" "orchestration-guide.html" "Orchestration Guide" "Complete infrastructure recreation and setup guide"

# Copy favicon
if [[ -f "/var/www/zaylegend/apps/knowledge-base/favicon.ico" ]]; then
    cp "/var/www/zaylegend/apps/knowledge-base/favicon.ico" "$KB_DIR/"
fi

log_success "Infrastructure documentation successfully converted!"
echo ""
echo "🌐 Available at: https://zaylegend.com/knowledge-base/infrastructure/"
echo "📁 Local files: $KB_DIR"