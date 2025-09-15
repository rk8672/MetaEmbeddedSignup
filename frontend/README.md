# MERN Embedded Signup – Assignment  

## 1) Project Overview  
This project is a MERN-based implementation of **Meta WhatsApp Embedded Signup**.  
It allows onboarding WhatsApp Business Accounts, capturing credentials, and using them to call Meta APIs.  

The flow includes:  
1. **Login with testing account**  
   - Go to 👉 https://metaembeddedsignup.onrender.com/  
   - Login using the provided test credentials.  

2. **Embedded Signup**  
   - From the sidebar, click on **Embedded Signup** tab.  
   - A page opens with the **Embedded Signup button**.  
   - On click, Meta’s signup window opens → connect a WhatsApp account.  

3. **Authorization Code**  
   - After successful signup, Meta returns:  
     - Authorization **code**  
     - **Phone Number ID**  
     - **WABA ID**  

4. **Backend Token Exchange**  
   - The frontend calls backend redirect URL with this code.  
   - Backend exchanges the code for an **access_token**.  
   - Access token + IDs are stored securely in **MongoDB**.  

5. **Dashboard**  
   - After signup, go to **Dashboard tab**.  
   - It lists all onboarded accounts from Embedded Signup.  
   - Select any account → open **Details page**.  
   - From here, you can call Meta APIs using stored credentials.  

6. **Supported Features in Details Page**  
   - Display name verification  
   - Mobile number verification  
   - Webhook subscription  
   - Payment method status  

---

## 2) How It Works  

### **Frontend (React + Vite)**  
- Login with test credentials.  
- Embedded Signup button opens Meta signup iframe.  
- After signup → receive code, WABA ID, Phone Number ID.  
- Sends data to backend for token exchange and storage.  
- Dashboard lists all accounts with their details.  

### **Backend (Node.js + Express + MongoDB)**  
- `/exchange-token` exchanges code → access_token.  
- Credentials (token, WABA ID, phone number, business ID) stored in MongoDB.  
- `/webhook` endpoint:  
  - **GET** → verify token with Meta.  
  - **POST** → handles WhatsApp message events + status updates.  
- APIs provided to frontend for fetching stored business data.  

### **Webhook Events**  
- Meta calls `/webhook` after subscription.  
- Dashboard reflects updates like display name approval and template approval.  

---

## 3) Deployment  
- **Frontend** → Hosted on Render: https://metaembeddedsignup.onrender.com/  
- **Backend + Webhook** → Hosted on Render with HTTPS.  
- `.env` used for App ID, App Secret, Verify Token, Mongo URI.  

---

## 4) Key Features  
✅ Login with test account  
✅ End-to-end Embedded Signup flow  
✅ Secure access token exchange + storage  
✅ Dashboard for managing onboarded accounts  
✅ Meta API calls from stored credentials  
✅ Webhook subscription + event handling  
✅ Display name, number verification, and payment status  

---

## 4) Key Features  
✅ One-click Meta Embedded Signup flow  
✅ Phone number verification inside signup process  
✅ Webhook verification + event handling  
✅ Payment method auto-attach status fetched from API  
✅ Display name approval tracking in real-time  
✅ Admin dashboard for logs and status  

---

## 5) Test Login  
For demo access:  
Mobile Number: 7524807719
Password: Rk@123