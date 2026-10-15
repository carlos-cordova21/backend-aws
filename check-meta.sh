#!/bin/bash
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 60" 2>/dev/null)
MAC=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/mac 2>/dev/null)
SUBNET=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/network/interfaces/macs/$MAC/subnet-id 2>/dev/null)
VPC=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/network/interfaces/macs/$MAC/vpc-id 2>/dev/null)
SG=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/network/interfaces/macs/$MAC/security-group-ids 2>/dev/null)
echo "VPC: $VPC"
echo "SUBNET: $SUBNET"
echo "SG: $SG"
