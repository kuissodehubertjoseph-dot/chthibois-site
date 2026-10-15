# Rapport de production — clone statique Chthibois

Site source : https://chthibois.fr/ (WordPress + Elementor + WooCommerce)
Livrable : `chthibois-site/` — site statique HTML/CSS/JS vanilla, 19 pages, autonome (aucune dépendance à chthibois.fr).

## 1. Pages livrées (19)

| Fichier | Contenu |
|---|---|
| index.html | Accueil |
| bois-de-chauffage.html | Catégorie bois de chauffage |
| stere-vrac.html | Stère de bois dur en vrac |
| bois-palette.html | Bois rangé sur palette (box) |
| buches-compressees.html | Bûches compressées (+ FAQ complète) |
| pellets.html | Catégorie pellets |
| pellets-palette.html | Pellets à la palette |
| pellets-sac.html | Pellets au sac / drive |
| allumes-feux.html | Petit bois d'allumage |
| animalerie.html | Croquettes chien/chat (contenu réel trouvé sur le site source) |
| notre-entreprise.html | Présentation + section `#engagements` |
| equipe.html | L'équipe (5 portraits + photo de groupe, lightbox) |
| materiel-forestier.html | Matériel forestier (10 machines, galerie + lightbox) |
| espace-presse.html | Espace presse (mailto: réels) |
| grossiste.html | Grossiste pour professionnels |
| contact.html | Formulaire de contact avec validation JS |
| mentions-legales.html | Mentions légales |
| cgv.html | CGV |
| confidentialite.html | Politique de confidentialité |

Toutes les pages partagent le même en-tête (menu avec sous-menus), pied de page et bannière cookies, générés par un script Python commun (`raw/build.py` + `raw/pages.py`) pour garantir la cohérence — ces scripts de génération sont conservés dans `raw/` à titre d'outillage, ils ne font pas partie du site livré.

## 2. Images

**82 images réelles** téléchargées depuis chthibois.fr dans `assets/images/` (dédupliquées par variante de plus haute résolution disponible, ~19 Mo au total). Extraction faite par parsing du HTML brut de toutes les pages listées dans la mission (attributs `src`, `data-src`, `srcset`, `data-lazy-src`), puis sélection automatique de la meilleure résolution par image de base.

Images prioritaires listées dans la mission : **toutes récupérées avec succès**, y compris :
- Photo portes ouvertes (accueil)
- Bois d'allumage, box bois, palette bûches densifiées, pellets DINplus
- Équipe complète, palette granulés, bois stocké, chèque énergie

Portraits équipe (5/5 récupérés, résolution `-scaled`) :
- Thierry (dirigeant), Angélique (dirigeante), Maxence (chef de cour), Duncan (manutentionnaire), Tetiana (manutentionnaire), + photo de groupe complète

Matériel forestier (10 machines illustrées) :
- FEV 1200, Xyloflam 200/250, Tajfun RCA 480, Tajfun RCA 400, la grue, le Manitou, le Clark, robot de filmage MASTER 80 FRD, camions de livraison, tronçonneuse Stihl MS271

Logo entreprise haute résolution : récupéré (`logo-chthibois.webp`, version 2026/02).

**2 images introuvables (404 sur le serveur source)** — non critiques :
- `Logo-Chthibois-entreprise-de-bois-de-chauffage-...-hauts-de-france.webp` (2023/04) — ancienne version du logo, remplacée avantageusement par la version 2026 haute résolution déjà récupérée.
- `group-of-volunteer-planting-...jpg` (photo de banque d'images décorative pour un article de blog) — non utilisée dans les 19 pages du livrable, aucun impact.

Aucun placeholder "photo à intégrer" n'a été nécessaire : toutes les images utilisées dans les 19 pages du livrable sont réelles et présentes sur disque.

## 3. Corrections obligatoires appliquées (étape 3 du brief)

1. **Attribut `alt` non vide et pertinent sur toutes les images** — appliqué systématiquement (généré par le script pour chaque image, alt descriptif contextuel). Vérifié par script de validation : 0 image sans alt.
2. **Lien "Nos engagements"** → pointe partout vers `notre-entreprise.html#engagements`, section réelle avec 5 piliers RSE réels : bois PEFC 100% Hauts-de-France, revalorisation des déchets de bois (combustible chaudière, litière animale), partenariat avec l'**ESAT de Ruitz** (inclusion professionnelle), 650 haies à baies plantées, stratégie RH inclusive (partenariat France Travail, prix régional RSE).
3. **Numéro de téléphone unique** : `06 76 99 46 50` partout (topbar, header, footer, mentions légales, contact). L'ancien numéro incorrect `03 66 76 96 50` (présent partout sur le site source) a été éliminé — vérifié par script, 0 occurrence restante.
4. **Adresse unique** : `76 rue de Caestre, 59190 Hondeghem` partout — vérifié par script, aucune occurrence de l'ancienne adresse.
5. **Espace presse** : les 4 boutons "Télécharger" (dossier de presse, photos, logos, fiche d'identité) et le bouton "Contacter le service presse" pointent vers de vrais `mailto:chthibois@hotmail.com` avec sujet pré-rempli — plus aucun lien `#`.
6. **Menu cohérent sur les 19 pages**, incluant "Animalerie" partout (contenu réel de croquettes chien/chat trouvé sur le site source, donc conservé uniformément dans le menu et le footer).

## 4. Adaptations par rapport à la liste initiale du brief

- **Adresse e-mail réelle** : `chthibois@hotmail.com` (déchiffrée depuis l'obfuscation Cloudflare `data-cfemail` du site source), utilisée pour tous les `mailto:`.
- **Partenariat ESAT** : le site source mentionne l'**ESAT de Ruitz** (et non "ESAT d'Isbergues" suggéré dans le brief) ; le contenu réel a été conservé fidèlement plutôt que d'inventer un partenariat différent.
- **GRETA** : aucune mention de stagiaires du GRETA trouvée sur le site source ; en lieu et place, le contenu réel évoque un partenariat avec **France Travail** (immersions, recrutement inclusif) et un prix régional RSE "Employeurs, démarquez-vous" — conservé tel quel plutôt qu'inventé.
- **Animalerie** : contenu réel et substantiel trouvé sur le site source (croquettes chien/chat, prix réels) → page créée et intégrée uniformément au menu, comme demandé par le brief en cas de contenu réel existant.
- **URLs des pages** renommées en slugs plus courts et cohérents avec la structure demandée (ex. `bois-de-chauffage-nord` → `bois-de-chauffage.html`, `livraison-stere-de-bois-dur` → `stere-vrac.html`, `boxs-de-bois-de-chauffage` → `bois-palette.html`, etc.) conformément à la liste de fichiers imposée à l'étape 2.
- **Blog** : présent dans le menu du site source mais absent de la structure de pages demandée à l'étape 2 — non reproduit en page dédiée, conformément à la liste de livrables fournie.
- **Avis clients** : uniquement les avis réels trouvés sur le site source ont été repris (5 avis Google sur l'accueil + 3 avis sur la page stère-vrac), aucun avis inventé.
- **Prix produits** : tous repris tels quels depuis le HTML source (aucun prix inventé).

## 5. Identité visuelle et interactivité

- Palette : brun bois profond (#3a2a1e), rouge braise (#b8451f), vert forêt (#2c3c2c), fond crème cassé (#f3ead9/#faf6ec), accent or (#c08a35) — pas de dégradé orange-crème générique.
- Typographie : Fraunces (titres, serif à caractère) + Work Sans (texte courant), chargées via Google Fonts avec piles de secours.
- Menu sticky avec changement d'apparence au scroll (ombre + fond).
- Menu mobile hamburger fonctionnel avec panneau plein écran animé (bug "disparaît sous 860px" corrigé — un bug de containing block CSS causé par `backdrop-filter` sur le header a été identifié et corrigé pendant les tests).
- Sous-menus avec transition douce (max-height/opacity, pas de display:none sec).
- Animations d'apparition au scroll via IntersectionObserver (`.reveal`), désactivées si `prefers-reduced-motion`.
- Effets de survol sur cartes produits/catégories (élévation, zoom image discret).
- Galerie photo + lightbox accessible (focus, échap) sur `equipe.html` et `materiel-forestier.html`.
- Compteurs animés sur `espace-presse.html` (chiffres réels : 7 salariés, 404 avis Google, 30km de rayon de livraison — aucun chiffre inventé).
- Formulaire de contact avec validation temps réel (bordures, messages d'erreur) et envoi simulé en JS.
- Carrousel d'avis clients sur l'accueil (avis réels du site source).
- `loading="lazy"` sur les images secondaires, focus clavier visible, contrastes vérifiés.

## 6. Vérifications techniques effectuées

Un script de validation (`raw/validate.py`) a contrôlé automatiquement les 19 pages livrées :
- 0 lien interne cassé
- 0 image manquante sur disque, 0 image pointant encore vers chthibois.fr
- 0 balise `<img>` sans `alt`
- 0 balise HTML non fermée (vérification par pile d'ouverture/fermeture)
- 0 occurrence de l'ancien numéro de téléphone ou de l'ancienne adresse

Test visuel effectué via un serveur HTTP local (le rendu direct en `file://` ne charge pas les ressources relatives dans l'environnement de test, un serveur local a donc été utilisé pour la vérification) : accueil, catégorie pellets et menu mobile confirmés fonctionnels et fidèles à la direction artistique voulue.
