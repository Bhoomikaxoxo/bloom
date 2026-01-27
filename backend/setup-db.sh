#!/bin/bash

echo "🚀 Setting up Slate backend..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and configure your DATABASE_URL"
    exit 1
fi

echo "✓ .env file found"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✓ Dependencies installed"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Prisma generate failed"
    exit 1
fi

echo "✓ Prisma Client generated"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
echo "   This will create all tables in your database"
echo ""

npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Migration failed!"
    echo ""
    echo "💡 Make sure your database server is running:"
    echo "   - For Prisma local database: run 'npx prisma dev' in a separate terminal"
    echo "   - For Neon/Supabase: ensure your DATABASE_URL in .env is correct"
    echo ""
    exit 1
fi

echo ""
echo "✅ Database setup complete!"
echo ""
echo "You can now run: npm run dev"
