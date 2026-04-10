# Diagramme de Séquence - Parcours Principal

Ce document détaille les interactions entre les différents composants de l'application **AI-Week** lors du parcours utilisateur principal : la connexion et le chargement initial du tableau de bord.

## 🔄 Flux d'Authentification et de Chargement

```mermaid
sequenceDiagram
    actor User as Utilisateur
    participant FE as Frontend (React Pages)
    participant Ctx as AppContext (Provider)
    participant BE as Backend (Express API)
    participant DB as Database (PostgreSQL)

    Note over User, FE: L'utilisateur remplit le formulaire sur /auth
    User->>FE: Clique sur "Se connecter"
    FE->>Ctx: appel handleLogin(login, password)
    
    rect rgb(240, 240, 240)
        Note right of Ctx: Phase d'Authentification
        Ctx->>BE: POST /api/login {login, password}
        BE->>DB: prisma.user.findUnique({ where: { login } })
        DB-->>BE: User data (hashed password)
        BE->>BE: bcrypt.compare(password, hash)
        BE-->>Ctx: User JSON (Success 200)
    end

    Note over Ctx: setCurrentUser(user) => Trigger useEffect

    rect rgb(220, 230, 255)
        Note right of Ctx: Phase de Chargement des Données (fetchData)
        Ctx->>BE: Promise.all([/api/users, /api/courses, /api/grades, ...])
        BE->>DB: Requêtes Prisma multiples
        DB-->>BE: Résultats
        BE-->>Ctx: Données JSON complètes
    end

    Ctx->>FE: Mise à jour du State (setUsers, setCourses, etc.)
    FE-->>User: Redirection vers /dashboard & Affichage des données
```

## 📝 Description des étapes

1. **Phase d'Authentification** : 
    - Le `AppContext` gère la communication avec l'API `/api/login`.
    - Le backend vérifie le mot de passe hashé via `bcrypt`.
    - En cas de succès, l'objet utilisateur (sans le mot de passe) est renvoyé au client.

2. **Phase de Synchronisation** : 
    - Dès que `currentUser` est défini, un `useEffect` dans le `AppContext` déclenche `fetchData()`.
    - Cette fonction exécute 7 requêtes `GET` en parallèle vers les différents services métier (Schedule, Grades, Messages, Tasks, etc.).

3. **Phase de Rendu** : 
    - Une fois les promesses résolues, les états globaux du contexte sont mis à jour.
    - React déclenche un re-rendu massif des composants abonnés, affichant ainsi le tableau de bord avec les informations fraîches.
