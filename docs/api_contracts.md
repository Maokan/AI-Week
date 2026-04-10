# Spécification du Contrat API

Ce document définit les points d'entrée (endpoints) de l'API de l'application **AI-Week**, les formats de données attendus et les réponses retournées.

---

## 🔐 Authentification

### `POST /api/register`
Crée un nouvel utilisateur. Rôle par défaut : `ELEVE`.
- **Input** : `{ name, login, password }`
- **Output (200)** : `User` (sans le mot de passe)
- **Error (400/500)** : `{ error: string }`

### `POST /api/login`
Authentifie un utilisateur.
- **Input** : `{ login, password }`
- **Output (200)** : `User` (sans le mot de passe)
- **Error (401/500)** : `{ error: string }`

---

## 👥 Utilisateurs

### `GET /api/users`
Récupère la liste complète des utilisateurs.
- **Output (200)** : `User[]`

### `PUT /api/users/:id/role`
Modifie le rôle d'un utilisateur existant.
- **Input** : `{ role }`
- **Output (200)** : `User` (mis à jour)

### `PUT /api/users/:id/assign`
Assigne un utilisateur à une classe spécifique.
- **Input** : `{ classId }`
- **Output (200)** : `User` (mis à jour)

---

## 📚 Cours et Notes

### `GET /api/courses`
Liste tous les cours disponibles.
- **Output (200)** : `Course[]`

### `POST /api/courses`
Crée un nouveau cours (Product Owner uniquement).
- **Input** : `{ title, poId }`
- **Output (200)** : `Course`

### `GET /api/grades`
Liste toutes les notes de l'application.
- **Output (200)** : `Grade[]`

### `POST /api/grades`
Attribue une note à un étudiant pour un cours donné.
- **Input** : `{ studentId, courseId, value, comment? }`
- **Output (200)** : `Grade`

---

## 📅 Planning et Présence

### `GET /api/schedule`
Récupère l'ensemble des sessions de cours planifiées.
- **Output (200)** : `ScheduleSession[]`

### `POST /api/schedule`
Planifie une nouvelle session de cours.
- **Input** : `{ courseId, startTime, endTime, poId, classId }`
- **Output (200)** : `ScheduleSession`

### `DELETE /api/schedule/:id`
Supprime une session planifiée et les présences associées.
- **Output (200)** : `{ success: true }`

### `GET /api/attendance`
Liste tous les enregistrements de présence.
- **Output (200)** : `Attendance[]`

### `POST /api/attendance/toggle`
Bascule l'état de présence d'un étudiant pour une session.
- **Input** : `{ sessionId, studentId }`
- **Output (200)** : `{ action: "deleted" }` ou `{ action: "created", data: Attendance }`

---

## 💬 Communication et Projet

### `GET /api/messages`
Récupère l'historique complet des messages.
- **Output (200)** : `Message[]`

### `POST /api/messages`
Envoie un nouveau message.
- **Input** : `{ senderId, receiverId, content }`
- **Output (200)** : `Message`

### `GET /api/tasks`
Récupère la liste des tâches du tableau de bord.
- **Output (200)** : `ProjectTask[]`

### `POST /api/tasks`
Crée une nouvelle tâche de projet.
- **Input** : `{ title, status }`
- **Output (200)** : `ProjectTask`

### `PUT /api/tasks/:id/status`
Met à jour le statut d'une tâche.
- **Input** : `{ status }`
- **Output (200)** : `ProjectTask`

### `DELETE /api/tasks/:id`
Supprime définitivement une tâche.
- **Output (200)** : `{ success: true, deletedId: string }`
