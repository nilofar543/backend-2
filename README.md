# E-commerce Website (HTML/CSS/JS + Node.js + MongoDB)

```
ecommerce/
├── backend/    -> Node.js + Express API + MongoDB
└── frontend/   -> HTML, CSS, JavaScript (no build step)
```

## Run it
1. Install Node.js (v18+) and MongoDB (or use a free MongoDB Atlas URL).
2. Backend:
   ```
   cd backend
   npm install
   npm run seed     # adds sample products + admin user
   npm run dev      # API on http://localhost:5000
   ```
3. Frontend: open `frontend/` in VS Code, right-click `index.html` -> "Open with Live Server".
   (Or run `npx serve frontend`.)

Admin login: admin@shop.com / admin123 (change after testing)

## API
| Method | URL | Access |
|---|---|---|
| POST | /api/auth/register | public |
| POST | /api/auth/login | public |
| GET | /api/products?search=&category= | public |
| GET | /api/products/:id | public |
| POST/PUT/DELETE | /api/products(/:id) | admin |
| POST | /api/orders | logged in |
| GET | /api/orders/mine | logged in |
