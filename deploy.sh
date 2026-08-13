#!/bin/bash

# ============================================================
# ComplaintDesk - Hostinger Deployment Script
# Run this on your Hostinger server via SSH:
#   ssh -p 65002 u120985039@145.79.25.57
#   bash deploy.sh
# ============================================================

set -e  # Exit on any error

echo ""
echo "========================================"
echo "  ComplaintDesk - Hostinger Deploy"
echo "========================================"
echo ""

# ---- CONFIG ------------------------------------------------
DOMAIN="anuj.jaidevs.in"
APP_PORT=3001   # Internal port for Node.js backend
PROJECT_DIR=""  # Will auto-detect below
# ------------------------------------------------------------

# 1. Auto-detect project directory
echo "📁 Finding project directory..."
if [ -d "$HOME/complaint_MS" ]; then
  PROJECT_DIR="$HOME/complaint_MS"
elif [ -d "$HOME/public_html/complaint_MS" ]; then
  PROJECT_DIR="$HOME/public_html/complaint_MS"
elif [ -d "$HOME/domains/$DOMAIN/complaint_MS" ]; then
  PROJECT_DIR="$HOME/domains/$DOMAIN/complaint_MS"
elif [ -d "$HOME/domains/$DOMAIN/public_html/complaint_MS" ]; then
  PROJECT_DIR="$HOME/domains/$DOMAIN/public_html/complaint_MS"
else
  echo "❌ Cannot find complaint_MS folder. Please enter full path:"
  read -r PROJECT_DIR
fi

echo "✅ Project at: $PROJECT_DIR"
cd "$PROJECT_DIR"

# 2. Create .env in project root
echo ""
echo "📝 Creating .env file..."
cat > .env << 'EOF'
# MongoDB Atlas
MONGO_URI=mongodb+srv://jvgkp98_db_user:aeeqZ6sd9R2o3SEG@cluster0.8cglyyh.mongodb.net/complaint_ms

# JWT Secret
JWT_SECRET=complaint_portal_jwt_secret_key_hostinger_2024

# Server Port (internal — Nginx will proxy this)
PORT=3001

# Admin Account
ADMIN_EMAIL=admin@college.com
ADMIN_PASSWORD=admin123
EOF

echo "✅ .env created"

# 3. Install server dependencies
echo ""
echo "📦 Installing server dependencies..."
cd "$PROJECT_DIR/server"
npm install --omit=dev

# 4. Install client dependencies & build
if [ -d "$PROJECT_DIR/client" ]; then
  echo ""
  echo "🔨 Building React client..."
  cd "$PROJECT_DIR/client"
  npm install --omit=dev
  npm run build
  echo "✅ Client built"
  BUILD_DIR="$PROJECT_DIR/client/dist"
else
  echo "⚠️  No client folder found — skipping frontend build"
  BUILD_DIR=""
fi

# 5. Install PM2 globally if not present
echo ""
echo "⚙️  Checking PM2..."
if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2..."
  npm install -g pm2
fi
echo "✅ PM2 ready: $(pm2 --version)"

# 6. Seed admin account
echo ""
echo "🌱 Seeding admin account..."
cd "$PROJECT_DIR/server"
node seed/createAdmin.js && echo "✅ Admin seeded" || echo "⚠️  Seed skipped (may already exist)"

# 7. Stop existing PM2 process if running
echo ""
echo "🔄 (Re)starting backend with PM2..."
pm2 delete complaintdesk 2>/dev/null || true

# 8. Start backend with PM2
cd "$PROJECT_DIR/server"
pm2 start server.js \
  --name complaintdesk \
  --env production \
  --log "$HOME/logs/complaintdesk.log" \
  --error "$HOME/logs/complaintdesk-error.log" \
  --time

pm2 save
echo "✅ Backend started on port $APP_PORT"

# 9. Create Nginx config for anuj.jaidevs.in
echo ""
echo "🌐 Checking Nginx config..."

NGINX_CONF_PATH=""
for path in /etc/nginx/conf.d /etc/nginx/sites-available /usr/local/nginx/conf/vhosts; do
  if [ -d "$path" ]; then
    NGINX_CONF_PATH="$path"
    break
  fi
done

if [ -n "$NGINX_CONF_PATH" ]; then
  echo "Writing Nginx config to $NGINX_CONF_PATH/$DOMAIN.conf..."
  cat > "$NGINX_CONF_PATH/$DOMAIN.conf" << NGINX_EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Serve React frontend
    root $BUILD_DIR;
    index index.html;

    # API reverse proxy to Node.js
    location /api/ {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_cache_bypass \$http_upgrade;
    }

    # Uploaded files
    location /uploads/ {
        proxy_pass http://127.0.0.1:$APP_PORT;
    }

    # React SPA fallback
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
NGINX_EOF

  # Symlink if sites-available/sites-enabled pattern
  if [ -d "/etc/nginx/sites-enabled" ] && [ ! -f "/etc/nginx/sites-enabled/$DOMAIN.conf" ]; then
    ln -s "$NGINX_CONF_PATH/$DOMAIN.conf" "/etc/nginx/sites-enabled/$DOMAIN.conf"
  fi

  # Test & reload nginx
  nginx -t 2>&1 && nginx -s reload && echo "✅ Nginx reloaded for $DOMAIN"
else
  echo ""
  echo "⚠️  Could not find Nginx config dir automatically."
  echo "   Your Nginx vhost config should proxy port $APP_PORT"
  echo "   Here's what to add manually:"
  echo ""
  echo "   location /api/ {"
  echo "     proxy_pass http://127.0.0.1:$APP_PORT;"
  echo "   }"
  echo "   location / { try_files \$uri /index.html; }"
fi

# 10. Done
echo ""
echo "========================================"
echo "  ✅ DEPLOYMENT COMPLETE!"
echo "========================================"
echo ""
echo "  🌍 Live URL : http://$DOMAIN"
echo "  🔧 Backend  : http://127.0.0.1:$APP_PORT"
echo "  👤 Admin    : admin@college.com / admin123"
echo ""
echo "  PM2 commands:"
echo "    pm2 logs complaintdesk    # View logs"
echo "    pm2 restart complaintdesk # Restart"
echo "    pm2 status                # App status"
echo ""
