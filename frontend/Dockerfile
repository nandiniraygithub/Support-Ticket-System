# Build stage
FROM node:20-slim AS build

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Add custom nginx config to handle SPA routing if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
