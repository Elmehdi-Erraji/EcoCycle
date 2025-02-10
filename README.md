### **📌 README.md - EcoCycle Project**

```markdown
# 🌿 EcoCycle - Recyclage Intelligent avec Angular

![EcoCycle Logo](https://yourlogo.com/logo.png)  

## 📖 Description du Projet
**EcoCycle** est une application Angular qui facilite la gestion du recyclage en mettant en relation les particuliers et les collecteurs agréés. Elle permet aux utilisateurs de demander une collecte de déchets recyclables et de recevoir des points de récompense en échange.

## 🏗️ Architecture et Technologies Utilisées
Le projet est développé en **Angular 17+** en utilisant :
- **Standalone Components** pour une architecture plus légère.
- **NgRx** pour la gestion d’état centralisée.
- **RxJS** pour la gestion des événements asynchrones.
- **Tailwind CSS** pour le design responsive.
- **Guards & Interceptors** pour la sécurité.
- **LocalStorage** pour la persistance des données.

---

## 🚀 Fonctionnalités Principales
### 🎯 1. Inscription & Authentification
- Un particulier peut s’inscrire avec :
  - Email et mot de passe.
  - Nom, prénom, adresse et numéro de téléphone.
  - Photo de profil (optionnel).
- L’authentification est **basique** (pas de gestion admin).

### ♻️ 2. Demande de Collecte
- L’utilisateur peut demander une collecte en spécifiant :
  - **Type de déchet** (plastique, verre, métal, papier).
  - **Poids estimé** (minimum 1kg).
  - **Adresse & créneau horaire** (9h00 - 18h00).
  - **Notes supplémentaires** (optionnel).
- Il peut **modifier ou supprimer** ses demandes en attente.

### 🚛 3. Attribution des Collectes aux Collecteurs
- Les collecteurs voient les demandes **disponibles** dans leur ville.
- Un collecteur peut :
  - Accepter une collecte (`occupée`).
  - Confirmer sur place (`en cours`).
  - Valider la collecte (`validée`) ou la rejeter.

### 🎁 4. Système de Récompenses
- Après validation d’une collecte, le particulier reçoit des **points** :
  - Plastique : **2 points/kg**
  - Verre : **1 point/kg**
  - Papier : **1 point/kg**
  - Métal : **5 points/kg**
- Les points peuvent être échangés contre des bons d’achat :
  - **100 points** = Bon de **50 Dh**
  - **200 points** = Bon de **120 Dh**
  - **500 points** = Bon de **350 Dh**

---

## 📂 Structure du Projet

EcoCycle/
│── src/
│   ├── app/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/           # Pages principales
│   │   ├── services/        # Services Angular
│   │   ├── guards/          # Guards pour protéger les routes
│   │   ├── store/           # Gestion d’état avec NgRx
│   │   ├── app.component.ts # Composant principal
│   │   ├── app.routing.ts   # Configuration des routes
│   ├── assets/              # Images et fichiers statiques
│   ├── environments/        # Configurations environnementales
│── angular.json             # Configuration Angular
│── package.json             # Dépendances et scripts
│── README.md                # Documentation
```

---

## 🔗 Dépendances & Librairies
| 📌 Librairie   | 📖 Description |
|----------------|--------------|
| Angular 17+    | Framework principal |
| NgRx           | Gestion d’état |
| RxJS           | Programmation réactive |
| Tailwind CSS   | Design et mise en page |
| Angular Router | Gestion de navigation |
| Angular Forms  | Gestion des formulaires |
| LocalStorage   | Persistance des données |

---

## ⚙️ Installation & Configuration

### 🛠️ 1. Prérequis
- **Node.js** >= 18.0.0
- **Angular CLI** >= 17.0.0
- Un éditeur de code (VS Code recommandé)

### 📥 2. Installation du Projet
```sh
git clone https://github.com/votre-repo/EcoCycle.git
cd EcoCycle
npm install
```

### 🚀 3. Lancer l’Application
```sh
ng serve
```
Puis, ouvrez **http://localhost:4200/** dans votre navigateur.

---

## 🔄 API et Services Angular
### 1️⃣ **Service de Collecte (`CollectService`)**
Gestion des demandes de collecte.

```typescript
@Injectable({ providedIn: 'root' })
export class CollectService {
  constructor(private http: HttpClient) {}

  getCollectRequests(): Observable<CollectRequest[]> {
    return this.http.get<CollectRequest[]>('api/collects');
  }

  addCollectRequest(request: CollectRequest): Observable<void> {
    return this.http.post<void>('api/collects', request);
  }
}
```

### 2️⃣ **Gestion d’État avec NgRx**
Exemple d’un **Reducer** pour stocker les collectes :

```typescript
export const collectReducer = createReducer(
  initialState,
  on(loadCollects, state => ({ ...state, loading: true })),
  on(loadCollectsSuccess, (state, { collects }) => ({ ...state, collects, loading: false }))
);
```

---

## 🔒 Sécurité et Authentification
### **1️⃣ Guards pour Protéger les Routes**
```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): boolean {
    return this.authService.isLoggedIn();
  }
}
```

### **2️⃣ Interceptors pour Ajouter un Token**
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next.handle(cloned);
  }
}
```

---

## 📊 Performances et Optimisation
- **Lazy Loading** pour charger les modules à la demande.
- **OnPush Change Detection** pour réduire les re-renders.
- **Compression et Minification** (`ng build --configuration=production`).

---

## 🔥 Améliorations Futures
- 📍 **Ajout d’une carte interactive pour la collecte.**
- 📲 **Notifications en temps réel pour les collecteurs.**
- 💰 **Marketplace pour échanger des points contre des cadeaux.**

---

## 🤝 Contribution
Tu veux améliorer EcoCycle ? Voici comment contribuer :
1. **Fork** le projet.
2. **Crée une branche** (`git checkout -b feature-nouvelle-fonctionnalité`).
3. **Fais un commit** (`git commit -m "Ajout de la nouvelle fonctionnalité"`).
4. **Push** (`git push origin feature-nouvelle-fonctionnalité`).
5. **Ouvre une Pull Request** sur GitHub.


---

## ⚖️ Licence
**MIT License** - Ce projet est open-source. Utilisation libre sous conditions.

---

🎉 **Merci d'utiliser EcoCycle ! Contribuons ensemble à un monde plus propre !** ♻️🌍🚀
```

**✅ Ce README contient :**
- **Présentation du projet** 🚀
- **Installation & Déploiement** ⚙️
- **Architecture technique & Code** 🏗️
- **Sécurité et performances** 🔒
- **Améliorations et contribution** 💡

📌 **Besoin d’ajouts ou modifications ?** 😃
