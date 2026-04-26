#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════╗
# ║     SELF-HOSTED n8n - ONE-COMMAND DEPLOY                          ║
# ║  This deploys n8n on any Ubuntu server with Docker                ║
# ║  Usage: ./deploy-self-hosted.sh YOUR_SERVER_IP [DOMAIN]           ║
# ╚══════════════════════════════════════════════════════════════════╝

SERVER_IP=$1
DOMAIN=${2:-""}

if [ -z "$SERVER_IP" ]; then
    echo "❌ Usage: ./deploy-self-hosted.sh YOUR_SERVER_IP [DOMAIN]"
    echo "   Example: ./deploy-self-hosted.sh 192.168.1.100"
    echo "   Example: ./deploy-self-hosted.sh 192.168.1.100 n8n.yourdomain.com"
    exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           🚀 SELF-HOSTED n8n DEPLOYMENT                           ║"
echo "╠══════════════════════════════════════════════════════════════════╣"
echo "║  Server: $SERVER_IP"
echo "║  Domain: ${DOMAIN:-'(none - using IP)'}}"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check SSH connection
echo "📡 Testing SSH connection..."
if ! ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@$SERVER_IP "echo 'SSH OK'" > /dev/null 2>&1; then
    echo "❌ Cannot connect to $SERVER_IP via SSH"
    echo "   Make sure:"
    echo "   - Server is running"
    echo "   - SSH is enabled"
    echo "   - You have root access (or edit script for sudo user)"
    exit 1
fi
echo "   ✅ SSH connection verified"

# Deploy script to run on server
DEPLOY_SCRIPT=$(cat << 'REMOTESCRIPT'
#!/bin/bash
set -e

echo ""
echo "🔧 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "   ✅ Docker installed"
else
    echo "   ✅ Docker already installed"
fi

echo ""
echo "🔧 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "   ✅ Docker Compose installed"
else
    echo "   ✅ Docker Compose already installed"
fi

echo ""
echo "📁 Setting up n8n directory..."
mkdir -p /opt/n8n
cd /opt/n8n

echo ""
echo "📝 Creating Docker Compose file..."
cat > docker-compose.yml << 'COMPOSE'
version: "3.8"

services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=mj
      - N8N_BASIC_AUTH_PASSWORD=GhostArmy2024!
      - N8N_HOST=${DOMAIN:-$SERVER_IP}
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://${DOMAIN:-$SERVER_IP}:5678/
      - GENERIC_TIMEZONE=America/Edmonton
      - TZ=America/Edmonton
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - n8n_network

volumes:
  n8n_data:

networks:
  n8n_network:
    driver: bridge
COMPOSE

echo ""
echo "🚀 Starting n8n..."
docker-compose up -d

echo ""
echo "⏳ Waiting for n8n to start..."
sleep 10

# Check if running
if docker ps | grep -q n8n; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                 ✅ n8n IS LIVE!                                   ║"
    echo "╠══════════════════════════════════════════════════════════════════╣"
    echo "║  🌐 URL: http://${SERVER_IP}:5678"
    echo "║  👤 User: mj"
    echo "║  🔑 Password: GhostArmy2024!"
    echo "║  📁 Data: /opt/n8n/"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "NEXT STEPS:"
    echo "1. Open http://${SERVER_IP}:5678 in your browser"
    echo "2. Login with: mj / GhostArmy2024!"
    echo "3. Import your workflows from the backup"
    echo "4. Recreate credentials (Twilio, OpenAI, etc.)"
    echo "5. Update webhook URLs in Vapi.ai and Twilio"
    echo ""
    echo "To stop: docker-compose down"
    echo "To restart: docker-compose restart"
    echo "To view logs: docker-compose logs -f"
else
    echo "❌ n8n failed to start. Check logs: docker-compose logs"
fi
REMOTESCRIPT
)

# Copy and execute deploy script
echo "📤 Uploading deployment script..."
echo "$DEPLOY_SCRIPT" | ssh -o StrictHostKeyChecking=no root@$SERVER_IP "cat > /tmp/deploy-n8n.sh && chmod +x /tmp/deploy-n8n.sh && /tmp/deploy-n8n.sh"

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "   Access your n8n at: http://$SERVER_IP:5678"
