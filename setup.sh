#!/bin/bash

# ============================================================
# ComplaintDesk - Quick Server Start (code already on server)
# 
# Run on Hostinger via SSH:
#   ssh -p 65002 u120985039@145.79.25.57
#   (password: Asus@8756)
#
#   Then run:
#   bash setup.sh
# ============================================================

echo "🚀 ComplaintDesk Quick Setup..."

# --- Find project directory ---
SERVER_DIR=""
for d in \
  "$HOME/complaint_MS/server" \
  "$HOME/public_html/complaint_MS/server" \
  "$HOME/domains/anuj.jaidevs.in/complaint_MS/server" \
  "$HOME/domains/anuj.jaidevs.in/public_html/complaint_MS/server" \
  "$HOME/domains/anuj.jaidevs.in/public_html/server"; do
  if [ -f "$d/server.js" ]; then
    SERVER_DIR="$d"
    break
  fi
done

if [ -z "$SERVER_DIR" ]; then
  echo "❌ Could not find server.js automatically."
  echo "Enter the full path to the 'server' folder:"
  read -r SERVER_DIR
fi

echo "📁 Server dir: $SERVER_DIR"

# --- Create .env in project root (one level above server/) ---
ROOT_DIR=$(dirname "$SERVER_DIR")
echo "📝 Writing .env to: $ROOT_DIR/.env"

cat > "$ROOT_DIR/.env" << 'ENVEOF'
MONGO_URI=mongodb+srv://jvgkp98_db_user:aeeqZ6sd9R2o3SEG@cluster0.8cglyyh.mongodb.net/complaint_ms
JWT_SECRET=complaint_portal_jwt_secret_key_hostinger_2024
PORT=3001
ADMIN_EMAIL=admin@college.com
ADMIN_PASSWORD=admin123
ENVEOF

echo "✅ .env created"

# --- Install dependencies ---
echo "📦 Installing server dependencies..."
cd "$SERVER_DIR"
npm install

# --- Seed admin ---
echo "🌱 Seeding admin account..."
node seed/createAdmin.js && echo "✅ Admin ready" || echo "⚠️  Already exists"

# --- Start with PM2 ---
echo "⚙️  Starting with PM2..."
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi

pm2 delete complaintdesk 2>/dev/null || true
pm2 start server.js --name complaintdesk --time
pm2 save

echo ""
echo "✅ Done! Backend running on port 3001"
echo ""
echo "PM2 status:"
pm2 list
