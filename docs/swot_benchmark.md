# SWOT & Benchmark Analysis - AI-Week

## 1. SWOT Analysis

### 🟢 Strengths (Forces)
- **Stack Technologique Moderne** : Utilisation de **React 19**, **Express 5**, **Prisma** et **TypeScript**. C'est un stack performant, typé et facile à maintenir.
- **Architecture Propre** : Séparation claire en 3 tiers (Frontend, Backend, Database) facilitant l'évolution du projet.
- **Conteneurisation (Docker)** : Déploiement et environnement de développement reproductibles grâce à Docker Compose.
- **Rôles Utilisateurs** : Système de permissions (ELEVE, PO, TUTEUR, DIRECTION) déjà intégré dans le schéma de données et le frontend.

### 🔴 Weaknesses (Faiblesses)
- **Sécurité Critique** : Absence de gestion de sessions ou de tokens JWT. Les mots de passe sont hashés, mais l'authentification reste rudimentaire au niveau des échanges API.
- **Absence de Tests** : Aucun framework de test (Vitest, Jest, Cypress) n'est configuré, ce qui pose un risque pour la stabilité à long terme.
- **Design Minimaliste** : L'interface repose sur des styles de base (Vite/Vanilla CSS) sans système de design (Design System) robuste ou librairie de composants avancée.
- **Fonctionnalités "AI" manquantes** : Malgré le nom du projet, aucune fonctionnalité d'Intelligence Artificielle n'est actuellement présente dans le code.

### 🟡 Opportunities (Opportunités)
- **Intégration IA** : Utilisation de LLMs pour générer des feedbacks automatiques sur les notes, optimiser les plannings ou assister les tuteurs (RAG sur les cours).
- **Transformation PWA** : Faciliter l'accès mobile pour les élèves et tuteurs sans développer d'application native.
- **Analytics & Tableaux de bord** : Développer des visualisations de données pour la direction afin de suivre la progression globale des classes.

### 🟠 Threats (Menaces)
- **Concurrence Établie** : Des solutions comme **Moodle** (open-source) ou **Canvas** (SaaS) offrent des fonctionnalités immenses avec lesquelles il est difficile de rivaliser seul.
- **Conformité des Données (RGPD)** : La gestion de données scolaires est sensible et nécessite une conformité stricte non encore adressée.
- **Maintenance Express 5** : Express 5 est très récent/expérimental, ce qui peut entraîner des bugs de dépendances tiers.

---

## 2. Benchmark Minimal

| Critère | AI-Week (Actuel) | Moodle | Google Classroom |
| :--- | :--- | :--- | :--- |
| **Cible** | Formation agile / Bootcamps | Universités / Grand compte | Ecoles / Particuliers |
| **Facilité d'utilisation** | ⭐⭐⭐⭐ (Simple) | ⭐⭐ (Complexe) | ⭐⭐⭐⭐⭐ (Très simple) |
| **Personnalisation** | ⭐⭐⭐⭐⭐ (Code total) | ⭐⭐⭐ (Plugins) | ⭐ (Très limité) |
| **Stack Technique** | Moderne (React/TS/Node) | Classique (PHP/Moodle Core) | Propriétaire (Google) |
| **Modèle** | Auto-hébergé / Docker | Auto-hébergé / Cloud | SaaS |
| **Fonctionnalités IA** | Prévu / Potentiel fort | Plugins tiers limités | Intégration Gemini (IA) |

---

## 3. Recommandations Stratégiques

1. **Priorité Sécurité** : Implémenter JWT et des middlewares d'authentification pour sécuriser les routes `/api`.
2. **Identité Visuelle** : Adopter une bibliothèque comme **Shadcn/UI** ou **Tailwind** pour donner un aspect premium et professionnel rapidement.
3. **Prouver le nom "AI"** : Intégrer une première fonctionnalité IA simple (ex: résumé automatique des messages ou aide à la rédaction de feedbacks pour les grades).
4. **Assurance Qualité** : Initialiser **Vitest** pour tester au moins la logique métier du backend.
