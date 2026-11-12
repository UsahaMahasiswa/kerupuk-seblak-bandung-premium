# Deploy Kerupuk Seblak Bandung Premium to Cloudflare Workers + D1

The site is now configured as a Cloudflare Worker that serves the static website and a same-origin JSON API. Customer accounts, owner account, orders, uploaded payment proof, inventory, settings, and finance entries use D1. The cart and current builder selection remain in the visitor's browser until checkout.

## Before publishing

1. Create a D1 database named `kerupuk-seblak-db` in Cloudflare, if it does not already exist.
2. In the D1 database page, copy its **Database ID**.
3. Open `wrangler.jsonc` and replace `GANTI_DENGAN_DATABASE_ID_D1` with that ID. If the database has a different name, update `database_name` too.
4. In the D1 Console, run all SQL in `migrations/0001_init.sql` once. Do not run it again if the tables already exist; this initial schema is intentionally create-only.
5. Copy the website files and the new Worker files into the root of the GitHub repository. The root must contain `index.html`, `app-v2.js`, `cloud.js`, `worker.js`, `wrangler.jsonc`, `package.json`, and `migrations/0001_init.sql`.
6. Commit and push the changes to the `main` branch.
7. In the Cloudflare Worker setup page, keep the project name `kerupuk-seblak-bandung-premium`, leave **Build command** blank, keep **Deploy command** as `npx wrangler deploy`, and use the default Preview command. Then deploy.
8. If the D1 binding is not shown after deployment, open the Worker → **Settings** → **Bindings** and add a **D1 database** binding with variable name `DB`, selecting `kerupuk-seblak-db`.

## Safely register the first owner

Owner registration needs a one-time activation secret so a stranger cannot claim the public owner WhatsApp number before you do. It is required only for the first owner registration; daily owner login remains WhatsApp + PIN.

1. After the first Worker deployment, open Worker → **Settings** → **Variables and Secrets**.
2. Add a **Secret** named `PIN_PEPPER`. Use a private random value of at least 32 characters. Keep it backed up somewhere private and never change or delete it after accounts are created; changing it makes existing PINs unverifiable. Never put this value in GitHub or send it in chat.
3. Add another **Secret** named `OWNER_SETUP_CODE`, with a different private random value of at least 32 characters. It is only for creating the first owner account.
4. Open the public site and add `#pemilik` to its URL. Register the owner using either approved admin WhatsApp number, a new six-digit PIN, and the one-time activation value.
5. In **Pengaturan** in the owner dashboard, enter the QRIS image and payment recipient name. Checkout stays closed until both are saved.
6. Return to **Variables and Secrets** and delete `OWNER_SETUP_CODE`. Keep `PIN_PEPPER`; future customer and owner logins need it on the server, but customers and owners do not enter it.

## Notes

- Existing browser-only demo data and the old browser owner account do not automatically move to D1. Create the real owner account again and enter current settings/stock in the owner dashboard.
- Customer sign-in uses WhatsApp number and a six-digit PIN. Guest checkout remains available; guest customers use their order ID and WhatsApp number to look up the order.
- Proof images and site photos are compressed in the browser and stored in D1. D1 rows have a size limit; if an upload is rejected, use a smaller image.
- Preview deployments use the same configured D1 database unless a separate preview binding/database is configured. Avoid entering real orders into previews.
- Cloudflare Free has usage limits. D1 currently includes 5 million rows read/day, 100,000 rows written/day, 500 MB per database, and 5 GB total storage; Workers Free allows 100,000 requests/day and 10 ms CPU per request. If a free daily D1 limit is reached, database requests can fail until the limit resets. Check the usage dashboard and do not upgrade or enable paid add-ons if you need to keep the bill at zero.
- This project does not integrate a payment processor. The owner must still confirm a QRIS payment manually.
