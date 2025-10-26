# Social Media Integration Setup Guide

## Prerequisites

Before users can connect their social media accounts, you need to configure the OAuth credentials for each platform in the `configuracoes` table.

## Configuration Steps

### 1. Facebook Configuration

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add "Facebook Login" product
4. Configure OAuth Redirect URIs:
   - Add: `http://localhost:9833/api/social/callback/facebook` (development)
   - Add: `https://your-domain.com/api/social/callback/facebook` (production)
5. Get your App ID and App Secret
6. In your database, add to `configuracoes` table:

```sql
INSERT INTO configuracoes (codigo, descricao, valor)
VALUES (
    'FACEBOOK_APP_CREDENTIALS',
    'Facebook OAuth credentials',
    '{"clientId": "YOUR_FACEBOOK_APP_ID", "clientSecret": "YOUR_FACEBOOK_APP_SECRET"}'
);
```

**Required Permissions:**

- `pages_show_list` - To list user's pages
- `pages_read_engagement` - To read page engagement
- `pages_manage_posts` - To create posts on pages
- `pages_manage_metadata` - To manage page settings
- `public_profile` - Basic profile info

### 2. Instagram Configuration

Instagram uses Facebook's OAuth system. You need:

1. Same Facebook app as above
2. Add "Instagram Basic Display" and "Instagram Graph API" products
3. Link an Instagram Business Account to a Facebook Page
4. Configure OAuth Redirect URIs:
   - Add: `http://localhost:9833/api/social/callback/instagram` (development)
   - Add: `https://your-domain.com/api/social/callback/instagram` (production)
5. Use the same credentials as Facebook:

```sql
INSERT INTO configuracoes (codigo, descricao, valor)
VALUES (
    'INSTAGRAM_APP_CREDENTIALS',
    'Instagram OAuth credentials (uses Facebook)',
    '{"clientId": "YOUR_FACEBOOK_APP_ID", "clientSecret": "YOUR_FACEBOOK_APP_SECRET"}'
);
```

**Required Permissions:**

- `instagram_basic` - Basic Instagram account info
- `instagram_content_publish` - Publish content to Instagram
- `pages_show_list` - To access connected pages
- `pages_read_engagement` - To read engagement metrics

**Important Notes:**

- Instagram requires a Business or Creator account
- The Instagram account must be linked to a Facebook Page
- Personal Instagram accounts won't work

### 3. LinkedIn Configuration

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add "Sign In with LinkedIn" product
4. Configure Redirect URLs:
   - Add: `http://localhost:9833/api/social/callback/linkedin` (development)
   - Add: `https://your-domain.com/api/social/callback/linkedin` (production)
5. Get your Client ID and Client Secret
6. In your database, add to `configuracoes` table:

```sql
INSERT INTO configuracoes (codigo, descricao, valor)
VALUES (
    'LINKEDIN_APP_CREDENTIALS',
    'LinkedIn OAuth credentials',
    '{"clientId": "YOUR_LINKEDIN_CLIENT_ID", "clientSecret": "YOUR_LINKEDIN_CLIENT_SECRET"}'
);
```

**Required Permissions:**

- `openid` - OpenID Connect authentication
- `profile` - Access to profile data
- `w_member_social` - Post content on behalf of user

## Environment Variables

Make sure these are set in your `.env` file:

```env
API_URL=http://localhost:9833
FRONTEND_URL=http://localhost:3000
```

For production:

```env
API_URL=https://api.your-domain.com
FRONTEND_URL=https://your-domain.com
```

## Testing the Integration

1. Navigate to `/apps/conexoes` in the frontend
2. Click the "Connect" button for each platform
3. Complete the OAuth flow in the popup
4. Verify the account shows as "Connected"

## Troubleshooting

### "Credentials not configured" Error

- Make sure you've added the credentials to the `configuracoes` table
- Check that the JSON format is correct
- Verify the tenant ID matches your current tenant

### "Invalid Scopes" Error (Facebook/Instagram)

- Your app may not have been approved for certain permissions
- Submit your app for review in Facebook App Review
- During development, add test users who can use all permissions

### "Redirect URI Mismatch" Error (LinkedIn)

- Make sure the redirect URI in LinkedIn developer console exactly matches
- Include the protocol (http/https)
- Check for trailing slashes
- Verify API_URL environment variable is correct

### Database Connection Timeout

- Check database connection settings
- Verify tenant database exists
- Ensure configuracoes table exists in tenant database

## Token Storage

Tokens are stored in the `configuracoes` table with the format:

- Key: `USER_{userId}_{PROVIDER}_TOKENS`
- Example: `USER_123_FACEBOOK_TOKENS`

Token structure:

```json
{
  "access_token": "...",
  "expires_at": 1234567890000,
  "refresh_token": "...",
  "pageId": "...",
  "igUserId": "...",
  "authorUrn": "..."
}
```

## Security Notes

- Never commit credentials to version control
- Use environment variables for sensitive data
- Rotate secrets regularly
- Implement token encryption for production
- Monitor token usage and expiration
