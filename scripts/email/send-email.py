#!/usr/bin/env python3
"""
Simple Email Sender using Gmail SMTP

Usage:
  send-email.py <to> <subject> <body>
  send-email.py <to> <subject> --html <html_file>
  send-email.py <to> <subject> --stdin  (reads body from stdin)

Examples:
  send-email.py user@example.com "Hello" "This is the message"
  echo "Message body" | send-email.py user@example.com "Subject" --stdin
  send-email.py user@example.com "Report" --html report.html
"""

import smtplib
import sys
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path

# Gmail SMTP Config
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "isayahy@gmail.com"
SMTP_PASS = "wdzvscnewdsabhgd"


def send_email(to_email, subject, body, html_body=None):
    """Send an email via Gmail SMTP."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Zay Legend <{SMTP_USER}>"
    msg["To"] = to_email

    # Add plain text
    msg.attach(MIMEText(body, "plain"))
    
    # Add HTML if provided
    if html_body:
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


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    to_email = sys.argv[1]
    subject = sys.argv[2]
    
    # Determine body source
    if len(sys.argv) > 3:
        if sys.argv[3] == "--stdin":
            body = sys.stdin.read()
            html_body = None
        elif sys.argv[3] == "--html" and len(sys.argv) > 4:
            html_file = Path(sys.argv[4])
            if html_file.exists():
                html_body = html_file.read_text()
                body = "See HTML version"
            else:
                print(f"File not found: {html_file}")
                sys.exit(1)
        else:
            body = sys.argv[3]
            html_body = None
    else:
        body = sys.stdin.read() if not sys.stdin.isatty() else ""
        html_body = None

    if not body and not html_body:
        print("Error: No message body provided")
        sys.exit(1)

    success = send_email(to_email, subject, body, html_body)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
