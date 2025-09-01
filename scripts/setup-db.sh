#!/bin/bash

# Local Database Setup Script
# Supports multiple installation methods: Docker, Homebrew, or existing PostgreSQL

set -e

DB_NAME="my_app_dev"
DB_USER="my_app_user"
DB_PASSWORD="dev_password"
DB_HOST="localhost"
DB_PORT="5432"

echo "🚀 Setting up local PostgreSQL database..."
echo ""
echo "📋 Choose your setup method:"
echo "1. Docker (Recommended - includes pgvector)"
echo "2. Homebrew (macOS)"
echo "3. Use existing PostgreSQL installation"
echo "4. Manual setup instructions"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🐳 Setting up with Docker..."
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker is not installed"
            echo "💡 Please install Docker Desktop: https://www.docker.com/products/docker-desktop"
            exit 1
        fi
        
        # Check if docker-compose is available
        if command -v docker-compose &> /dev/null; then
            COMPOSE_CMD="docker-compose"
        elif docker compose version &> /dev/null; then
            COMPOSE_CMD="docker compose"
        else
            echo "❌ Docker Compose is not available"
            exit 1
        fi
        
        echo "🔄 Starting PostgreSQL with Docker..."
        $COMPOSE_CMD up -d postgres
        
        echo "⏳ Waiting for database to be ready..."
        timeout=60
        while ! docker exec $(docker ps -q -f name=postgres) pg_isready -U $DB_USER -d $DB_NAME &> /dev/null && [ $timeout -gt 0 ]; do
            sleep 2
            timeout=$((timeout - 2))
        done
        
        if [ $timeout -le 0 ]; then
            echo "❌ Database failed to start within 60 seconds"
            exit 1
        fi
        
        POSTGRES_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
        ;;
        
    2)
        echo "🍺 Setting up with Homebrew..."
        
        # Check if Homebrew is installed
        if ! command -v brew &> /dev/null; then
            echo "❌ Homebrew is not installed"
            echo "💡 Install Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
        
        # Install PostgreSQL if not installed
        if ! command -v psql &> /dev/null; then
            echo "📦 Installing PostgreSQL..."
            brew install postgresql@15
        fi
        
        # Install pgvector
        if ! brew list pgvector &> /dev/null; then
            echo "📦 Installing pgvector..."
            brew install pgvector
        fi
        
        # Start PostgreSQL service
        echo "🔄 Starting PostgreSQL service..."
        brew services start postgresql@15 || brew services start postgresql
        
        # Wait for PostgreSQL to be ready
        echo "⏳ Waiting for PostgreSQL to be ready..."
        timeout=30
        while ! pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null && [ $timeout -gt 0 ]; do
            sleep 1
            timeout=$((timeout - 1))
        done
        
        # Create database and user
        echo "📊 Setting up database and user..."
        createuser -s $DB_USER 2>/dev/null || echo "User might already exist"
        createdb -O $DB_USER $DB_NAME 2>/dev/null || echo "Database might already exist"
        
        # Enable pgvector
        psql -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS vector;" || echo "Extension might already exist"
        
        POSTGRES_URL="postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
        ;;
        
    3)
        echo "🔧 Using existing PostgreSQL installation..."
        
        read -p "PostgreSQL host ($DB_HOST): " input_host
        DB_HOST=${input_host:-$DB_HOST}
        
        read -p "PostgreSQL port ($DB_PORT): " input_port
        DB_PORT=${input_port:-$DB_PORT}
        
        read -p "Database user ($DB_USER): " input_user
        DB_USER=${input_user:-$DB_USER}
        
        read -s -p "Database password: " DB_PASSWORD
        echo ""
        
        read -p "Database name ($DB_NAME): " input_db
        DB_NAME=${input_db:-$DB_NAME}
        
        POSTGRES_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
        
        # Test connection
        echo "� Testing connection..."
        if ! psql "$POSTGRES_URL" -c "SELECT version();" > /dev/null 2>&1; then
            echo "❌ Connection failed. Please check your credentials."
            exit 1
        fi
        
        # Try to enable pgvector
        psql "$POSTGRES_URL" -c "CREATE EXTENSION IF NOT EXISTS vector;" 2>/dev/null || {
            echo "⚠️  Could not enable pgvector extension"
            echo "💡 You may need to install pgvector or run as superuser"
        }
        ;;
        
    4)
        echo "� Manual Setup Instructions:"
        echo ""
        echo "1. Install PostgreSQL 12+ with pgvector extension"
        echo "2. Create a database and user:"
        echo "   createuser -s $DB_USER"
        echo "   createdb -O $DB_USER $DB_NAME"
        echo "3. Enable pgvector extension:"
        echo "   psql -d $DB_NAME -c 'CREATE EXTENSION IF NOT EXISTS vector;'"
        echo "4. Update .env.local with your connection string:"
        echo "   POSTGRES_URL=\"postgresql://$DB_USER:password@$DB_HOST:$DB_PORT/$DB_NAME\""
        echo "5. Run migrations: npm run db:migrate"
        echo "6. Seed data: npm run db:seed"
        exit 0
        ;;
esac

# Update .env.local file
echo "📝 Updating .env.local file..."

ENV_FILE=".env.local"

# Create or update .env.local
cat > $ENV_FILE << EOF
# Local development environment - Auto-generated by setup-db.sh
POSTGRES_URL="$POSTGRES_URL"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"

# Optional: Add your OpenAI API key for embeddings
# OPENAI_API_KEY="sk-..."
EOF

echo "✅ Environment file updated: $ENV_FILE"

# Test the connection
echo "🔍 Testing database connection..."
if psql "$POSTGRES_URL" -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed"
    echo "💡 Connection string: $POSTGRES_URL"
    exit 1
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "📋 Database Details:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Connection: $POSTGRES_URL"
echo ""
echo "🔧 Next steps:"
echo "   1. Run migrations: npm run db:migrate"
echo "   2. Seed with sample data: npm run db:seed"
echo "   3. Start development: npm run dev"
echo ""
echo "💡 To connect manually: psql \"$POSTGRES_URL\""

# If using Docker, show additional commands
if [ "$choice" = "1" ]; then
    echo ""
    echo "🐳 Docker commands:"
    echo "   Stop database: docker-compose down"
    echo "   View logs: docker-compose logs postgres"
    echo "   Connect to DB: docker-compose exec postgres psql -U $DB_USER -d $DB_NAME"
fi
