# Secrets Handling & Deployment Checklist

This checklist helps keep secrets safe and deployments reproducible.

1. Never commit real secrets

- Never commit `.env` or any file containing plaintext credentials.
- Add `.env` to `.gitignore` (already present).

2. Use the provided `.env.example`

- Copy `.env.example` -> `.env` and populate real values on each machine or CI environment.

3. Production secret management

- Use your cloud provider's secret manager (AWS Secrets Manager, Azure Key Vault, Google Secret Manager) or the environment variable feature in your deployment service.
- Rotate `JWT_SECRET` and email credentials periodically and immediately after any suspected leak.

4. Email credentials

- Prefer a transactional email provider (SendGrid, Mailgun, SES) instead of personal Gmail credentials.
- Use an app-specific password if using Gmail and enable 2FA on the account.

5. Local dev convenience

- `DEV_EMAIL_FALLBACK=true` will return OTP/reset links in the API response for local testing. ALWAYS set it to `false` in staging/production.

6. CORS and allowed origins

- Set `FRONTEND_URL` in production to your deployed frontend origin only.

7. CI / CD

- Do not store secrets in repository variables. Configure CI to inject secrets from your provider.
- Add a staging environment that mirrors production values (except for credentials which should be distinct).

8. Audit & logging

- Log authentication events but avoid logging secrets (passwords, tokens, full reset URLs with tokens).
- Consider monitoring for many failed login attempts and alerting.

9. Backups and database

- Ensure DB backups are encrypted and access is tightly controlled.

10. Emergency response

- Have a documented plan to rotate secrets and revoke compromised credentials quickly.

Extra: Add `.env.example` to your repo root if you want frontend and other services to have examples too.
