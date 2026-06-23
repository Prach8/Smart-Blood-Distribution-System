# 🩸 Smart Blood Distribution System

## 📌 Project Overview

The **Smart Blood Distribution System** is an intelligent healthcare resource management platform designed to optimize the allocation and distribution of blood units among hospitals and blood banks. The system applies Operating System scheduling concepts and resource allocation strategies to ensure efficient, fair, and timely blood distribution, especially during emergencies.

This project simulates real-world blood bank operations by dynamically selecting suitable scheduling algorithms based on request characteristics such as urgency, distance, and blood unit requirements.

---

## 🎯 Objectives

* Automate blood allocation and distribution.
* Prioritize emergency blood requests.
* Reduce blood wastage and shortages.
* Improve response time during critical situations.
* Apply Operating System algorithms to solve healthcare logistics problems.
* Provide real-time monitoring of blood inventory and requests.

---

## 🚀 Features

### Blood Request Management

* Hospital blood request submission
* Request prioritization based on urgency
* Distance-aware allocation mechanism
* Real-time request tracking

### Blood Inventory Management

* Blood stock monitoring
* Automatic inventory updates
* Low-stock detection and alerts
* Blood group compatibility checking

### Dynamic Scheduling Engine

The system dynamically selects the most suitable algorithm based on incoming requests:

* Priority Scheduling
* Round Robin Scheduling
* Shortest Remaining Time First (SRTF)
* Longest Remaining Time First (LRTF)
* Producer-Consumer Model
* FIFO Scheduling

### Dashboard Analytics

* Total Requests
* Fulfilled Requests
* Emergency Cases
* Available Blood Units
* Inventory Status Monitoring

### User Interface

* Responsive Web Dashboard
* Interactive Request Forms
* Real-Time Status Updates
* Modern and User-Friendly Design

---

## 🏗️ System Architecture

```text
Hospital Request
        │
        ▼
Request Processing Layer
        │
        ▼
Dynamic Scheduler
        │
 ┌──────┼──────┐
 │      │      │
 ▼      ▼      ▼
Priority  RR  SRTF/LRTF
Scheduling
        │
        ▼
Blood Compatibility Check
        │
        ▼
Inventory Allocation
        │
        ▼
Dashboard & Reports
```

---

## 🧠 Operating System Concepts Used

| Concept             | Application                    |
| ------------------- | ------------------------------ |
| Process Scheduling  | Blood request prioritization   |
| Producer Consumer   | Request buffering and handling |
| Resource Allocation | Blood inventory allocation     |
| Priority Scheduling | Emergency case handling        |
| Round Robin         | Fair distribution of resources |
| SRTF/LRTF           | Dynamic request execution      |
| Deadlock Avoidance  | Efficient resource utilization |
| Synchronization     | Managing concurrent requests   |

---

## 🩸 Blood Compatibility Support

The system supports compatibility-based blood allocation:

| Recipient | Compatible Donors |
| --------- | ----------------- |
| A+        | A+, A-, O+, O-    |
| A-        | A-, O-            |
| B+        | B+, B-, O+, O-    |
| B-        | B-, O-            |
| O+        | O+, O-            |
| O-        | O-                |
| AB+       | All Blood Types   |
| AB-       | A-, B-, AB-, O-   |

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Development Tools

* Visual Studio Code
* Git
* GitHub

---

## 📂 Project Structure

```text
Smart-Blood-Distribution-System/
│
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/your-username/Smart-Blood-Distribution-System.git
```

### Navigate to Project Folder

```bash
cd Smart-Blood-Distribution-System
```

### Install Dependencies

```bash
npm install
```

### Run Application

```bash
node server.js
```

or

```bash
npm start
```

### Open Browser

```text
http://localhost:3000
```

---

## 📊 Sample Workflow

1. Hospital submits blood request.
2. System analyzes urgency, distance, and required units.
3. Dynamic Scheduler selects the most suitable scheduling algorithm.
4. Blood compatibility is verified.
5. Blood units are allocated from inventory.
6. Inventory is updated automatically.
7. Dashboard displays updated statistics and request status.

---

## 🔮 Future Enhancements

* AI-based demand prediction
* Machine Learning for inventory forecasting
* GPS-enabled hospital routing
* Real-time donor integration
* SMS and Email notifications
* Multi-blood-bank support
* Cloud deployment
* Mobile application support
* Emergency alert system

---

## 📈 Expected Outcomes

* Faster emergency response
* Better utilization of blood resources
* Reduced blood wastage
* Improved healthcare logistics
* Intelligent scheduling and resource allocation

---

## 👩‍💻 Author

**Prachi Saini**
B.Tech Computer Science & Engineering
Graphic Era Hill University, Dehradun

---

## 📄 License

This project is developed for educational and research purposes. Feel free to use and modify it with proper attribution.

---

### ⭐ If you found this project useful, consider giving it a star on GitHub!
