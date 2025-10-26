# Quick Social Media Setup

## Database Configuration

Run these SQL commands in your tenant database:

```sql
-- Meta (Facebook + Instagram) Credentials
INSERT INTO configuracoes (codigo, descricao, valor)
VALUES (
    'META_APP_CREDENTIALS',
    'Credenciais Facebook + Instagram',
    '{"clientId": "YOUR_META_APP_ID", "clientSecret": "YOUR_META_APP_SECRET"}'
);

-- Facebook Tokens (Global)
INSERT INTO configuracoes (codigo, descricao, valor)
VALUES ('FACEBOOK_TOKENS', 'Tokens Globais Facebook', NULL);

-- Instagram Tokens (Global)
INSERT INTO configuracoes (codigo, descricao, valor)
VALUES ('INSTAGRAM_TOKENS', 'Tokens Globais Instagram', NULL);

-- LinkedIn Credentials
INSERT INTO configuracoes (codigo, descricao, valor)
VALUES (
    'LINKEDIN_APP_CREDENTIALS',
    'Credenciais LinkedIn',
    '{"clientId": "YOUR_LINKEDIN_CLIENT_ID", "clientSecret": "YOUR_LINKEDIN_CLIENT_SECRET"}'
);

-- LinkedIn Tokens (Global)
INSERT INTO configuracoes (codigo, descricao, valor)
VALUES ('LINKEDIN_TOKENS', 'Tokens LinkedIn Globais', NULL);
```

## Redirect URIs to Configure

### Facebook Developer Console

Add these Redirect URIs:

- `http://localhost:9833/api/social/callback/facebook`
- `http://localhost:9833/api/social/callback/instagram`

### LinkedIn Developer Console

Add this EXACT URL (no trailing slash):

- `http://localhost:9833/api/social/callback/linkedin`

## Current Valid Scopes (2025)

### Facebook

- `pages_show_list`
- `pages_read_engagement`
- `public_profile`

### Instagram

- `pages_show_list`
- `pages_read_engagement`
- `instagram_manage_insights`
- `public_profile`

### LinkedIn

- `openid`
- `profile`
- `w_member_social`

## Important Notes

- Tokens are stored GLOBALLY per tenant (not per user)
- One Facebook/Instagram connection serves all users
- Deprecated scopes removed: `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`
- For posting capabilities, you'll need to apply for app review with Meta
