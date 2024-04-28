# Use latest version of Node.js
FROM node:latest

# Set working directory
WORKDIR /var/medusa

# Copy project files into the container
COPY . .

# Install system dependencies
RUN apt-get update && apt-get install -y python3 python3-pip python-is-python3

# Install Medusa CLI globally
RUN yarn global add @medusajs/medusa-cli

# Install project dependencies using yarn
RUN yarn

# Build the project
RUN yarn build

RUN npx medusa user -e some@email.com -p some-password

# Define the entrypoint command
CMD medusa migrations run && yarn start
