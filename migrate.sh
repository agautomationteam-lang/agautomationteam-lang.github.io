#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════╗
# ║           MJ'S COMPLETE MIGRATION BACKUP SCRIPT                   ║
# ║  One command to backup EVERYTHING for migration                  ║
# ║  Usage: ./migrate.sh [self-hosted|make|lindy]                    ║
# ╚══════════════════════════════════════════════════════════════════╝

set -e

DESTINATION=${1:-"self-hosted"}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="migration_backup_$TIMESTAMP"

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                    🔥 MIGRATION INITIATED 🔥                      ║"
echo "╠══════════════════════════════════════════════════════════════════╣"
echo "║  Destination: $DESTINATION"
echo "║  Timestamp: $TIMESTAMP"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# ─── STEP 1: CREATE BACKUP STRUCTURE ──────────────────────────────
echo "📦 STEP 1: Creating full backup..."
mkdir -p $BACKUP_DIR/{workflows,voice-agents,leads,dashboards,scripts,docs,credentials}

# ─── STEP 2: COPY WORKFLOWS ───────────────────────────────────────
echo "   📋 Copying n8n workflows..."
cp n8n-*.json $BACKUP_DIR/workflows/ 2>/dev/null || true
cp ag-automation-deploy/n8n-workflows/*.json $BACKUP_DIR/workflows/ 2>/dev/null || true
echo "      ✅ $(ls $BACKUP_DIR/workflows/*.json 2>/dev/null | wc -l) workflow files"

# ─── STEP 3: COPY VOICE AGENTS ────────────────────────────────────
echo "   🤖 Copying voice agent configs..."
cp -r voice-army/* $BACKUP_DIR/voice-agents/ 2>/dev/null || true
cp SARAH_*.md voice-agent-config.md $BACKUP_DIR/voice-agents/ 2>/dev/null || true
echo "      ✅ Voice army configs copied"

# ─── STEP 4: COPY LEADS ───────────────────────────────────────────
echo "   📊 Copying lead databases..."
cp -r leads/* $BACKUP_DIR/leads/ 2>/dev/null || true
echo "      ✅ $(ls $BACKUP_DIR/leads/*.json 2>/dev/null | wc -l) lead files"

# ─── STEP 5: COPY DASHBOARDS ──────────────────────────────────────
echo "   🖥️  Copying dashboards..."
cp jarvis-dashboard.html index.html $BACKUP_DIR/dashboards/ 2>/dev/null || true
cp -r jarvis-app $BACKUP_DIR/dashboards/ 2>/dev/null || true
cp -r demo-pages $BACKUP_DIR/dashboards/ 2>/dev/null || true
echo "      ✅ Dashboards copied"

# ─── STEP 6: COPY SCRIPTS ─────────────────────────────────────────
echo "   🛠️  Copying deployment scripts..."
cp *.py *.sh $BACKUP_DIR/scripts/ 2>/dev/null || true
echo "      ✅ $(ls $BACKUP_DIR/scripts/*.{py,sh} 2>/dev/null | wc -l) scripts"

# ─── STEP 7: COPY DOCUMENTATION ───────────────────────────────────
echo "   📚 Copying documentation..."
cp *.md $BACKUP_DIR/docs/ 2>/dev/null || true
echo "      ✅ $(ls $BACKUP_DIR/docs/*.md 2>/dev/null | wc -l) docs"

# ─── STEP 8: CREATE CREDENTIALS TEMPLATE ──────────────────────────
echo "   🔐 Creating credentials template..."
cat > $BACKUP_DIR/credentials/CREDENTIALS_TEMPLATE.md << 'EOF'
# CREDENTIALS TEMPLATE
# Fill these in at your new destination

## n8n
- URL: 
- API Token: 
- Basic Auth User: 
- Basic Auth Password: 

## OpenAI
- API Key: 

## Twilio
- Account SID: 
- Auth Token: 
- Phone Number: 

## Vapi.ai
- Private Key: 
- Public Key: 

## ElevenLabs
- API Key: 

## SendGrid
- API Key: 

## Stripe
- Publishable Key: 
- Secret Key: 

## Calendly
- Link: 
EOF

# ─── STEP 9: CREATE INVENTORY ─────────────────────────────────────
echo "   📋 Creating inventory..."
cat > $BACKUP_DIR/INVENTORY.txt << EOF
MIGRATION BACKUP: $TIMESTAMP
=============================

WORKFLOWS:
$(ls $BACKUP_DIR/workflows/ 2>/dev/null)

VOICE AGENTS:
$(ls $BACKUP_DIR/voice-agents/ 2>/dev/null)

LEADS:
$(ls $BACKUP_DIR/leads/ 2>/dev/null)

DASHBOARDS:
$(ls $BACKUP_DIR/dashboards/ 2>/dev/null)

SCRIPTS:
$(ls $BACKUP_DIR/scripts/ 2>/dev/null)

DOCUMENTS:
$(ls $BACKUP_DIR/docs/ 2>/dev/null)

CREDENTIALS NEEDED:
- n8n Cloud API token (for export)
- OpenAI API key
- Twilio Account SID + Auth Token
- Vapi.ai API key
- ElevenLabs API key
- SendGrid API key
- Stripe keys
EOF

# ─── STEP 10: CREATE DESTINATION GUIDE ────────────────────────────
echo "   📖 Creating migration guide..."

case $DESTINATION in
  "self-hosted")
    cat > $BACKUP_DIR/MIGRATION_STEPS.md << 'EOF'
# 🚀 MIGRATE TO SELF-HOSTED n8n

## STEP 1: GET A VPS
- DigitalOcean: $6/month (1GB RAM) → upgrade to $12 for production
- Hetzner: €4.51/month (2GB RAM) — BEST VALUE
- Linode: $5/month
- Vultr: $5/month

## STEP 2: SSH INTO SERVER
```bash
ssh root@YOUR_SERVER_IP
```

## STEP 3: INSTALL DOCKER
```bash
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker
```

## STEP 4: CREATE DOCKER COMPOSE FILE
```bash
mkdir -p ~/n8n
cat > ~/n8n/docker-compose.yml << 'COMPOSE'
version: "3"
services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=mj
      - N8N_BASIC_AUTH_PASSWORD=YOUR_STRONG_PASSWORD
      - N8N_HOST=your-domain.com
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://your-domain.com/
      - GENERIC_TIMEZONE=America/Edmonton
    volumes:
      - ~/.n8n:/home/node/.n8n
COMPOSE
```

## STEP 5: START n8n
```bash
cd ~/n8n
docker-compose up -d
```

## STEP 6: ACCESS n8n
- Open: http://YOUR_SERVER_IP:5678
- Login: mj / YOUR_STRONG_PASSWORD

## STEP 7: IMPORT WORKFLOWS
1. Open n8n dashboard
2. Settings → Import/Export
3. Upload workflow JSON files from `workflows/` folder

## STEP 8: RECREATE CREDENTIALS
Security: credentials don't export, so recreate:
1. Twilio (Account SID + Auth Token)
2. OpenAI (API Key)
3. SendGrid (API Key)
4. Google Sheets (OAuth)

## STEP 9: UPDATE WEBHOOKS
In Vapi.ai dashboard:
- Update webhook URL to: http://YOUR_SERVER_IP:5678/webhook/vapi-call-ended

In Twilio:
- Update webhook URLs for SMS

## STEP 10: TEST
- Send test SMS
- Make test call
- Verify dashboard updates
- Check email delivery

## OPTIONAL: ADD DOMAIN + SSL
```bash
# Install Caddy (easiest SSL)
docker run -d -p 80:80 -p 443:443 \
  -v /site:/usr/share/caddy \
  -v caddy_data:/data \
  -v caddy_config:/config \
  caddy/caddy
```

## DONE! 🎉
Your n8n is now self-hosted and fully under your control.
EOF
    ;;

  "make")
    cat > $BACKUP_DIR/MIGRATION_STEPS.md << 'EOF'
# 🚀 MIGRATE TO MAKE.COM

## STEP 1: CREATE ACCOUNT
- Go to make.com
- Sign up (free tier: 1,000 ops/month)

## STEP 2: UNDERSTAND THE MAPPING
| n8n Node | Make Module |
|----------|-------------|
| Webhook | Webhook |
| Twilio | Twilio |
| OpenAI | OpenAI |
| Google Sheets | Google Sheets |
| HTTP Request | HTTP |
| Schedule Trigger | Scheduler |

## STEP 3: REBUILD WORKFLOWS
For each workflow in `workflows/`:
1. Create new scenario in Make
2. Add trigger module
3. Add action modules
4. Map data fields
5. Test

## STEP 4: IMPORT LEADS
- Export leads to CSV
- Import to Google Sheets or Airtable
- Connect to Make

## STEP 5: RECONNECT APIS
- Twilio: Add connection
- OpenAI: Add API key
- SendGrid: Add API key

## STEP 6: UPDATE WEBHOOKS
- Vapi.ai → Make webhook URL
- Twilio → Make webhook URL

## NOTE
Make.com has different pricing ($10-20/month).
Workflows must be manually rebuilt.
EOF
    ;;

  "lindy")
    cat > $BACKUP_DIR/MIGRATION_STEPS.md << 'EOF'
# 🚀 MIGRATE TO LINDY AI

## STEP 1: SIGN UP
- Go to lindy.ai
- Create account ($49.99/month)

## STEP 2: IMPORT LEADS
- Export leads to CSV
- Upload to Lindy

## STEP 3: BUILD AI AGENT
- Use voice agent configs from `voice-agents/`
- Configure Chloe personality
- Set up Twilio integration

## STEP 4: SET UP SEQUENCES
- SMS follow-ups
- Email sequences
- Call scheduling

## STEP 5: CONNECT APIS
- Twilio
- OpenAI
- SendGrid
- Calendly

## NOTE
Lindy is all-in-one but requires rebuilding everything.
Best if you want native AI agents without n8n complexity.
EOF
    ;;

  *)
    cat > $BACKUP_DIR/MIGRATION_STEPS.md << 'EOF'
# 🚀 MIGRATION GUIDE

Please choose a destination:
- self-hosted (n8n on your own server)
- make (make.com)
- lindy (lindy.ai)

Run: ./migrate.sh [destination]
EOF
    ;;
esac

# ─── STEP 11: CREATE ZIP ARCHIVE ──────────────────────────────────
echo ""
echo "📦 STEP 2: Creating archive..."
zip -r $BACKUP_DIR.zip $BACKUP_DIR/ > /dev/null 2>&1
FILE_COUNT=$(find $BACKUP_DIR -type f | wc -l)
ARCHIVE_SIZE=$(du -h $BACKUP_DIR.zip | cut -f1)

# ─── STEP 12: FINAL SUMMARY ───────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                 ✅ MIGRATION BACKUP COMPLETE                     ║"
echo "╠══════════════════════════════════════════════════════════════════╣"
echo "║  📁 Directory: $BACKUP_DIR/"
echo "║  📦 Archive: $BACKUP_DIR.zip ($ARCHIVE_SIZE)"
echo "║  📄 Files: $FILE_COUNT"
echo "║  📖 Guide: $BACKUP_DIR/MIGRATION_STEPS.md"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "NEXT STEPS:"
echo "1. Download: $BACKUP_DIR.zip"
echo "2. Read: $BACKUP_DIR/MIGRATION_STEPS.md"
echo "3. Follow steps for $DESTINATION"
echo "4. Update webhook URLs after migration"
echo ""
echo "QUICK COMMANDS:"
echo "  Self-hosted: ./migrate.sh self-hosted"
echo "  Make.com:    ./migrate.sh make"
echo "  Lindy AI:    ./migrate.sh lindy"
echo ""
