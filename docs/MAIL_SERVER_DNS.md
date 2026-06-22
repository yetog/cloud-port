# Mail Server DNS Records for zaylegend.com

Add these records in your IONOS DNS settings.

## 1. MX Record (Mail Exchange)
| Field | Value |
|-------|-------|
| Type | MX |
| Host | @ |
| Points to | mail.zaylegend.com |
| Priority | 10 |

## 2. A Record (Mail Server)
| Field | Value |
|-------|-------|
| Type | A |
| Host | mail |
| Points to | 66.179.240.58 |

## 3. SPF Record (Sender Policy)
| Field | Value |
|-------|-------|
| Type | TXT |
| Host | @ |
| Value | `v=spf1 ip4:66.179.240.58 a mx ~all` |

## 4. DKIM Record (Email Signing)
| Field | Value |
|-------|-------|
| Type | TXT |
| Host | mail._domainkey |
| Value | See below |

**DKIM Value (one line, no quotes):**
```
v=DKIM1; h=sha256; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqpECBkoN3r344Qv+U8MzYg2zRDZoNaWHS24BebO9XdH/rFUxsBJq42JNWMGwXLDyuQiiG4VwPQx0bP4cfdIWiPo7Wq/4JtkrOEKv3UtMb6G608DnAzXJ4QelexAesuU6eYgBQscxZ+kpix6UXNyT8mXUUcM6j0f5M2J5IcqIBmwZr1BsXETloW2z/+0uj1l5yZkH4wscbNYR2480sqqF5Jmp7dIROly2uANp3merl7h9hsl6h6KhA1TFuWFxi/J64ssTqZSYymKTvO7FD2zurt8nJvrq5Dg/QXkMnILSOLff+pQLZ8CFZaUkzLSf5VGDJl5DNsvijG+rxA2YZ6wqdQIDAQAB
```

## 5. DMARC Record (Policy)
| Field | Value |
|-------|-------|
| Type | TXT |
| Host | _dmarc |
| Value | `v=DMARC1; p=quarantine; rua=mailto:admin@zaylegend.com` |

---

## Mail Accounts

| Account | Password |
|---------|----------|
| noreply@zaylegend.com | Dc2AgTO/C/OfUJBT |
| support@zaylegend.com | dvymzELe4cZkrgrC |

## Mail Client Settings

**Incoming (IMAP):**
- Server: mail.zaylegend.com
- Port: 993 (SSL) or 143 (STARTTLS)
- Username: noreply or support

**Outgoing (SMTP):**
- Server: mail.zaylegend.com
- Port: 587 (STARTTLS) or 465 (SSL)
- Username: noreply or support

---

## Verification

After adding DNS records, verify with:
```bash
# Check MX record
dig MX zaylegend.com

# Check SPF
dig TXT zaylegend.com

# Check DKIM
dig TXT mail._domainkey.zaylegend.com

# Check DMARC
dig TXT _dmarc.zaylegend.com
```
