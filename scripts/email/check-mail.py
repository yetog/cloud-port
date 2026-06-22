#!/usr/bin/env python3
"""
Shadow Mail Checker
Polls Gmail inbox for new messages and processes them.

Usage:
  ./check-mail.py           # Check for new mail once
  ./check-mail.py --watch   # Continuous polling (every 60s)
  ./check-mail.py --list    # List recent unread emails
"""

import imaplib
import email
from email.header import decode_header
import subprocess
import time
import sys
import os
from datetime import datetime

# Gmail credentials (same as msmtp)
IMAP_SERVER = "imap.gmail.com"
IMAP_PORT = 993
EMAIL = "isayahy@gmail.com"
PASSWORD = "wdzvscnewdsabhgd"

# Where to log received messages
LOG_FILE = os.path.expanduser("~/mail-inbox.log")

def log(msg):
    """Log with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def decode_subject(subject):
    """Decode email subject"""
    if subject is None:
        return "(No Subject)"
    decoded = decode_header(subject)
    result = ""
    for part, encoding in decoded:
        if isinstance(part, bytes):
            result += part.decode(encoding or "utf-8", errors="replace")
        else:
            result += part
    return result

def get_body(msg):
    """Extract plain text body from email"""
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            if content_type == "text/plain":
                try:
                    return part.get_payload(decode=True).decode("utf-8", errors="replace")
                except:
                    return part.get_payload()
    else:
        try:
            return msg.get_payload(decode=True).decode("utf-8", errors="replace")
        except:
            return msg.get_payload()
    return ""

def send_reply(to_email, subject, body):
    """Send a reply using msmtp"""
    reply_subject = f"Re: {subject}" if not subject.startswith("Re:") else subject
    message = f"""From: Shadow <{EMAIL}>
To: {to_email}
Subject: {reply_subject}

{body}

- Shadow
"""
    try:
        process = subprocess.Popen(
            ["msmtp", to_email],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate(input=message.encode())
        if process.returncode == 0:
            log(f"Reply sent to {to_email}")
            return True
        else:
            log(f"Failed to send reply: {stderr.decode()}")
            return False
    except Exception as e:
        log(f"Error sending reply: {e}")
        return False

def process_email(msg, msg_id):
    """Process a single email - customize this!"""
    from_addr = msg.get("From", "Unknown")
    subject = decode_subject(msg.get("Subject"))
    body = get_body(msg).strip()

    log(f"New mail from: {from_addr}")
    log(f"Subject: {subject}")
    log(f"Body preview: {body[:200]}...")

    # === CUSTOMIZE YOUR RESPONSES HERE ===

    # Example: Auto-acknowledge receipt
    # Uncomment to enable:
    # send_reply(from_addr, subject, "Got your message. I'll check this out.\n")

    # Example: Run a command if email contains keyword
    # if "status" in body.lower():
    #     result = subprocess.getoutput("brain status")
    #     send_reply(from_addr, subject, f"Server Status:\n\n{result}")

    # Example: Log to a specific file for review
    with open(os.path.expanduser("~/inbox-messages.txt"), "a") as f:
        f.write(f"\n{'='*50}\n")
        f.write(f"From: {from_addr}\n")
        f.write(f"Subject: {subject}\n")
        f.write(f"Date: {msg.get('Date', 'Unknown')}\n")
        f.write(f"Body:\n{body}\n")

    return True

def check_mail(mark_read=True, since_days=1):
    """Check for recent unread emails"""
    from datetime import timedelta

    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        mail.login(EMAIL, PASSWORD)
        mail.select("INBOX")

        # Only check emails from last N days
        since_date = (datetime.now() - timedelta(days=since_days)).strftime("%d-%b-%Y")
        status, messages = mail.search(None, f'(UNSEEN SINCE "{since_date}")')

        if status != "OK":
            log("Failed to search inbox")
            return 0

        msg_ids = messages[0].split()
        count = len(msg_ids)

        if count == 0:
            log("No new messages")
            return 0

        log(f"Found {count} new message(s)")

        for msg_id in msg_ids:
            status, msg_data = mail.fetch(msg_id, "(RFC822)")
            if status != "OK":
                continue

            raw_email = msg_data[0][1]
            msg = email.message_from_bytes(raw_email)

            process_email(msg, msg_id)

            # Mark as read (move to seen)
            if mark_read:
                mail.store(msg_id, "+FLAGS", "\\Seen")

        mail.logout()
        return count

    except Exception as e:
        log(f"Error checking mail: {e}")
        return -1

def list_unread():
    """List unread emails without marking them read"""
    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        mail.login(EMAIL, PASSWORD)
        mail.select("INBOX")

        status, messages = mail.search(None, "UNSEEN")
        msg_ids = messages[0].split()

        print(f"\n{'='*60}")
        print(f"Unread messages: {len(msg_ids)}")
        print(f"{'='*60}\n")

        for msg_id in msg_ids:
            status, msg_data = mail.fetch(msg_id, "(RFC822)")
            if status != "OK":
                continue

            raw_email = msg_data[0][1]
            msg = email.message_from_bytes(raw_email)

            from_addr = msg.get("From", "Unknown")
            subject = decode_subject(msg.get("Subject"))
            date = msg.get("Date", "Unknown")

            print(f"From: {from_addr}")
            print(f"Subject: {subject}")
            print(f"Date: {date}")
            print("-" * 40)

        mail.logout()

    except Exception as e:
        print(f"Error: {e}")

def watch_mode(interval=60):
    """Continuously poll for new mail"""
    log(f"Shadow Mail Watcher started (checking every {interval}s)")
    log("Press Ctrl+C to stop")

    while True:
        check_mail()
        time.sleep(interval)

if __name__ == "__main__":
    if "--watch" in sys.argv:
        try:
            watch_mode()
        except KeyboardInterrupt:
            print("\nStopped watching.")
    elif "--list" in sys.argv:
        list_unread()
    else:
        check_mail()
