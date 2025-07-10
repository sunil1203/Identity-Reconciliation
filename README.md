# Identity-Reconciliation

> Node.js · Express · TypeScript · MySQL (Aiven) · TypeORM · Render

---

## ✨ Features

* **/identify** endpoint that merges and/or fetches linked contacts by email/phone
* Primary / Secondary contact hierarchy handled transparently
* TypeORM auto‑sync (dev) or migrations (prod)
* Cloud MySQL on **Aiven** – no local DB required
* One‑click deploy to **Render** (free plan)

---

## 📁 Project Structure

```
Identity-Reconciliation/
├─ src/
│  ├─ app.ts            # Express app
│  ├─ server.ts         # Bootstraps DB + HTTP server
│  ├─ db.ts             # TypeORM datasource (Aiven creds via .env)
│  ├─ models/
│  │   └─ contact.model.ts
│  ├─ services/
│  │   └─ contact.service.ts
│  ├─ controllers/
│  │   └─ contact.controller.ts
│  ├─ routes/
│  │   └─ contact.routes.ts
│  └─ utils/
│      └─ identity.util.ts
├─ .env.example
├─ package.json
├─ tsconfig.json
└─ README.md           
```

---

## 🚀 Quick Start (Local Dev)

### 1. Clone & install

```bash
git clone https://github.com/sunil1203/Identity-Reconciliation.git
cd Identity-Reconciliation
npm install
```

### 2. Create Aiven MySQL and grab creds

1. Log in to [https://console.aiven.io/](https://console.aiven.io/) → **Create service** → **MySQL** (free plan).
2. Copy **Host, Port, User, Password, Database** from *Service Overview*.

### 3. Configure environment variables

```bash
cp .env.example .env   # then edit .env
```

```ini
DB_HOST=<AIVEN_HOST>
DB_PORT=<AIVEN_PORT>
DB_USER=<AIVEN_USER>
DB_PASS=<AIVEN_PASSWORD>
DB_NAME=<AIVEN_DB>
PORT=8000              # change if needed
```

### 4. Run the dev server

```bash
npm run dev            # ts‑node‑dev with hot reload
```

*API available at* **[http://localhost:8000](http://localhost:8000)**.

---

## 🛰️ API Reference

### POST /identify

Merge or fetch contact cluster for a given **email** and/or **phoneNumber**.

#### Request Body

```json
{
  "email": "foo@bar.com",
  "phoneNumber": "1234567890"
}
```

• At least one field is required.
• Additional fields are ignored.

#### Successful Response

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["foo@bar.com", "baz@qux.com"],
    "phoneNumbers": ["1234567890", "9876543210"],
    "secondaryContactIds": [2, 3]
  }
}
```

#### cURL Example

```bash
curl -X POST https://identity-reconciliation-9wn6.onrender.com/identify \
     -H "Content-Type: application/json" \
     -d '{"email":"alice@example.com","phoneNumber":"9998887777"}'
```

---

## 🌐 Cloud Deployment

### 1. Push to GitHub

```bash
git remote add origin https://github.com/<your‑gh>/Identity-Reconciliation.git
git push -u origin main
```

### 2. Deploy on Render (Free Web Service)

1. Sign in at [https://dashboard.render.com/](https://dashboard.render.com/) → **New → Web Service**.
2. Connect your repo.
3. Settings ▶️

   * **Environment**: *Node*
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
   * **Branch**: `main`
   * **Root Dir**: *(blank)*
4. Add **Environment Variables** matching `.env` (Render ⇢ Environment tab).
5. Click **Create Web Service** – first deploy builds automatically.
6. Note the public URL, e.g.:

   ```
   https://identity-reconciliation-9wn6.onrender.com
   ```

### 3. Post‑deploy checklist

* ✅ `GET /ping` returns **pong**.
* ✅ `POST /identify` works with sample payload (see cURL).
* ✅ Update **Hosted URL** section below.

---

## 🌍 Hosted URL

```text
https://identity-reconciliation-9wn6.onrender.com/identify
```

---

## 🛠️ Scripts

| Command         | Purpose                             |
| --------------- | ----------------------------------- |
| `npm run dev`   | Hot‑reload server via `ts-node-dev` |
| `npm run build` | Compile TypeScript to **dist/**     |
| `npm start`     | Run compiled JavaScript             |
| `npm run lint`  | ESLint + Prettier                   |

---

## 🧪 Testing (optional)

The repo is Jest‑ready. Add tests under `tests/` and run:

```bash
npm test
```

---

## 🐳 Docker (optional)

A `docker-compose.yml` can be added for local MySQL + app containers.
Not required when using Aiven.

---

## ⚠️ Security Notes

* **Never** commit `.env` or Aiven credentials.
* Personal‑access tokens (PATs) can be used with `https://<username>:<token>@github.com/…` for one‑off pushes.
* Remove temporary PATs or SSH keys immediately after pushing.

---

## 📜 License

MIT © 2025 Sunil Sharma
