# ⚡ Electricity Business

## 📌 Présentation

**Electricity Business** est une application web full-stack permettant de mettre en relation des particuliers possédant une borne de recharge électrique avec des utilisateurs souhaitant recharger leur véhicule.

👉 Ce projet est **fictif** et a été réalisé dans le cadre de ma formation **Concepteur Développeur d’Applications (CDA)**.

---

## 🎯 Objectifs du projet

- Concevoir une application complète de A à Z
- Mettre en pratique une architecture professionnelle
- Développer une API sécurisée
- Implémenter un front moderne et dynamique
- Gérer des règles métier complexes (réservations, créneaux, prix)

---

## 🚀 Fonctionnalités principales

### 👤 Gestion des utilisateurs
- Inscription avec validation par email
- Connexion sécurisée (JWT)
- Gestion du profil utilisateur

### 🔌 Gestion des bornes
- Ajouter / modifier / supprimer une borne
- Définir les disponibilités et les tarifs
- Gestion des bornes personnelles

### 📅 Réservation
- Recherche de bornes via carte interactive
- Sélection de créneaux horaires disponibles
- Calcul automatique du prix
- Historique des réservations

### 📊 Fonctionnalités avancées
- Export des données (Excel)
- Génération de reçus
- Dashboard utilisateur
- Upload d’images

---

## 🏗️ Architecture du projet

### 🔙 Back-end
- Java 21 / Spring Boot
- Architecture en couches :
  - Controller
  - Service (Business)
  - Repository
  - Entity
  - DTO / Mapper
- Sécurité : Spring Security + JWT
- Base de données : MySQL

👉 Objectifs :
- Séparation des responsabilités
- Maintenabilité
- Testabilité
- Scalabilité :contentReference[oaicite:0]{index=0}

---

### 🎨 Front-end
- Angular 19
- Architecture modulaire (feature-based + shared)
- Routing + Guards + Interceptors JWT

👉 Organisation :
- Public layout (pages accessibles sans connexion)
- Dashboard layout (espace authentifié) :contentReference[oaicite:1]{index=1}

---

## 🛠️ Technologies utilisées

### Back-end
- Java 21
- Spring Boot
- Spring Security
- JWT
- JPA / Hibernate
- Maven

### Front-end
- Angular
- TypeScript
- TailwindCSS

### Outils
- MySQL
- Git / GitHub
- Postman
- Figma

---

## 🔐 Sécurité

- Authentification JWT
- Validation des données
- Gestion des variables d’environnement
- Protection des données sensibles (env.properties non versionné) :contentReference[oaicite:2]{index=2}

---

## ⚙️ Installation du projet

### 🔧 Back-end


# Cloner le projet
git clone <repo-back>

# Configurer les variables d’environnement (env.properties)

# Lancer l'application
mvn spring-boot:run


### 🔧 Front-end

# Cloner le projet
git clone <repo-front>

# Installer les dépendances
npm install

# Lancer le projet
ng serve

## 🧪 Tests

- Tests unitaires (JUnit)
- Tests d’intégration
- Tests fonctionnels sur les endpoints

---

## 🚀 Déploiement

- Serveur : OVH (Linux)
- Backend : JAR + systemd
- Frontend : build Angular
- HTTPS via Let's Encrypt
- CI/CD avec GitHub Actions

---

## 📈 Améliorations possibles

- Mise en place de Docker
- CI/CD complet front + back
- Optimisation des performances
- Refactoring architecture
- Amélioration UX/UI

---

## 📚 Contexte pédagogique

Ce projet a été réalisé dans le cadre de ma formation :

🎓 **Titre Professionnel Concepteur Développeur d’Applications (CDA)**

Il m'a permis de travailler :

- L’architecture logicielle
- La sécurité applicative
- La gestion de projet
- Le développement full-stack

---

## 👨‍💻 Auteur

**Nabil KADOURI**

- Développeur orienté back-end
- En montée en compétence sur Python / Django / React
- Objectif : Architecte logiciel


