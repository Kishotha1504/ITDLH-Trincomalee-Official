# Zonal Information Technology and Distance Learning Hub, Trincomalee (ITDLH-Trincomalee)

### Official Institutional Web Portal & Student Management System
*Affiliated with Zonal Education Office & Ministry of Education, Sri Lanka*  
*Tertiary and Vocational Education Commission (TVEC) Accreditation Reg: **P19/0052***

---

## 🏛️ 1. Institute & System Attribution

- **Institute Name:** Zonal Information Technology and Distance Learning Hub, Trincomalee (ITDLH-Trincomalee)
- **Affiliation:** Zonal Education Office & Ministry of Education, Sri Lanka
- **Address:** Zonal ITDLH, Kanniya Road, Trincomalee, Sri Lanka
- **Hotline Phone:** `0262051487`
- **Official Email:** `trincomaleezcrc@gmail.com`
- **TVEC Accreditation Registration:** `P19/0052`

### Key Institute Leadership & Staff
- **Institute Manager:** **Mrs. Mayuri Kuperan**  
  *Institutional administration, academic governance, student admissions, and Ministry coordination.*
- **Lead Instructor & System Designer / Developer:** **Mrs. Kishotha Kumanan**  
  *Technical curriculum instruction, TVEC assessments, and architect/full-stack developer of this institutional website and student management system.*

### Official Attribution & Creator Meta Tags
- **Head Meta Tags:**
  ```html
  <meta name="author" content="Mrs. Kishotha Kumanan">
  <meta name="designer" content="Mrs. Kishotha Kumanan">
  ```
- **Prominent Footer Attribution:**
  `"Website Designed & Developed by Mrs. Kishotha Kumanan (Instructor, ITDLH-Trincomalee)"`

---

## 💻 2. Technology Stack

- **Frontend:**
  - Semantic HTML5 with modern accessibility & SEO metadata
  - Vanilla CSS3 (Custom design system, CSS Grid/Flexbox, glassmorphism, micro-animations, mobile-responsive layout)
  - Vanilla JavaScript (ES6+ modular fetch, async/await, DOM controllers, modal dialogue management, print handler)
- **Backend:**
  - Node.js & Express.js
  - Security suite: `helmet` (Content Security Policy & headers), `cors`
  - Input Validation: `express-validator` (server-side sanitization and validation)
  - Environment: `dotenv`
- **Database:**
  - **PostgreSQL** via connection pooling (`pg` Pool)
  - Full relational schema (`registrations`, `notices`, `downloads`, `contact_inquiries`)
  - **Dual-Mode Resilient Fallback:** Includes an automatic resilient local data store so the system runs smoothly out of the box even before local PostgreSQL server configuration!

---

## 📚 3. Academic Programs & Courses

### A. NVQ Accredited Programs (TVEC Reg: P19/0052)

#### 1. NVQ Level 3: Computer Application Assistant (CAA) — 420 Hours
Expandable accordion curriculum containing all 15 competencies:
1. Use the computer and manage files within standard operating systems
2. Perform word processing
3. Prepare spreadsheets
4. Prepare presentation resources
5. Perform basic operations of cloud computing including internet and email services
6. Handle relational database
7. Conduct routine maintenance services of computer system and peripherals
8. Produce print page layout and multimedia objects
9. Analyze, design and develop information system
10. Handle relational databases using standard SQL
11. Design static website
12. Developing Desktop Applications
13. Practice workplace communication and interpersonal relations
14. Apply occupational literacy and numeracy
15. Work in a team & practice occupational health and safety measures

#### 2. NVQ Level 4: ICT Technician — 720 Hours + 6 Months OJT
Expandable accordion curriculum containing all 11 competencies + On-the-Job Training:
1. Use the computer and manage files within standard operating systems
2. Perform word processing
3. Prepare spreadsheets
4. Prepare presentation resources
5. Perform basic operations of cloud computing including internet and email services
6. Handle relational database
7. Conduct routine maintenance services of computer system and peripherals
8. Practice workplace communication and interpersonal relations
9. Apply occupational literacy and numeracy
10. Work in a team
11. Practice occupational health and safety measures

---

### B. Professional Short-Term Courses
1. **Advanced Certificate in Computer Application** — 180 Hours
2. **Advanced Diploma in Information Technology** — 200 Hours
3. **Web Designing Level 1** — 100 Hours
4. **Web based application Developer** — 140 Hours
5. **Advanced Certificate in Java Programming** — 150 Hours
6. **Certificate course in office application** — 80 Hours
7. **Certificate in multimedia** — 120 Hours
8. **Certificate course in DBMS with MySQL** — 100 Hours

---

## 🛠️ 4. Quickstart & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ or v20+ recommended)
- Optional: [PostgreSQL](https://www.postgresql.org/) (v14+ recommended)

### Step 1: Install Dependencies
Open your terminal in the project directory:
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=3000
NODE_ENV=development

# PostgreSQL Settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=itdlh_trincomalee
DB_USER=postgres
DB_PASSWORD=your_password

# Or full database URI:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/itdlh_trincomalee
```

### Step 3: Initialize PostgreSQL Database (When Postgres is running)
Create the database in PostgreSQL:
```sql
CREATE DATABASE itdlh_trincomalee;
```
Then run the automated database migration and seed script:
```bash
npm run db:init
```
*Note: If PostgreSQL is not running, the application will automatically activate its built-in Resilient Data Store, enabling instant local development and testing.*

### Step 4: Run the Application
Start the server:
```bash
npm start
```
Or with auto-reload (watch mode):
```bash
npm run dev
```

### Step 5: Access the Web Application
- **Main Institutional Website:** [http://localhost:3000](http://localhost:3000)
- **Staff Administration Portal:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

## 📡 5. REST API Documentation

| Endpoint | Method | Description |
|---|---|---|
| `/api/status` | `GET` | Returns system health, TVEC registration, designer attribution, and database connectivity mode. |
| `/api/notices` | `GET` | Retrieves active institute notices and batch announcements. |
| `/api/downloads` | `GET` | Retrieves downloadable curricula, application forms, and guidelines. |
| `/api/register` | `POST` | Validates student input, stores admission record, and generates application reference ID (`ITDLH-YYYY-XXXX`). |
| `/api/contact` | `POST` | Submits general public inquiries and messages to institute administration. |
| `/api/admin/registrations` | `GET` | Staff endpoint to view registered student applications. |
| `/api/admin/inquiries` | `GET` | Staff endpoint to view received contact messages. |

---

## 📂 6. Directory Structure

```
ITDLH Trincomalee/
├── package.json               # Dependencies and scripts
├── server.js                  # Express.js REST API & static server
├── test-suite.js              # Automated system & attribution verification suite
├── .env.example               # Environment variables template
├── .env                       # Active environment configuration
├── db/
│   ├── index.js               # PostgreSQL pool adapter + resilient local fallback
│   ├── schema.sql             # PostgreSQL DDL table definitions
│   ├── seed.sql               # Seed data for notices and downloads
│   └── init-db.js             # Automated DB migration runner
├── public/
│   ├── index.html             # Main institutional website
│   ├── admin.html             # Staff Administration Portal
│   ├── css/
│   │   └── styles.css         # Modern design system & responsive styling
│   ├── js/
│   │   ├── app.js             # Main frontend DOM controller & async fetch
│   │   └── admin.js           # Admin portal metrics, search & CSV export
│   └── assets/
│       ├── images/
│       │   ├── itdlh_crest.jpg        # Official institutional seal logo
│       │   ├── itdlh_hero_banner.jpg  # High-tech computer lab banner
│       │   ├── staff_manager.jpg      # Mrs. Mayuri Kuperan portrait
│       │   └── staff_instructor.jpg   # Mrs. Kishotha Kumanan portrait
│       └── downloads/
│           ├── ITDLH_Student_Application_Form.pdf
│           ├── NVQ_Level_3_CAA_Curriculum.pdf
│           ├── NVQ_Level_4_ICT_Technician_Syllabus.pdf
│           ├── ITDLH_Short_Courses_Handbook_2026.pdf
│           ├── TVEC_Accreditation_P19_0052.pdf
│           └── ITDLH_Lab_Rules_and_Guidelines.pdf
└── README.md                  # Project documentation
```

---

## 👩‍💻 Credits & System Attribution

**Designed, Architected & Developed by:**  
**Mrs. Kishotha Kumanan**  
*Instructor, Zonal Information Technology and Distance Learning Hub (ITDLH), Trincomalee*  
*Affiliated with Zonal Education Office & Ministry of Education, Sri Lanka*
