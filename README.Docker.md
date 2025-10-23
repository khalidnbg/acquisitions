# Acquisitions App - Docker Setup Guide

This guide explains how to run the Acquisitions application using Docker for both development and production environments.

## 🏗️ Architecture Overview

### Development Environment

- **Neon Local**: PostgreSQL database running in Docker container
- **Application**: Express.js app connecting to local PostgreSQL
- **Hot Reload**: Source code mounted for development

### Production Environment

- **Neon Cloud**: Serverless PostgreSQL database on neon.tech
- **Application**: Optimized Docker container
- **Security**: Environment-based secrets management

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## 🚀 Quick Start

### Development Setup

1. **Clone and navigate to the project:**

   ```bash
   git clone <repository-url>
   cd acquisitions
   ```

2. **Start development environment:**

   ```bash
   npm run docker:dev
   ```

   This command:
   - Builds the application Docker image
   - Starts PostgreSQL database (Neon Local simulation)
   - Initializes database with test data
   - Starts the app with hot reload enabled

3. **Access the application:**
   - API: http://localhost:3000
   - Health Check: http://localhost:3000/health
   - Database: localhost:5432

4. **Test the setup:**

   ```bash
   # Check if services are running
   docker-compose -f docker-compose.dev.yml ps

   # View application logs
   npm run docker:dev:logs
   ```

### Production Setup

1. **Create production environment file:**

   ```bash
   cp .env.production.example .env.production
   ```

2. **Configure production variables:**
   Edit `.env.production` with your actual values:

   ```env
   DATABASE_URL=postgres://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   JWT_SECRET=your-super-secure-jwt-secret
   ARCJET_KEY=your-arcjet-key
   ```

3. **Deploy production:**
   ```bash
   npm run docker:prod
   ```

## 🔧 Environment Configuration

### Development (.env.development)

```env
NODE_ENV=development
DATABASE_URL=postgres://neondb_owner:neondb_password@neon-local:5432/neondb
JWT_SECRET=dev-jwt-secret-key-change-in-production
LOG_LEVEL=debug
```

### Production (.env.production)

```env
NODE_ENV=production
DATABASE_URL=postgres://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
JWT_SECRET=your-production-jwt-secret
LOG_LEVEL=info
BCRYPT_ROUNDS=12
```

## 📂 Project Structure

```
acquisitions/
├── Dockerfile                    # Multi-stage build configuration
├── .dockerignore                # Files to exclude from build context
├── docker-compose.dev.yml       # Development environment
├── docker-compose.prod.yml      # Production environment
├── init-db.sql                  # Development database initialization
├── .env.development             # Development environment variables
├── .env.production.example      # Production environment template
└── src/                         # Application source code
```

## 🐳 Docker Commands Reference

### Development Commands

```bash
# Start development environment
npm run docker:dev

# Stop development environment
npm run docker:dev:down

# View application logs
npm run docker:dev:logs

# Access database shell
docker exec -it acquisitions-neon-local psql -U neondb_owner -d neondb
```

### Production Commands

```bash
# Deploy production (detached)
npm run docker:prod

# Stop production
npm run docker:prod:down

# View production logs
npm run docker:prod:logs

# Build image only
npm run docker:build
```

### Maintenance Commands

```bash
# Clean up Docker resources
npm run docker:clean

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache

# View container status
docker-compose -f docker-compose.dev.yml ps
```

## 🗄️ Database Management

### Development Database

The development environment automatically creates:

- PostgreSQL database with test data
- Two test users:
  - `test@example.com` / `password123` (admin)
  - `john@example.com` / `password123` (user)

### Database Migrations

Run migrations in the container:

```bash
# Development
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Production
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### Database Access

```bash
# Development - Connect to local PostgreSQL
docker exec -it acquisitions-neon-local psql -U neondb_owner -d neondb

# View database tables
\dt

# View users table
SELECT * FROM users;
```

## 🔐 Security Considerations

### Development

- Uses weak passwords for convenience
- Debug logging enabled
- Database exposed on localhost:5432

### Production

- Environment variables for secrets
- Production logging level
- No database port exposure
- Resource limits applied
- Health checks configured

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts:**

   ```bash
   # Check if ports 3000 or 5432 are in use
   netstat -an | findstr :3000
   netstat -an | findstr :5432
   ```

2. **Database connection issues:**

   ```bash
   # Check database health
   docker-compose -f docker-compose.dev.yml exec neon-local pg_isready

   # View database logs
   docker-compose -f docker-compose.dev.yml logs neon-local
   ```

3. **Application not starting:**

   ```bash
   # Check application logs
   npm run docker:dev:logs

   # Check if all services are healthy
   docker-compose -f docker-compose.dev.yml ps
   ```

4. **Permission issues (Windows):**
   ```bash
   # Ensure Docker Desktop is running as Administrator
   # Check volume mounts in docker-compose files
   ```

### Logs Location

Development logs are mounted to `./logs/` directory:

- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

## 🌐 API Endpoints

Once running, test these endpoints:

```bash
# Health check
curl http://localhost:3000/health

# User registration
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"user@test.com","password":"password123"}'

# User login
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔄 CI/CD Integration

For production deployment, set these environment variables in your CI/CD system:

```env
DATABASE_URL=<neon-cloud-url>
JWT_SECRET=<secure-secret>
ARCJET_KEY=<arcjet-key>
NODE_ENV=production
```

Example GitHub Actions deployment:

```yaml
- name: Deploy to production
  run: |
    docker-compose -f docker-compose.prod.yml up -d --build
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

## 📞 Support

- Check application health: `http://localhost:3000/health`
- View container logs: `npm run docker:dev:logs`
- Database shell access: `docker exec -it acquisitions-neon-local psql -U neondb_owner -d neondb`

## 🔗 Additional Resources

- [Neon Database Documentation](https://neon.tech/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Express.js Documentation](https://expressjs.com/)
