# 🚀 Interview AI

An AI-powered interview preparation platform that helps job seekers optimize their resumes, identify skill gaps, and prepare for interviews based on a specific job description.

The application analyzes a candidate's resume using AI and provides personalized insights, interview questions, learning roadmaps, and resume improvements to increase the chances of getting shortlisted.

---

## ✨ Features

* 📄 Upload your resume (PDF)
* 💼 Analyze your resume against any job description
* 🤖 AI-powered resume evaluation using the Groq API
* 📊 Resume match score and detailed feedback
* 🎯 Identify missing skills and skill gaps
* 📚 Personalized learning roadmap based on the target role
* 💻 Generate technical interview questions
* 🗣️ Generate behavioral interview questions
* 📝 AI suggestions to improve your resume
* 📥 Download the generated resume as a PDF
* 🔐 Secure user authentication
* 📱 Fully responsive user interface

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Scss
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### AI Integration

* Groq API

### Database

* MongoDB Atlas

### Tools

* Git & GitHub
* Docker (Deployment)
* Docker Compose

---

## 📂 Project Structure

```text
Interview-AI
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

GROQ_API_KEY=YOUR_GROQ_API_KEY
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/your-username/interview-ai.git

cd interview-ai
```

### Install Backend Dependencies

```bash
cd backend

npm install
```

### Install Frontend Dependencies

```bash
cd ../frontend

npm install
```

---

## ▶️ Run Locally

### Start Backend

```bash
cd backend

npm run dev
```

### Start Frontend

```bash
cd frontend

npm run dev
```

---

## 🐳 Running with Docker

Build the containers

```bash
docker compose build
```

Start the application

```bash
docker compose up
```

Run in detached mode

```bash
docker compose up -d
```

Stop the application

```bash
docker compose down
```

---

## 📸 Screenshots


* Login Page

[!login](./assets/Screenshot%20from%202026-07-09%2022-40-28.png)

* Dashboard

[!Dashboard](./assets/Screenshot%20from%202026-07-09%2022-41-01.png)


* AI Resume Analysis

[!AIresumeanalysis](./assets/Screenshot%20from%202026-07-09%2022-41-47.png)


---

## 🔮 Future Enhancements

* ATS compatibility score
* Resume version history
* Company-specific interview preparation
* Cover letter generation
* Email interview reports
* Interview performance analytics

---

## 🤝 Contributing

Contributions are welcome!

If you'd like to improve this project, feel free to fork the repository, create a feature branch, and submit a pull request.

---


---

## 👨‍💻 Author

**Atul Pandey**

If you found this project useful, consider giving it a ⭐ on GitHub.
