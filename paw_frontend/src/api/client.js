/**
 * Client API — mappé sur les endpoints Django REST :
 *
 * AUTH (AllowAny)
 *   POST /api/register/           → { username, email, password, user_type }
 *   POST /api/token/              → { username, password } → { access, refresh }
 *   POST /api/token/refresh/      → { refresh } → { access }
 *
 * PUBLIC
 *   GET  /api/territoires/
 *   GET  /api/animals/
 *   GET  /api/refuges/
 *   GET  /api/wellbeing/?zip_code=&ville=
 *   GET  /api/signalement/?status=&species=&ville=
 *   POST /api/signalement/        → { species, race, description, type_signalement, adresse_approximative, ville }
 *
 * ADOPTANT (JWT IsAdoptant)
 *   CRUD /api/profils/
 *   POST /api/matching/
 *   POST /api/predict/            → { profil_adoptant_id, animal_id }
 *
 * OBSERVATEUR (JWT IsObservateur)
 *   GET  /api/signalements/       → ReadOnly ViewSet
 *   GET  /api/observatoire/       → Dashboard stats
 */

const BASE = "/api";

function getTokens() {
  return {
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  };
}

export function setTokens(access, refresh) {
  localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

async function request(endpoint, options = {}) {
  const { access } = getTokens();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(access && { Authorization: `Bearer ${access}` }),
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    // Try refresh
    const { refresh } = getTokens();
    if (refresh) {
      try {
        const refreshRes = await fetch(`${BASE}/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setTokens(data.access, refresh);
          // Retry original request
          headers.Authorization = `Bearer ${data.access}`;
          const retry = await fetch(`${BASE}${endpoint}`, { ...options, headers });
          if (retry.ok) return retry.json();
        }
      } catch {}
    }
    clearTokens();
    throw new Error("Session expirée");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || `Erreur ${res.status}`);
  }

  return res.json();
}

export const api = {
  // ── Auth ──
  register: (data) =>
    request("/register/", { method: "POST", body: JSON.stringify(data) }),

  login: async (username, password) => {
    const res = await fetch(`${BASE}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Identifiants incorrects");
    return res.json();
  },

  // ── Territoires (Public) ──
  getTerritoires: () => request("/territoires/"),
  getTerritoire: (id) => request(`/territoires/${id}/`),

  // ── Bien-être (Public) ──
  getWellbeing: (params) => {
    const q = new URLSearchParams(params).toString();
    return request(`/wellbeing/?${q}`);
  },

  // ── Animaux (Public) ──
  getAnimals: () => request("/animals/"),
  getAnimal: (id) => request(`/animals/${id}/`),

  // ── Refuges (Public) ──
  getRefuges: () => request("/refuges/"),

  // ── Signalement (Public) ──
  getSignalements: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/signalement/?${q}`);
  },
  createSignalement: (data) =>
    request("/signalement/", { method: "POST", body: JSON.stringify(data) }),

  // ── Profil adoptant (Adoptant) ──
  getProfils: () => request("/profils/"),
  createProfil: (data) =>
    request("/profils/", { method: "POST", body: JSON.stringify(data) }),
  updateProfil: (id, data) =>
    request(`/profils/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteProfil: (id) =>
    request(`/profils/${id}/`, { method: "DELETE" }),

  // ── Matching (Adoptant) ──
  getMatching: () => request("/matching/", { method: "POST" }),

  // ── Predict (Adoptant) ──
  predict: (profilId, animalId) =>
    request("/predict/", {
      method: "POST",
      body: JSON.stringify({ profil_adoptant_id: profilId, animal_id: animalId }),
    }),

  // ── Observatoire (Observateur) ──
  getObservatoire: () => request("/observatoire/"),
};
