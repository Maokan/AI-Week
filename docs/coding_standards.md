# Standards de Code et Règles de Documentation

Ce document définit les règles de qualité et les conventions de nommage pour assurer la maintenabilité et la clarté du projet **AI-Week**.

---

## 💎 Qualité du Code (Best Practices)

### 1. Principes Généraux
- **KISS (Keep It Simple, Stupid)** : Privilégier la solution la plus simple possible. Éviter la sur-ingénierie.
- **DRY (Don't Repeat Yourself)** : Factoriser la logique métier répétée dans des utilitaires ou des hooks.
- **SOLID** : Appliquer les principes SOLID, notamment la Responsabilité Unique (une fonction = une tâche).

### 2. TypeScript
- **Typage Strict** : Interdiction d'utiliser `any`. Utiliser `unknown` si le type est réellement inconnu.
- **Interfaces vs Types** : Utiliser des `interface` pour les structures d'objets et des `type` pour les unions ou les alias complexes.
- **Discriminated Unions** : Utiliser les unions discriminées pour gérer les états mutuellement exclusifs (ex: statuts de tâches ou erreurs).

### 3. React
- **Composants Fonctionnels** : Utiliser exclusivement des composants fonctionnels avec des Hooks.
- **Custom Hooks** : Extraire la logique complexe (appels API, calculs lourds) dans des custom hooks (ex: `useAuth`, `useSchedule`).
- **Co-location** : Garder le state le plus proche possible de l'endroit où il est utilisé pour limiter les re-rendus inutiles.

### 4. Backend (Express)
- **Séparation des préoccupations** : Extraire la logique complexe des routes vers des services ou des contrôleurs si le fichier `index.ts` devient trop massif.
- **Gestion d'erreurs** : Toujours utiliser des blocs `try/catch` pour les opérations asynchrones et retourner des codes HTTP appropriés (4xx, 5xx).

---

## 💬 Règles de Commentaires

L'objectif est d'avoir un code **auto-documenté**. Les commentaires ne doivent pas compenser un code mal écrit.

### 1. Le "Pourquoi" plutôt que le "Quoi"
- **❌ Mauvais** :
  ```typescript
  // Incrémenter i de 1
  i++;
  ```
- **✅ Bon** :
  ```typescript
  // On incrémente l'index pour passer à la session suivante dans le carrousel
  i++;
  ```

### 2. Commentaires Utiles
- **Logique métier complexe** : Expliquer une règle de gestion métier non évidente à la lecture du code.
- **Edge cases** : Documenter pourquoi un cas particulier est géré d'une certaine manière.
- **Dette technique** : Utiliser `// TODO:` ou `// FIXME:` pour marquer des points d'amélioration futurs.

### 3. Commentaires Inutiles (À proscrire)
- **Le "Code Mort"** : Ne jamais laisser de code commenté. Utiliser Git pour retrouver d'anciennes versions.
- **Les évidences** : Ne pas commenter ce que le nom de la fonction exprime déjà clairement.

### 4. JSDoc / TSDoc
Documenter les fonctions exportées et les composants réutilisables avec JSDoc pour faciliter l'auto-complétion dans l'IDE.

```typescript
/**
 * Calcule la moyenne pondérée des notes d'un étudiant.
 * @param grades Liste des notes de l'étudiant
 * @returns La moyenne formatée à deux décimales
 */
export const calculateAverage = (grades: Grade[]): string => {
  // ...
};
```

---

## 🛠️ Outils et Automatisation

- **ESLint** : Détecte les erreurs de syntaxe et impose les règles de style de base.
- **Prettier** : Assure une mise en forme uniforme du code (indentation, retours à la ligne).
- **Vitest** : Garantit que les modifications n'introduisent pas de régressions sur la logique métier.
