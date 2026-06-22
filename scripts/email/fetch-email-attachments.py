#!/usr/bin/env python3
"""
Fetch email attachments from Gmail
Usage: python3 fetch-email-attachments.py [--subject "KEYWORD"] [--output /path/to/dir]

Looks for unread emails with attachments and downloads them.
Default subject filter: "SERVER:"
"""

import imaplib
import email
import os
import argparse
from email.header import decode_header
from datetime import datetime

# Gmail IMAP settings
IMAP_SERVER = "imap.gmail.com"
IMAP_PORT = 993
EMAIL = "isayahy@gmail.com"
APP_PASSWORD = "wdzvscnewdsabhgd"

def connect():
    """Connect to Gmail IMAP"""
    mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
    mail.login(EMAIL, APP_PASSWORD)
    return mail

def fetch_attachments(subject_filter="SERVER:", output_dir="/tmp/email-attachments", mark_read=True):
    """Fetch attachments from emails matching subject filter"""

    os.makedirs(output_dir, exist_ok=True)

    mail = connect()
    mail.select("INBOX")

    # Search for unread emails with subject filter
    search_query = f'(UNSEEN SUBJECT "{subject_filter}")'
    status, messages = mail.search(None, search_query)

    if status != "OK":
        print("No messages found")
        return []

    email_ids = messages[0].split()
    downloaded = []

    print(f"Found {len(email_ids)} matching emails")

    for email_id in email_ids:
        status, msg_data = mail.fetch(email_id, "(RFC822)")

        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])
                subject = decode_header(msg["Subject"])[0][0]
                if isinstance(subject, bytes):
                    subject = subject.decode()

                print(f"\nProcessing: {subject}")

                for part in msg.walk():
                    if part.get_content_maintype() == "multipart":
                        continue

                    filename = part.get_filename()
                    if filename:
                        # Decode filename if needed
                        if decode_header(filename)[0][1]:
                            filename = decode_header(filename)[0][0].decode(decode_header(filename)[0][1])

                        # Add timestamp to avoid overwrites
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        safe_filename = f"{timestamp}_{filename}"
                        filepath = os.path.join(output_dir, safe_filename)

                        # Save attachment
                        with open(filepath, "wb") as f:
                            f.write(part.get_payload(decode=True))

                        print(f"  Downloaded: {safe_filename}")
                        downloaded.append(filepath)

        # Mark as read
        if mark_read:
            mail.store(email_id, "+FLAGS", "\\Seen")

    mail.logout()

    print(f"\n{len(downloaded)} attachments saved to {output_dir}")
    return downloaded

def main():
    parser = argparse.ArgumentParser(description="Fetch email attachments from Gmail")
    parser.add_argument("--subject", default="SERVER:", help="Subject filter (default: SERVER:)")
    parser.add_argument("--output", default="/tmp/email-attachments", help="Output directory")
    parser.add_argument("--keep-unread", action="store_true", help="Don't mark emails as read")

    args = parser.parse_args()

    fetch_attachments(
        subject_filter=args.subject,
        output_dir=args.output,
        mark_read=not args.keep_unread
    )

if __name__ == "__main__":
    main()
