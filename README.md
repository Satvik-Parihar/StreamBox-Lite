# 🎬 StreamBox-Lite

StreamBox-Lite is a basic yet powerful streaming web application that allows users to log in, view shows, and interact with content based on their subscription plan. It demonstrates session handling, authentication, and admin control for managing users and plans.

## 🔍 Overview
Users can log in to access content with restrictions based on their subscription level (**FREE**, **STANDARD**, **PREMIUM**). Each plan offers different permissions for HD playback, downloads, and concurrent sessions. Admins have control over user management and subscription changes.

## 🧠 Features
- 🔐 **Authentication System:** Login and logout using email and password with session token handling.
- 📺 **Dynamic Content Display:** Shows content options based on plan type.
- ⚙️ **Session Management:** Limits active devices according to user’s plan.
- 👑 **Admin Panel:** Modify user plans, view users, and force logout sessions.
- 💾 **API Integration:** RESTful endpoints for all authentication, content, and admin operations.

## 💼 Subscription Plans

| Plan      | HD Playback | Downloads | Ads | Concurrent Sessions |
|------------|-------------|------------|-----|----------------------|
| FREE       | ❌          | ❌         | ✅  | 1 |
| STANDARD   | ✅          | ❌         | ❌  | 2 |
| PREMIUM    | ✅          | ✅         | ❌  | 3 |

### Plan Rules
- **FREE users:** Can only play SD and see ads.  
- **STANDARD users:** Can play HD but not download.  
- **PREMIUM users:** Full access – HD playback, downloads, and up to 3 concurrent sessions.

## 🧩 Tech Stack
- **Frontend:** HTML, CSS, JavaScript, Bootstrap  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)

## ⚙️ Setup Instructions
1. Clone the repository  
   ```bash
   git clone https://github.com/yourusername/StreamBox-Lite.git
   cd StreamBox-Lite
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Create a `.env` file and add:
   ```env
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=thisisareallystrongsecretkey12345
   ```

4. Start the server  
   ```bash
   npm start
   ```

## 🧠 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/login` | Log in user |
| POST | `/logout` | Log out current session |
| POST | `/logoutAll` | Log out all sessions for user |

### Content
| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/content` | Fetch available shows |
| POST | `/play/sd` | Play SD content |
| POST | `/play/hd` | Play HD content (Standard & Premium only) |
| POST | `/download` | Download content (Premium only) |

### Admin
| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/admin/users` | View all users |
| PUT | `/admin/change-plan/:id` | Change user plan |
| POST | `/admin/force-logout/:id` | Force logout user sessions |

## 🖥️ Functionality
1. **Login system** authenticates users and assigns session tokens.  
2. **Session management** prevents exceeding concurrent limits.  
3. **Plan restrictions** dynamically change UI features.  
4. **Admin control** enables user plan upgrades or forced logouts.

## 🎨 UI Highlights
- Clean dark-themed interface  
- Responsive layout using Bootstrap  
- Conditional rendering for plan-based features  
- Ads visible only for FREE users

## 🔮 Future Enhancements
- Playlist creation and favorites  
- AI-based show recommendations  
- Multi-language subtitles  
- Watch history and analytics

## 👨‍💻 Developer
**Satvik Parihar**  
3rd Year B.E. Student in Artificial Intelligence, Gujarat, India.  
Passionate about building intelligent, scalable, and elegant web systems.


