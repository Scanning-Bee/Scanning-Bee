from django.core.management.commands.migrate import Command as MigrateCommand
from django.core.management import call_command

import os
import json

class Command(MigrateCommand):
    def handle(self, *args, **options):
        # First, run the original migrate command
        super().handle(*args, **options)

        self.generate_initial_cells()

        # Define your fixtures list
        fixtures = os.listdir("./scanning_bee_app/fixtures")
        fixtures.sort()

        # Then, load each fixture
        for fixture in fixtures:
            self.stdout.write(self.style.SUCCESS(f'Loading fixture: {fixture}'))
            call_command('loaddata', fixture)

        self.stdout.write(self.style.SUCCESS('All fixtures have been loaded.'))

    def generate_initial_cells(self):
        cells = []
        pk = 1
        for i in range(1, 117):
            for j in range(1, 66):
                cell = {
                    "model": "scanning_bee_app.cell",  # Replace with the actual app name
                    "pk": pk,
                    "fields": {
                        "i_index": i,
                        "j_index": j,
                        "frame": 1
                    }
                }
                cells.append(cell)
                pk += 1

        fixture_path = './scanning_bee_app/fixtures/0005_initial_cells.json'
        os.makedirs(os.path.dirname(fixture_path), exist_ok=True)
        with open(fixture_path, 'w') as f:
            json.dump(cells, f, indent=4)

        self.stdout.write(self.style.SUCCESS(f'Fixture generated at: {fixture_path}'))

