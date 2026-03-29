// ── Animaux (matches Animal model) ──
export const mockAnimals = [
  { id:1, name:"Luna", species:"CAT", race:"Européen", age:3, age_category:"adult", taille:"S", energy_need:3, social_compatibility:true, kid_friendly:true, needs_garden:false, description:"Luna est une chatte douce et câline qui adore se blottir sur les genoux. Très sociable.", is_adoptable:true, photo:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop", refuge:1, refuge_name:"Refuge des Étoiles", match_score:97 },
  { id:2, name:"Oscar", species:"DOG", race:"Golden Retriever", age:2, age_category:"adult", taille:"L", energy_need:8, social_compatibility:true, kid_friendly:true, needs_garden:true, description:"Oscar est un Golden plein de vie. Il adore les longues promenades en forêt.", is_adoptable:true, photo:"https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop", refuge:1, refuge_name:"Refuge des Étoiles", match_score:88 },
  { id:3, name:"Milo", species:"CAT", race:"Siamois", age:1, age_category:"puppy", taille:"S", energy_need:6, social_compatibility:false, kid_friendly:false, needs_garden:false, description:"Milo est un jeune siamois indépendant. Il préfère être le seul animal de la maison.", is_adoptable:true, photo:"https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop", refuge:2, refuge_name:"SPA Île-de-France", match_score:74 },
  { id:4, name:"Bella", species:"DOG", race:"Berger Australien", age:4, age_category:"adult", taille:"M", energy_need:9, social_compatibility:true, kid_friendly:true, needs_garden:true, description:"Bella est incroyablement intelligente et loyale. Elle a besoin de stimulation mentale.", is_adoptable:true, photo:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop", refuge:2, refuge_name:"SPA Île-de-France", match_score:82 },
  { id:5, name:"Noisette", species:"CAT", race:"Maine Coon", age:5, age_category:"adult", taille:"M", energy_need:4, social_compatibility:true, kid_friendly:true, needs_garden:false, description:"Noisette est une grande Maine Coon majestueuse et douce. Parfaite en appartement.", is_adoptable:true, photo:"https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop", refuge:3, refuge_name:"Les Amis des Bêtes", match_score:91 },
  { id:6, name:"Rex", species:"DOG", race:"Labrador", age:7, age_category:"senior", taille:"L", energy_need:4, social_compatibility:true, kid_friendly:true, needs_garden:false, description:"Rex est un labrador senior au tempérament doux. Calme et affectueux.", is_adoptable:true, photo:"https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop", refuge:3, refuge_name:"Les Amis des Bêtes", match_score:85 },
];

// ── Territoires (matches Territoire model) ──
export const mockTerritoires = [
  { id:1, zip_code:"75011", department_code:"75", ville:"Paris 11e", income_level:28500, unemployment_rate:8.2, sec_home_ratio:5.1, osm_details:{vets:12,parks:8,forests:2,shelters:2,dog_parks:3}, risk_index:42, well_being_score:"B", score_factors:["Forte densité vétérinaire","Nombreux espaces verts","Risque moyen d'abandon saisonnier"] },
  { id:2, zip_code:"13001", department_code:"13", ville:"Marseille 1er", income_level:21200, unemployment_rate:12.5, sec_home_ratio:3.8, osm_details:{vets:4,parks:3,forests:1,shelters:1,dog_parks:1}, risk_index:68, well_being_score:"D", score_factors:["Peu de vétérinaires","Taux de chômage élevé","Faible accès aux services animaliers"] },
  { id:3, zip_code:"69003", department_code:"69", ville:"Lyon 3e", income_level:26800, unemployment_rate:7.1, sec_home_ratio:4.5, osm_details:{vets:9,parks:6,forests:3,shelters:3,dog_parks:2}, risk_index:35, well_being_score:"A", score_factors:["Excellente couverture vétérinaire","Nombreux parcs et refuges","Faible taux de chômage"] },
  { id:4, zip_code:"33000", department_code:"33", ville:"Bordeaux", income_level:25100, unemployment_rate:9.0, sec_home_ratio:6.2, osm_details:{vets:7,parks:5,forests:2,shelters:2,dog_parks:1}, risk_index:51, well_being_score:"C", score_factors:["Résidences secondaires élevées","Risque saisonnier modéré","Bonne couverture vétérinaire"] },
];

// ── Refuges (matches Refuge model) ──
export const mockRefuges = [
  { id:1, name:"Refuge des Étoiles", email:"contact@refugedesetoiles.fr", address:"12 Rue de la Liberté", city:"Paris", latitude:48.8566, longitude:2.3522 },
  { id:2, name:"SPA Île-de-France", email:"spa-idf@spa.fr", address:"45 Avenue des Champs", city:"Versailles", latitude:48.8049, longitude:2.1204 },
  { id:3, name:"Les Amis des Bêtes", email:"contact@amisdesbetes.org", address:"8 Boulevard du Parc", city:"Lyon", latitude:45.764, longitude:4.8357 },
];

// ── Signalements (matches AnimalSignaled model) ──
export const mockSignalements = [
  { id:1, species:"DOG", race:"Inconnu", description:"Chien errant trouvé dans un parc", type_signalement:"FOUND", status:"SIGNALED", adresse_approximative:"Parc de Bercy", territoire_name:"Paris 12e", territoire_zip:"75012", created_at:"2026-03-25T14:30:00Z", latitude:48.841, longitude:2.388 },
  { id:2, species:"CAT", race:"Européen", description:"Chat abandonné devant un immeuble", type_signalement:"ABANDON", status:"RESCUED", adresse_approximative:"Rue Paradis", territoire_name:"Marseille 6e", territoire_zip:"13006", created_at:"2026-03-24T10:00:00Z", latitude:43.287, longitude:5.381 },
  { id:3, species:"DOG", race:"Berger", description:"Chien maltraité signalé par un voisin", type_signalement:"FOUND", status:"ADOPTABLE", adresse_approximative:"Quartier Gerland", territoire_name:"Lyon 7e", territoire_zip:"69007", created_at:"2026-03-23T16:45:00Z", latitude:45.748, longitude:4.842 },
  { id:4, species:"CAT", race:"", description:"Chat errant très maigre vu plusieurs fois", type_signalement:"FOUND", status:"SIGNALED", adresse_approximative:"Place de la Victoire", territoire_name:"Bordeaux", territoire_zip:"33000", created_at:"2026-03-26T09:15:00Z", latitude:44.837, longitude:-0.579 },
  { id:5, species:"DOG", race:"Labrador croisé", description:"Je ne peux plus garder mon chien, problèmes de santé", type_signalement:"ABANDON", status:"RESCUED", adresse_approximative:"Centre-ville", territoire_name:"Nantes", territoire_zip:"44000", created_at:"2026-03-22T11:30:00Z", latitude:47.218, longitude:-1.554 },
  { id:6, species:"CAT", race:"Persan", description:"Mon chat que je ne peux plus garder suite à un déménagement", type_signalement:"ABANDON", status:"SIGNALED", adresse_approximative:"Place du Capitole", territoire_name:"Toulouse", territoire_zip:"31000", created_at:"2026-03-27T08:00:00Z", latitude:43.604, longitude:1.444 },
  { id:7, species:"DOG", race:"Petit croisé", description:"Chien errant vu près de la gare", type_signalement:"FOUND", status:"ADOPTABLE", adresse_approximative:"Gare Lille-Flandres", territoire_name:"Lille", territoire_zip:"59000", created_at:"2026-03-21T15:20:00Z", latitude:50.629, longitude:3.057 },
];

// ── Quiz questions (aligned with ProfilAdoptant fields) ──
export const quizQuestions = [
  { id:"habitat", field:"type_habitat", question:"Quel est votre type de logement ?", description:"Cela nous aide à recommander un animal adapté à votre espace.", type:"card", options:[ {value:"APT",label:"Appartement",icon:"Building2"}, {value:"HOUSE",label:"Maison",icon:"Home"}, {value:"FARM",label:"Ferme / Rural",icon:"Trees"} ] },
  { id:"garden", field:"has_garden", question:"Avez-vous un jardin ou un espace extérieur ?", description:"Certains animaux ont besoin d'espace pour se dépenser.", type:"card", options:[ {value:true,label:"Oui",icon:"Flower2"}, {value:false,label:"Non",icon:"Square"} ] },
  { id:"activity", field:"niv_activite", question:"Quel est votre niveau d'activité physique ?", description:"Nous trouverons un compagnon qui match votre rythme.", type:"card", options:[ {value:1,label:"Tranquille",icon:"Armchair"}, {value:2,label:"Modéré",icon:"Footprints"}, {value:3,label:"Très actif",icon:"Bike"} ] },
  { id:"children", field:"has_children", question:"Y a-t-il des enfants dans votre foyer ?", description:"La compatibilité avec les enfants est essentielle.", type:"card", options:[ {value:true,label:"Oui",icon:"Baby"}, {value:false,label:"Non",icon:"User"} ] },
  { id:"other_pets", field:"has_pets", question:"Avez-vous d'autres animaux ?", description:"Pour assurer une bonne cohabitation.", type:"multi", options:[ {value:"none",label:"Aucun",icon:"Circle"}, {value:"dogs",label:"Chien(s)",icon:"Dog"}, {value:"cats",label:"Chat(s)",icon:"Cat"}, {value:"rodents",label:"Rongeurs",icon:"Rabbit"}, {value:"birds",label:"Oiseaux",icon:"Bird"} ] },
  { id:"time", field:"temps_dispo", question:"Combien de temps par jour pouvez-vous consacrer ?", description:"Promenades, jeux, câlins… chaque animal a ses besoins.", type:"card", options:[ {value:1,label:"< 1 heure",icon:"Clock"}, {value:2,label:"1 à 3 heures",icon:"Clock3"}, {value:4,label:"3 heures +",icon:"Clock9"} ] },
  { id:"experience", field:"niv_experience", question:"Quelle est votre expérience avec les animaux ?", description:"Pas de jugement ! Chaque niveau a son compagnon idéal.", type:"card", options:[ {value:1,label:"Débutant",icon:"Sprout"}, {value:2,label:"Intermédiaire",icon:"Leaf"}, {value:3,label:"Expérimenté",icon:"TreeDeciduous"} ] },
  { id:"species_pref", field:null, question:"Quel type d'animal recherchez-vous ?", description:"Chien ou chat ? Ou les deux !", type:"card", options:[ {value:"DOG",label:"Chien",icon:"Dog"}, {value:"CAT",label:"Chat",icon:"Cat"}, {value:"BOTH",label:"Les deux",icon:"Heart"} ] },
];

// ── Dashboard KPIs ──
export const mockKpis = { signalements_semaine:23, signalements_variation:12, taux_prise_en_charge:67, taux_variation:5, adoptions_mois:42, adoptions_variation:-3, animaux_en_attente:156 };
export const mockMonthlyStats = { labels:["Oct","Nov","Déc","Jan","Fév","Mar"], signalements:[45,52,38,61,48,55], adoptions:[22,28,31,25,33,42] };
export const mockSpeciesBreakdown = { labels:["Chiens","Chats"], data:[58,42] };
