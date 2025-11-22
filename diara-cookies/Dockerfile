# Build stage for frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm ci
COPY ./frontend/ ./
RUN npm run build

# Production stage for backend
FROM node:18-alpine
WORKDIR /app

# Install production dependencies
COPY ./backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY ./backend/ ./

# Copy built frontend assets
COPY --from=frontend-build /app/dist ./dist

# Expose port
EXPOSE 3000

# Run the application
CMD ["node", "src/index.js"]