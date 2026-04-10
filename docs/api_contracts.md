# Spécification du Contrat API

Ce document définit les points d'entrée (endpoints) de l'API de l'application **AI-Week**, les formats de données attendus et les réponses retournées.

## 📌 Informations Générales
- **Base URL** : `/api`
- **Format** : JSON
- **Authentification** : Session logicielle (Transmise via l'objet User au frontend après login).

---

## 🔐 Authentification

### `POST /api/register`
Crée un nouvel utilisateur. Rôle par défaut : `ELEVE`.
- **Corps** : `{ name, login, password }`
- **Succès (200)** : `User` (sans le mot de passe)
- **Erreur (400)** : `{ error: "Missing fields" }` ou `{ error: "Login already used" }`

### `POST /api/login`
Authentifie un utilisateur.
- **Corps** : `{ login, password }`
- **Succès (200)** : `User` (sans le mot de passe)
- **Erreur (401)** : `{ error: "Invalid credentials" }`

---

## 👥 Utilisateurs

### `GET /api/users`
Récupère la liste de tous les utilisateurs.
- **Succès (200)** : `User[]`

### `PUT /api/users/:id/role`
Modifie le rôle d'un utilisateur.
- **Corps** : `{ role }`
- **Succès (200)** : `User` (mis à jour)

### `PUT /api/users/:id/assign`
Assigne un utilisateur à une classe (classId).
- **Corps** : `{ classId }`
- **Succès (200)** : `User` (mis à jour)

---

## 📚 Cours et Notes

### `GET /api/courses`
Liste les cours disponibles.
- **Succès (200)** : `Course[]`

### `POST /api/courses`
Crée un nouveau cours (réservé aux PO).
- **Corps** : `{ title, poId }`
- **Succès (200)** : `Course`

### `GET /api/grades`
Liste toutes les notes enregistrées.
- **Succès (200)** : `Grade[]`

### `POST /api/grades`
Attribue une note à un étudiant.
- **Corps** : `{ studentId, courseId, value, comment? }`
- **Succès (200)** : `Grade`

---

## 📅 Planning et Présence

### `GET /api/schedule`
Récupère les sessions de cours planifiées.
- **Succès (200)** : `ScheduleSession[]`

### `POST /api/schedule`
Planifie une nouvelle session.
- **Corps** : `{ courseId, startTime, endTime, poId, classId }`
- **Succès (200)** : `ScheduleSession`

### `DELETE /api/schedule/:id`
Supprime une session planifiée (nettoie également l'attendance liée).
- **Succès (200)** : `{ success: true }`

### `POST /api/attendance/toggle`
Bascule l'état de présence (Présent / Absent) pour un étudiant.
- **Corps** : `{ sessionId, studentId }`
- **Succès (200)** : `{ action: "deleted" }` ou `{ action: "created", data: Attendance }`

---

## 💬 Communication et Tâches

### `POST /api/messages`
Envoie un message à un autre utilisateur.
- **Corps** : `{ senderId, receiverId, content }`
- **Succès (200)** : `Message`

### `POST /api/tasks`
Crée une nouvelle tâche de projet.
- **Corps** : `{ title, status }`
- **Succès (200)** : `ProjectTask`

### `PUT /api/tasks/:id/status`
Met à jour le statut d'une tâche.
- **Corps** : `{ status }`
- **Succès (200)** : `ProjectTask`
