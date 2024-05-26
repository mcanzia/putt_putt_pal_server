#!/bin/bash

# File to store Cloudflare IP addresses
OUTPUT_FILE="./cloudflare-ips.conf"

# URLs to fetch Cloudflare IPs
CF_IPV4_URL="https://www.cloudflare.com/ips-v4"
CF_IPV6_URL="https://www.cloudflare.com/ips-v6"

# Fetch Cloudflare IP ranges and format them for Nginx
{
    echo "# Cloudflare IP Ranges (IPv4)"
    curl -s $CF_IPV4_URL | sed 's/^/allow /' | sed 's/$/;/'

    echo "# Cloudflare IP Ranges (IPv6)"
    curl -s $CF_IPV6_URL | sed 's/^/allow /' | sed 's/$/;/'
} > $OUTPUT_FILE
