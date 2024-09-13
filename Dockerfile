FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    gcc \
    git \
    pkg-config \
    libudev-dev \
    libssl-dev \
    python3 \
    python3-pip \
    sudo \
    cmake \
    wget \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your extension files
COPY . .

# Compile TypeScript
RUN npm run compile

# Set the entrypoint to bash
ENTRYPOINT ["/bin/bash"]

# Command to run tests
CMD ["npm", "run", "test"]