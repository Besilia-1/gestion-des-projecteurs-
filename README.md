## Liste des tests pour le rôle d'Étudiant 3

## 1. Tests d'inscription et de connexion des utilisateurs

### 1.1. Test d'inscription d'un utilisateur avec un rôle "étudiant", "enseignant" ou "administrateur"
- **URL** : `http://localhost:3000/api/users/register`
- **Méthode** : `POST`
- **Corps de la requête** :
    ```json
    {
        "email": "test@example.com",
        "password": "password123",
        "role": "student"
    }
    ```
- **Réponse attendue** :
    - **Succès** : 
        ```json
        {
            "message": "Utilisateur enregistré",
            "userId": 1
        }
        ```
    - **Erreur** : 
        ```json
        {
            "message": "Erreur d'ajout de l'utilisateur",
            "error": "Message d'erreur SQL"
        }
        ```
## 2. Tests de routes protégées

### 2.1. Test d'accès sans token sur une route protégée
- **URL** : `http://localhost:3000/api/profile`
- **Méthode** : `GET`
- **Réponse attendue** :
    - **Erreur** : 
        ```json
        {
            "message": "Accès refusé. Aucun token fourni."
        }
        ```

### 2.2. Test d'accès avec un token invalide sur une route protégée
- **URL** : `http://localhost:3000/api/profile`
- **Méthode** : `GET`
- **En-tête** : 
    - `Authorization: Bearer invalid_token`
- **Réponse attendue** :
    - **Erreur** : 
        ```json
        {
            "message": "Token invalide."
        }
        ```

### 2.3. Test d'accès avec un token valide sur une route protégée
- **URL** : `http://localhost:3000/api/profile`
- **Méthode** : `GET`
- **En-tête** : 
    - `Authorization: Bearer valid_token`
- **Réponse attendue** :
    - **Succès** : 
        ```json
        {
            "userId": 1,
            "email": "test@example.com",
            "role": "student"
        }
        ```
### 3. Test d'empêcher la réservation si aucun projecteur n'est disponible
- **URL** : `http://localhost:3000/api/reservations`
- **Méthode** : `POST`
- **Corps de la requête** :
    ```json
    {
        "projector_id": 2,
        "date": "2025-03-01",
        "time": "10:00:00"
    }
    ```
- **Réponse attendue** :
    - **Erreur** : 
        ```json
        {
            "message": "Aucun projecteur disponible pour la réservation"
        }
        ```
