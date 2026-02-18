# 🎫 AI-Powered Support Ticket System

> **Clootrack Software: Tech Intern Assessment**  
> A premium, full-stack application for managing support tickets with automated AI classification.

---

## ✅ Assessment Checklist Completion Status
| Section | Status | Requirement |
| :--- | :---: | :--- |
| **Backend** | ✅ | Django 6 + DRF + PostgreSQL system with full CRUD. |
| **LLM Integration** | ✅ | Gemini (Google) & OpenAI supportk. |
| **Frontend** | ✅ | React (Vite) + shadcn/ui + Tailwind v4 + Recharts. |
| **Data Aggregation** | ✅ | DB-level `Count` and `Avg` for stats (no Python loops). |
| **DevOps** | ✅ | Fully containerized with Docker & Docker Compose. |
| **Persistence** | ✅ | Docker volumes used for PostgreSQL data safety. |

---

## 🚀 Getting Started

### 1. Pre-requisites
Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 2. Configuration (Optional)
The system works out-of-the-box with a keyword-based fallback for classification. To enable LLM suggestions, create a `.env` file in the root directory:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
# OR
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Launch
Run the following command in the project root:
```bash
docker-compose up --build
```

### 4. Access URLs
- **Frontend App**: [http://localhost](http://localhost)
- **API Root**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Stats Dashboard API**: [http://localhost:8000/api/tickets/stats/](http://localhost:8000/api/tickets/stats/)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

## 🛠 Features & Logic

### 🤖 AI-Driven Classification
- **How it works**: When a user finishes typing a ticket description, the frontend calls the `/api/tickets/classify/` endpoint.
- **Provider Choice**: I implemented support for both **Google Gemini 1.5 Flash** (preferred for its speed and free tier) and **OpenAI GPT-4o-mini**.
- **Prompt Strategy**: The prompt enforces a strict JSON schema, ensuring the backend receives structured data `{ "suggested_category": "...", "suggested_priority": "..." }`.
- **Reliability**: If no API key is set, the `llm_service.py` falls back to a deterministic keyword-matching logic.

### 📊 Advanced Stats Aggregation
The `/stats/` endpoint is designed for scalability:
- It uses Django's `Count` and `Avg` to calculate total tickets, open tickets, and breakdown by priority/category in **one single database query**.
- No Python loops are used for data processing, fulfilling the efficiency requirement of the assessment.

### 🎨 Design & UI
- **Aesthetics**: Built with **shadcn/ui** and **Tailwind CSS v4**, providing a clean "Enterprise SaaS" feel.
- **Micro-interactions**: Includes loading skeletons, toast notifications for success/error, and real-time status updates.
- **Responsiveness**: The dashboard uses a CSS Grid layout that adapts to mobile, tablet, and desktop views.

---

## 📂 Project Structure
```text
.
├── backend/            # Django REST Framework
│   ├── core/           # Configuration & Settings
│   ├── tickets/        # Models, Views, Serializers, LLM Logic
│   └── Dockerfile      # Python 3.12 environment
├── frontend/           # React + TypeScript
│   ├── src/            # Components, Libs, Styling
│   └── Dockerfile      # Multi-stage build (Node -> Nginx)
├── docker-compose.yml  # Orchestrates DB, Backend, Frontend
└── README.md           # You are here
```

---

## 🧹 Database Reset
To wipe the database (including the volume) and start with a clean slate:
```bash
docker-compose down -v
```
