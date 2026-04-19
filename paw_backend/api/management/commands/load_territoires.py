from django.core.management.base import BaseCommand
from api.models import Territoire
import pandas as pd
import os


class Command(BaseCommand):
    help = "Charge les territoires (score bien-etre + coordonnees) depuis paw_data/donnees_propres/villes_scored_final.csv"

    NOTE_TO_RISK = {
        "A": 20.0,
        "B": 40.0,
        "C": 60.0,
        "D": 75.0,
        "E": 90.0,
    }

    def handle(self, *args, **options):
        self.stdout.write("Chargement des territoires...")

        csv_path = os.path.join(
            os.path.dirname(__file__),
            "../../../../paw_data/donnees_propres/villes_scored_final.csv",
        )

        if not os.path.exists(csv_path):
            self.stderr.write(self.style.ERROR(f"Fichier introuvable: {csv_path}"))
            return

        df = pd.read_csv(csv_path)

        required_cols = {
            "code_postal",
            "nom_commune",
            "nom_departement",
            "latitude",
            "longitude",
            "note_bien_etre",
        }
        missing = required_cols - set(df.columns)
        if missing:
            self.stderr.write(
                self.style.ERROR(
                    f"Colonnes manquantes dans le CSV: {', '.join(sorted(missing))}"
                )
            )
            return

        created_count = 0
        updated_count = 0

        for _, row in df.iterrows():
            zip_code = str(row.get("code_postal", "")).strip().zfill(5)
            if not zip_code.isdigit() or len(zip_code) != 5:
                continue

            # En pratique (IDF), le departement est bien derive du code postal.
            department_code = zip_code[:2]

            ville = str(row.get("nom_commune", "")).strip()
            if not ville:
                continue

            note = str(row.get("note_bien_etre", "C")).strip().upper()
            if note not in self.NOTE_TO_RISK:
                note = "C"

            risk_index = self.NOTE_TO_RISK[note]

            nb_vets = int(float(row.get("nb_vets", 0) or 0))
            nb_parcs = int(float(row.get("nb_parcs", 0) or 0))
            nb_forets = int(float(row.get("nb_forets", 0) or 0))
            nb_parcs_canins = int(float(row.get("nb_parcs_canins", 0) or 0))
            nb_refuges = int(float(row.get("nb_refuges", 0) or 0))

            osm_details = {
                "vets": nb_vets,
                "parks": nb_parcs,
                "forests": nb_forets,
                "dog_parks": nb_parcs_canins,
                "shelters": nb_refuges,
            }

            score_factors = []
            if nb_vets > 0:
                score_factors.append("Presence de veterinaires")
            if nb_parcs + nb_forets > 0:
                score_factors.append("Acces aux espaces verts")
            if nb_refuges > 0:
                score_factors.append("Presence de refuges")
            if not score_factors:
                score_factors.append("Peu d'infrastructures animales recensees")

            defaults = {
                "department_code": department_code,
                "ville": ville,
                "latitude": float(row.get("latitude", 0.0) or 0.0),
                "longitude": float(row.get("longitude", 0.0) or 0.0),
                "income_level": 0.0,
                "unemployment_rate": 0.0,
                "sec_home_ratio": 0.0,
                "osm_details": osm_details,
                "risk_index": risk_index,
                "well_being_score": note,
                "score_factors": score_factors,
            }

            obj, created = Territoire.objects.update_or_create(
                zip_code=zip_code,
                defaults=defaults,
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        total = created_count + updated_count
        self.stdout.write(
            self.style.SUCCESS(
                f"OK Territoires traites: {total} (crees: {created_count}, maj: {updated_count})"
            )
        )
