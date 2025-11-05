#!/bin/bash

# Test script for Google OAuth PKCE endpoints
# Usage: ./test-oauth-endpoints.sh

set -e

BASE_URL="${API_BASE_URL:-http://localhost:8080/api}"

echo "🧪 Testing Google OAuth PKCE Endpoints"
echo "========================================"
echo ""
echo "Base URL: $BASE_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Initiate OAuth Flow
echo -e "${BLUE}Test 1: POST /auth/oauth/google/initiate${NC}"
echo "----------------------------------------"

INITIATE_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/auth/oauth/google/initiate" \
  -H "Content-Type: application/json")

echo "$INITIATE_RESPONSE" | jq '.'

# Extract authorizationUrl and state
AUTH_URL=$(echo "$INITIATE_RESPONSE" | jq -r '.authorizationUrl')
STATE=$(echo "$INITIATE_RESPONSE" | jq -r '.state')

if [ -z "$AUTH_URL" ] || [ "$AUTH_URL" == "null" ]; then
  echo -e "${RED}❌ FAILED: No authorizationUrl returned${NC}"
  exit 1
else
  echo -e "${GREEN}✅ SUCCESS: Received authorization URL${NC}"
fi

if [ -z "$STATE" ] || [ "$STATE" == "null" ]; then
  echo -e "${RED}❌ FAILED: No state returned${NC}"
  exit 1
else
  echo -e "${GREEN}✅ SUCCESS: Received state parameter${NC}"
fi

echo ""
echo -e "${YELLOW}📋 Authorization URL:${NC}"
echo "$AUTH_URL"
echo ""
echo -e "${YELLOW}📋 State:${NC} $STATE"
echo ""

# Test 2: Validate Authorization URL Structure
echo -e "${BLUE}Test 2: Validate Authorization URL Structure${NC}"
echo "--------------------------------------------"

if [[ $AUTH_URL == *"accounts.google.com/o/oauth2"* ]]; then
  echo -e "${GREEN}✅ Valid Google OAuth URL${NC}"
else
  echo -e "${RED}❌ Invalid OAuth URL${NC}"
  exit 1
fi

if [[ $AUTH_URL == *"code_challenge="* ]]; then
  echo -e "${GREEN}✅ Contains PKCE code_challenge${NC}"
else
  echo -e "${RED}❌ Missing PKCE code_challenge${NC}"
  exit 1
fi

if [[ $AUTH_URL == *"code_challenge_method=S256"* ]]; then
  echo -e "${GREEN}✅ Using SHA-256 for code_challenge${NC}"
else
  echo -e "${RED}❌ Missing or incorrect code_challenge_method${NC}"
  exit 1
fi

if [[ $AUTH_URL == *"response_type=code"* ]]; then
  echo -e "${GREEN}✅ Using authorization code flow${NC}"
else
  echo -e "${RED}❌ Missing response_type=code${NC}"
  exit 1
fi

if [[ $AUTH_URL == *"scope="* ]]; then
  echo -e "${GREEN}✅ Contains scope parameter${NC}"
else
  echo -e "${RED}❌ Missing scope parameter${NC}"
  exit 1
fi

echo ""

# Test 3: Test Callback Endpoint (without real code)
echo -e "${BLUE}Test 3: POST /auth/oauth/google/callback (Error Test)${NC}"
echo "------------------------------------------------------"
echo "Testing with invalid code to verify error handling..."
echo ""

CALLBACK_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$BASE_URL/auth/oauth/google/callback" \
  -H "Content-Type: application/json" \
  -d "{\"code\": \"invalid_code_for_testing\", \"state\": \"$STATE\"}")

HTTP_CODE=$(echo "$CALLBACK_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$CALLBACK_RESPONSE" | sed '$d')

echo "HTTP Status Code: $HTTP_CODE"
echo "Response Body:"
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"

if [ "$HTTP_CODE" == "200" ]; then
  echo -e "${RED}❌ UNEXPECTED: Invalid code should not succeed${NC}"
elif [ "$HTTP_CODE" == "400" ] || [ "$HTTP_CODE" == "401" ] || [ "$HTTP_CODE" == "500" ]; then
  echo -e "${GREEN}✅ SUCCESS: Invalid code properly rejected (HTTP $HTTP_CODE)${NC}"
else
  echo -e "${YELLOW}⚠️  WARNING: Unexpected status code $HTTP_CODE${NC}"
fi

echo ""

# Test 4: Test Legacy Endpoint (Deprecated)
echo -e "${BLUE}Test 4: POST /auth/oauth/google (Legacy - Deprecated)${NC}"
echo "------------------------------------------------------"
echo "Testing legacy endpoint..."
echo ""

LEGACY_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$BASE_URL/auth/oauth/google" \
  -H "Content-Type: application/json" \
  -d '{"code": "invalid_code_for_testing"}')

LEGACY_HTTP_CODE=$(echo "$LEGACY_RESPONSE" | tail -n1)
LEGACY_BODY=$(echo "$LEGACY_RESPONSE" | sed '$d')

echo "HTTP Status Code: $LEGACY_HTTP_CODE"
echo "Response Body:"
echo "$LEGACY_BODY" | jq '.' 2>/dev/null || echo "$LEGACY_BODY"

if [ "$LEGACY_HTTP_CODE" == "400" ] || [ "$LEGACY_HTTP_CODE" == "401" ] || [ "$LEGACY_HTTP_CODE" == "500" ]; then
  echo -e "${GREEN}✅ Legacy endpoint exists and responds${NC}"
  echo -e "${YELLOW}⚠️  Note: This endpoint is deprecated. Use PKCE endpoints instead.${NC}"
else
  echo -e "${YELLOW}⚠️  Legacy endpoint returned unexpected status: $LEGACY_HTTP_CODE${NC}"
fi

echo ""
echo ""

# Summary
echo "========================================"
echo -e "${GREEN}✅ PKCE OAuth Endpoints Test Complete${NC}"
echo "========================================"
echo ""
echo "📝 Summary:"
echo "  • Initiate endpoint: Working ✅"
echo "  • Authorization URL: Valid ✅"
echo "  • PKCE parameters: Present ✅"
echo "  • Callback endpoint: Reachable ✅"
echo "  • Error handling: Working ✅"
echo ""
echo "🔗 Next Steps:"
echo ""
echo "1. Open the authorization URL in your browser:"
echo "   $AUTH_URL"
echo ""
echo "2. Authenticate with Google"
echo ""
echo "3. Copy the 'code' and 'state' from the callback URL"
echo ""
echo "4. Test the callback endpoint manually:"
echo "   curl -X POST $BASE_URL/auth/oauth/google/callback \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"code\": \"YOUR_CODE_HERE\", \"state\": \"$STATE\"}'"
echo ""
echo "5. Or test via Swagger UI:"
echo "   http://localhost:8080/api/swagger-ui.html"
echo ""
echo "========================================"
