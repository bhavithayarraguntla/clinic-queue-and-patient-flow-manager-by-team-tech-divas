## Project Description

The Clinic Queue and Patient Flow Manager is a web-based application designed to streamline patient flow and reduce waiting time confusion in healthcare clinics. Many clinics still rely on manual registers or basic token systems, which often lead to overcrowding, inefficient patient handling, and poor communication between patients, staff, and doctors. This project addresses these issues by providing a simple, role-based digital solution.

The application offers separate views for patients, staff, and doctors, ensuring that each user interacts only with features relevant to their role. Patients can register for a visit (appointment or walk-in), receive a queue token, and view their current position and estimated waiting time. Staff members can monitor overall queue status and patient load, while doctors can view and serve patients sequentially through a dedicated dashboard.

The system is built with HTML, CSS, and JavaScript and uses rule-based logic to manage queues and waiting times. No AI or machine learning is used. To ensure privacy, no real patient data is collected, stored, or transmitted. All data is simulated and session-based, making the system safe for demonstration and compliant with privacy-by-design principles.

This project demonstrates a practical, lightweight, and deployable solution that can realistically improve clinic operations and patient experience.

 ## Workflow
 
## 1. Patient Workflow

The patient opens the Patient View.

Selects the type of visit (appointment or walk-in).

The system generates a queue token.

The patient can view:

Token number

Queue position

Estimated waiting time

The patient waits until the token is called and then proceeds for consultation.

## 2. Staff Workflow

Staff access the Staff Dashboard.

View the total number of patients in the queue.

Monitor appointment and walk-in distribution.

Observe queue congestion and assist in managing patient flow when needed.

Staff do not access any personal or medical patient data.

## 3. Doctor Workflow

Doctors access the Doctor Dashboard.

View the current queue and the next patient token.

Serve patients one by one.

After each consultation, mark the patient as served.

The system automatically updates the queue and waiting time.

## 4. System Logic & Privacy

Queue management is handled using rule-based JavaScript logic.

Waiting time is calculated based on queue length and predefined consultation duration.

Updates are reflected across patient, staff, and doctor views in real time.

All data is temporary and stored only during the session.

No personal, medical, or identifiable data is collected or stored.

##website link:
https://bhavithayarraguntla.github.io/clinic-queue-and-patient-flow-manager-by-team-tech-divas/
