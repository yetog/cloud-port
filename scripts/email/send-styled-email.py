#!/usr/bin/env python3
"""
Styled Email Sender - Professional dark-themed emails

Usage:
  send-styled-email.py <to> <subject> --compose
  send-styled-email.py <to> <subject> --file <content.html>
  send-styled-email.py <to> <subject> --quick "<recipient_name>" "<intro>" "<body>" "<closing>"

Examples:
  # Interactive compose mode
  send-styled-email.py aryan@email.com "Project Update" --compose

  # From prepared HTML content file
  send-styled-email.py aryan@email.com "Project Update" --file /tmp/my-content.html

  # Quick one-liner
  send-styled-email.py aryan@email.com "Quick Update" --quick "Aryan" "Just wanted to follow up." "The project is on track." "Talk soon!"

Templates available in: scripts/email/templates/
"""

import smtplib
import sys
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path

# Gmail SMTP Config
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "isayahy@gmail.com"
SMTP_PASS = "uovttyvyakdlzgsu"

SCRIPT_DIR = Path(__file__).parent
TEMPLATE_DIR = SCRIPT_DIR / "templates"

# Base template
BASE_TEMPLATE = '''<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #e5e5e5;">
  <div style="max-width: 640px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #a855f7; font-size: 28px; margin: 0 0 8px 0;">{title}</h1>
      {subtitle_html}
    </div>

    <!-- Greeting -->
    <p style="font-size: 16px; line-height: 1.6; color: #d4d4d4;">
      Hey {recipient_name},
    </p>
    <p style="font-size: 16px; line-height: 1.6; color: #d4d4d4;">
      {intro}
    </p>

    <!-- Main Content -->
    {content}

    <!-- Closing -->
    <p style="font-size: 16px; line-height: 1.6; color: #d4d4d4; margin-top: 32px;">
      {closing}
    </p>

    <!-- Signature -->
    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #262626;">
      <p style="margin: 0; font-size: 16px; font-weight: 600; color: #e5e5e5;">Zay Legend</p>
      <p style="margin: 4px 0 0 0; font-size: 14px; color: #737373;">Web and Audio Engineer</p>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #525252;">New York City · Philadelphia · Barbados</p>
      <div style="margin-top: 12px;">
        <a href="https://zaylegend.com" style="color: #a855f7; text-decoration: none; font-size: 13px; margin-right: 16px;">zaylegend.com</a>
        <a href="https://zaylegend.com/dj" style="color: #a855f7; text-decoration: none; font-size: 13px; margin-right: 16px;">DJ Portfolio</a>
        <a href="https://calendly.com/zaylegend" style="color: #a855f7; text-decoration: none; font-size: 13px;">Book a Call</a>
      </div>
    </div>

  </div>
</body>
</html>'''

# Component templates for easy composition
COMPONENTS = {
    'section': '''<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #2d2d44;">
  <h2 style="color: #a855f7; font-size: 20px; margin: 0 0 20px 0; border-bottom: 1px solid #3d3d5c; padding-bottom: 12px;">
    {title}
  </h2>
  {content}
</div>''',

    'highlight': '''<div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #4c1d95;">
  <h2 style="color: #c4b5fd; font-size: 20px; margin: 0 0 16px 0;">
    ⭐ {title}
  </h2>
  <p style="color: #e9d5ff; font-size: 16px; line-height: 1.6; margin: 0;">
    {content}
  </p>
</div>''',

    'action': '''<div style="background: #0c4a6e; border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #0369a1;">
  <h2 style="color: #7dd3fc; font-size: 20px; margin: 0 0 20px 0;">
    📋 {title}
  </h2>
  <div style="font-size: 14px; line-height: 2;">
    {content}
  </div>
</div>''',

    'card': '''<div style="background: #171717; border-radius: 12px; padding: 24px; margin: 32px 0; border: 1px solid #262626;">
  <h2 style="color: #a855f7; font-size: 20px; margin: 0 0 16px 0;">
    {title}
  </h2>
  {content}
</div>''',

    'button_purple': '''<a href="{url}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-right: 8px; margin-bottom: 8px;">
  {text}
</a>''',

    'button_orange': '''<a href="{url}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-bottom: 8px;">
  {text}
</a>''',

    'button_github': '''<a href="{url}" style="display: inline-block; background: #21262d; color: #d4d4d4; text-decoration: none; padding: 10px 16px; border-radius: 6px; font-size: 13px; border: 1px solid #30363d; margin-right: 8px; margin-bottom: 8px;">
  📦 {text}
</a>''',

    'paragraph': '''<p style="color: #a3a3a3; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
  {content}
</p>''',

    'checklist_item': '''<p style="margin: 0; color: #bae6fd;">☐ {item}</p>''',

    'check_done': '''<span style="color: #22c55e;">✓</span> <span style="color: #a3a3a3;">{item}</span><br>''',
}


def send_email(to_email, subject, html_body):
    """Send an HTML email via Gmail SMTP."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Zay Legend <{SMTP_USER}>"
    msg["To"] = to_email

    # Plain text fallback
    msg.attach(MIMEText("Please view this email in an HTML-capable client.", "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, to_email, msg.as_string())
        print(f"✓ Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def build_email(title, subtitle, recipient_name, intro, content, closing):
    """Build the full HTML email from components."""
    subtitle_html = f'<p style="color: #737373; font-size: 16px; margin: 0;">{subtitle}</p>' if subtitle else ''

    return BASE_TEMPLATE.format(
        title=title,
        subtitle_html=subtitle_html,
        recipient_name=recipient_name,
        intro=intro,
        content=content,
        closing=closing
    )


def interactive_compose():
    """Interactive mode for composing emails."""
    print("\n🎨 Styled Email Composer")
    print("=" * 40)

    title = input("Email title (header): ")
    subtitle = input("Subtitle (optional, press Enter to skip): ")
    recipient_name = input("Recipient's first name: ")
    intro = input("Opening line: ")

    print("\nPaste your main content (HTML or plain text).")
    print("Type 'END' on a new line when done:")

    content_lines = []
    while True:
        line = input()
        if line.strip() == 'END':
            break
        content_lines.append(line)
    content = '\n'.join(content_lines)

    # Wrap plain text in paragraph tags if no HTML detected
    if '<' not in content:
        paragraphs = content.split('\n\n')
        content = '\n'.join([
            f'<p style="color: #a3a3a3; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">{p}</p>'
            for p in paragraphs if p.strip()
        ])

    closing = input("Closing line: ")

    return build_email(title, subtitle, recipient_name, intro, content, closing)


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        print("\nAvailable components:")
        for name in COMPONENTS:
            print(f"  - {name}")
        sys.exit(1)

    to_email = sys.argv[1]
    subject = sys.argv[2]

    if len(sys.argv) > 3:
        mode = sys.argv[3]

        if mode == "--compose":
            html_body = interactive_compose()

        elif mode == "--file" and len(sys.argv) > 4:
            content_file = Path(sys.argv[4])
            if content_file.exists():
                html_body = content_file.read_text()
            else:
                print(f"File not found: {content_file}")
                sys.exit(1)

        elif mode == "--quick" and len(sys.argv) >= 7:
            recipient_name = sys.argv[4]
            intro = sys.argv[5]
            body = sys.argv[6]
            closing = sys.argv[7] if len(sys.argv) > 7 else "Talk soon!"

            # Wrap body text in styled paragraph
            content = f'<p style="color: #a3a3a3; font-size: 14px; line-height: 1.6; margin: 0;">{body}</p>'
            html_body = build_email(subject, "", recipient_name, intro, content, closing)

        else:
            print("Invalid arguments. See usage above.")
            sys.exit(1)
    else:
        print("No mode specified. Use --compose, --file, or --quick")
        sys.exit(1)

    # Preview
    print("\n📧 Preview:")
    print(f"   To: {to_email}")
    print(f"   Subject: {subject}")

    confirm = input("\nSend this email? [y/N]: ")
    if confirm.lower() == 'y':
        send_email(to_email, subject, html_body)
    else:
        # Save draft
        draft_path = Path("/tmp/email-draft.html")
        draft_path.write_text(html_body)
        print(f"Draft saved to: {draft_path}")


if __name__ == "__main__":
    main()
