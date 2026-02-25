🚨 ResQNow – Smart Emergency Response System 

🌍 A Community-Driven, Real-Time Emergency Coordination Platform 

📌 1️⃣ Introduction

Emergencies such as 🌪 natural disasters and 🚗 road accidents occur unexpectedly and require immediate response from relevant authorities. However, crucial information regarding these incidents is often scattered, delayed, or unreliable.

Traditional reporting methods like 📞 phone calls or 📱 social media posts can lead to:

❌ Miscommunication

❌ Duplicate reports

❌ Delayed verification

❌ Inefficient responder coordination

Most existing emergency reporting systems rely heavily on manual verification processes, which increases response time. Additionally, they lack mechanisms to evaluate the credibility of public reports, treating all submissions equally without assessing trustworthiness.

There is currently no integrated, trust-aware platform that combines:

✔ Public reporting 

✔ Community validation 

✔ Automated responder alerting 

✔ Real-time visualization

🚀 Enter ResQNow

ResQNow is a comprehensive digital emergency response platform designed to solve these challenges.

It introduces:

🔹 A crowdsourced verification mechanism 

🔹 An automated dispatch system 

🔹 Real-time data visualization

Together, these features enhance the speed, accuracy, and coordination of emergency response efforts.

📲 How It Works

Citizens can report incidents in real time by submitting:

🏷 Incident Type

📍 Location

📝 Description

🖼 Optional Images

All reports are stored in a centralized database and displayed on a live interactive map.

👮 Emergency responders and authorities monitor, verify, and act upon incidents through dedicated dashboards — ensuring faster and more effective emergency management.

🌊 Scalable for Multiple Emergency Types

ResQNow supports various emergency scenarios, including:

🚗 Road Accidents

🔥 Fires

🌊 Floods

⛰ Landslides

⚠ Other Disaster Events 


🎯 2️⃣ Project Objectives

The primary goal of ResQNow is to improve the speed, accuracy, and coordination of emergency response activities through a crowdsourced digital ecosystem.

🔑 Key Objectives

🔹 Provide intuitive 📱 mobile applications for Citizens and Responders 

🔹 Develop a 💻 web dashboard for Admins 

🔹 Enable real-time incident reporting with detailed information 

🔹 Implement a centralized incident management system 

🔹 Establish an automated proximity-based alert & dispatch mechanism 

🔹 Integrate a crowdsourced verification system to reduce false reports 

🔹 Implement secure authentication using 🔐 JWT (JSON Web Tokens) 

🔹 Provide analytics and data visualization for authorities 

🔹 Allow responders to acknowledge alerts and update statuses 

🔹 Ensure scalability using ☁ cloud-based infrastructure 

🔹 Encourage community participation in real-time emergency data collection 


🌟 3️⃣ Novelty of ResQNow

ResQNow introduces innovative features that distinguish it from traditional emergency reporting systems. 


1️⃣ Crowdsourced Verification Engine

  Users can upvote or flag incidents, generating a Verification Score that improves credibility and reduces misinformation. 


2️⃣ Automated Dispatch Based on Verification

  Responders are notified only after an incident reaches a defined verification threshold — reducing unnecessary alerts. 


3️⃣ Real-Time Incident Clustering & Risk Identification

  Verified incidents are visually clustered on a live map to improve situational awareness and assist in faster decision-making. 


4️⃣ Trust Badges & Credibility Tracking

  Each reporter has an internal credibility score, increasing trust for reliable contributors. 


5️⃣ Multi-Level Real-Time Map Visualization

  Incident heatmaps 

  Severity-based color coding

  Responder movement tracking 


6️⃣ Automated Proximity-Based Routing

The system automatically:

 Identifies the nearest verified responders

 Generates routing instructions

 Logs all alerts for transparency 


7️⃣ Cloud-Native Scalability

 Designed for high performance, capable of handling thousands of concurrent reports in real time.

8️⃣ Community-Driven Emergency Ecosystem

 Transforms citizens from passive observers into active participants in disaster management.

 ResQNow combines technology, community intelligence, and real-time coordination to build a safer, smarter society.   

 # ResQNow – Crowdsourced Disaster Response & Emergency Coordination Platform

##  Project Overview

ResQNow is a crowdsourced disaster management and emergency coordination platform designed to enhance real-time incident reporting, verification, and response management in Sri Lanka.  

The system enables citizens to report disasters, authorities to verify incidents, and responders to coordinate actions efficiently. ResQNow focuses on improving response speed, transparency, trust, and preparedness during critical situations such as floods, landslides, road accidents, and extreme weather events.

---

##  Problem Statement

Sri Lanka frequently experiences natural disasters and emergency situations, particularly during monsoon seasons. Existing systems primarily focus on reporting incidents but lack:

- Structured verification mechanisms
- Real-time response transparency
- Resource capacity awareness
- Data-driven risk analysis
- Accountability in emergency handling

Additionally, misinformation and duplicate reporting reduce the effectiveness of crowdsourced disaster platforms.

ResQNow aims to address these limitations through a structured, trust-aware, and analytics-driven approach.

---
## Proposed Solution

ResQNow introduces a centralized yet intelligent disaster response platform that integrates:

- Citizen-based real-time reporting
- Role-based access control (Citizen, Responder, Admin)
- Smart verification mechanisms
- Response lifecycle tracking
- Predictive Risk Hotspot visualization
- Data-driven dashboards for authorities

The system improves disaster response coordination while ensuring accountability and credibility.

---

## Key Features

### 1. Real-Time Incident Reporting
- Citizens can report disasters with location, images, and category.
- GPS-based automatic location capture.
- Status tracking for each report.

### 2. Trust-Based Verification Mechanism
- Reputation score for reporters.
- Report validation based on credibility and confirmations.
- Reduction of misinformation and false alarms.

### 3. Responder Accountability & Timeline Tracking
- Full incident lifecycle tracking:
  - Reported
  - Verified
  - Dispatched
  - On-site
  - Resolved
- Timestamped status updates.
- Response time analytics.

### 4. Predictive Risk Hotspot Layer
- Visual heatmap based on historical incident density.
- Time-based risk pattern analysis.
- Supports preparedness and decision-making.
- Not disaster prediction — but incident likelihood visualization.

### 5. Role-Based Access Control (RBAC)
- Citizen Portal
- Responder Dashboard
- Administrative Control Panel

### 6. Data Analytics Dashboard
- Incident frequency by region
- Average response time
- Authority performance metrics
- Risk trend visualization

---

System Architecture

High-Level Explanation

The system follows a three-tier architecture:

1. Presentation Layer (Frontend) –
This is the user interface where users interact with the system (web or mobile app).
It displays data and sends user requests to the backend.


2. Application Layer (Backend) –
This layer handles business logic, processes user requests, performs validations, and communicates with the database.


3. Data Layer (Database) –
This stores all system data such as user information, transactions, records, etc.



This layered architecture improves:

Maintainability

Scalability

Security

Performance



---

Client–Server Model

The system operates using a Client–Server architecture:

The Client (browser/mobile app) sends requests (e.g., login, submit form, fetch data).

The Server receives the request, processes it, and sends a response back.


Example flow:

1. User logs in


2. Client sends login request to server


3. Server verifies credentials from database


4. Server sends success/failure response



This model ensures:

Centralized data management

Better security

Multiple users can access simultaneously



---

Cloud Hosting

The system is deployed on a cloud platform (e.g., AWS, Azure, Google Cloud).

Benefits of cloud hosting:

Scalable resources (can handle more users easily)

High availability

Backup & disaster recovery

Secure data storage

Reduced infrastructure cost


Cloud hosting allows the system to run 24/7 without maintaining physical servers.


---

Database Overview

The system uses a relational database (e.g., MySQL/PostgreSQL).

The database:

Stores structured data in tables

Uses primary keys and foreign keys

Maintains relationships between entities


Main tables may include:

Users

Orders / Transactions

Products / Services

Logs


The database ensures:

Data integrity

Consistency

Efficient querying



---

System Design Artifacts

System design artifacts visually represent how the system works.


---

ER Diagram (Entity Relationship Diagram)

Refer to: /docs/diagrams/ER_Diagram.png

The ER diagram shows:

Entities (e.g., User, Order, Product)

Attributes of each entity

Relationships between entities

Primary & Foreign Keys


Purpose:

Helps design the database structure

Ensures proper relationships

Avoids redundancy



---

UML Diagrams

📁 Refer to: /docs/diagrams/UML_Diagrams/

Common UML diagrams included:

Use Case Diagram

Shows:

System users (actors)

What actions they can perform


Purpose:

Understand system functionality from user perspective



---

Class Diagram

Shows:

Classes

Attributes

Methods

Relationships between classes


Purpose:

Represents object-oriented structure



---
## Project Structure

The ResQNow project follows a modular and well-organized structure to support scalability, maintainability, and collaborative development.

```
ResQNow/
│
├── frontend/
├── backend/
├── documentation/
└── README.md
```

### /frontend

* Contains the user interface of the application
* Handles user interaction and visualization
* Connects with backend APIs
* Includes UI components, screens, and assets

### /backend

* Contains server-side application logic
* Implements RESTful APIs
* Manages authentication and authorization
* Handles database operations and business logic

### /documentaion

* Stores system documentation
* Includes UML diagrams and ER diagrams
* Contains project reports and design artifacts

---

## Team Contributions

### K.A. Wijesekara – Project Manager

* Coordinated overall team activities and project execution
* Managed project timeline and task allocation
* Monitored development progress and ensured milestone completion
* Prepared and reviewed project documentation
* Ensured successful delivery of project objectives

### R.A.C. Ruwanima – System Analyst

* Conducted requirement gathering and feasibility analysis
* Designed system models including DFD and ER diagrams
* Defined system workflows and functional requirements
* Ensured proper documentation of system processes
* Supported system design decision-making

### G.P.C. Thushani – Backend Developer

* Developed backend services using Node.js and Express.js
* Designed and implemented RESTful APIs
* Managed database integration using MongoDB
* Implemented server-side logic and data handling
* Ensured backend performance and system reliability

### A.T. Kalansooriya – Frontend Developer (Mobile/Web)

* Designed and developed the mobile frontend using React Native
* Integrated frontend components with backend APIs
* Contributed to UI/UX design improvements
* Implemented user interaction features
* Assisted in frontend testing and optimization

### A.M.G.D. Thawinsa – QA Engineer / Developer

* Performed system and integration testing
* Identified bugs and ensured software quality assurance
* Validated application functionality and performance
* Supported both frontend and backend development when required
* Assisted in debugging and system refinement

---

## Future Enhancements

* AI-based disaster damage analysis
* Integration with government emergency response systems
* SMS fallback notification system for low internet connectivity
* Multi-country deployment and scalability support
* Offline incident reporting capability
* Real-time predictive risk and disaster analytics

---

## License

This project is developed for academic and research purposes.
Licensed under the MIT License.

---


    
    
