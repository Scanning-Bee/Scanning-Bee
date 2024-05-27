from django.core.management.commands.migrate import Command as MigrateCommand
from django.core.management import call_command
import os
import json
from random import randint
from scanning_bee_app.models import Cell, Frame  # Replace with the actual model import

MAX_I_INDEX = 108
MAX_J_INDEX = 134

class Command(MigrateCommand):
    def handle(self, *args, **options):
        # First, run the original migrate command
        super().handle(*args, **options)

        self.generate_initial_cells()

        # Define your fixtures list
        fixtures = os.listdir("./scanning_bee_app/fixtures")
        fixtures.sort()

        # Load each fixture except the large one
        for fixture in fixtures:
            if fixture == '0005_initial_cells.json':
                self.stdout.write(self.style.SUCCESS(f'Skipping large fixture: {fixture}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Loading fixture: {fixture}'))
                call_command('loaddata', fixture)

        # Load the large fixture using bulk insertion
        self.load_large_fixture('./scanning_bee_app/fixtures/0005_initial_cells.json')

        self.stdout.write(self.style.SUCCESS('All fixtures have been loaded.'))

    def generate_initial_cells(self):
        fixture_path = './scanning_bee_app/fixtures/0005_initial_cells.json'

        if not os.path.exists(fixture_path):
            self.stderr.write(self.style.WARNING(f'Generating fixture for {MAX_I_INDEX}x{MAX_J_INDEX} cells.'))
            cells = []
            pk = 1
            for i in range(1, MAX_I_INDEX + 1):
                for j in range(1, MAX_J_INDEX + 1):
                    cell = {
                        "model": "scanning_bee_app.cell",  # Replace with the actual app name
                        "pk": pk,
                        "fields": {
                            "i_index": i,
                            "j_index": j,
                            "frame": 1  # Assume that the frame with pk=1 exists
                        }
                    }
                    cells.append(cell)
                    pk += 1

            os.makedirs(os.path.dirname(fixture_path), exist_ok=True)
            with open(fixture_path, 'w') as f:
                json.dump(cells, f, indent=4)

            self.stdout.write(self.style.SUCCESS(f'Fixture generated at: {fixture_path}'))
        else:
            # check if the fixtures max i and j index are the same as the current max i and j index, if not delete the fixture and regenerate it
            with open(fixture_path) as f:
                data = json.load(f)
                max_i_index = max(cell['fields']['i_index'] for cell in data)
                max_j_index = max(cell['fields']['j_index'] for cell in data)
                if max_i_index != MAX_I_INDEX or max_j_index != MAX_J_INDEX:
                    self.stderr.write(self.style.WARNING(f'Initial cell fixtures are not correct, generating fixture for {MAX_I_INDEX}x{MAX_J_INDEX} cells.'))
                    os.remove(fixture_path)
                    self.generate_initial_cells()


    def load_large_fixture(self, fixture_path):
        def check_random_cells_exist():
            for _ in range(5):  # Check 5 random cells
                i_index = randint(1, MAX_I_INDEX)
                j_index = randint(1, MAX_J_INDEX)
                if not Cell.objects.filter(i_index=i_index, j_index=j_index, frame_id=1).exists():
                    return False
            return True

        if check_random_cells_exist():
            self.stdout.write(self.style.SUCCESS('Random cells exist, skipping bulk load of large fixture.'))
            return
        
        self.stderr.write(self.style.WARNING(f'Loading fixture into database for {MAX_I_INDEX}x{MAX_J_INDEX} cells. This may take a while...'))

        with open(fixture_path) as f:
            data = json.load(f)
            frames = {frame.pk: frame for frame in Frame.objects.all()}
            cells = []
            for entry in data:
                i_index = entry['fields']['i_index']
                j_index = entry['fields']['j_index']
                frame = frames[entry['fields']['frame']]
                if not Cell.objects.filter(i_index=i_index, j_index=j_index, frame=frame).exists():
                    cells.append(Cell(i_index=i_index, j_index=j_index, frame=frame))
            Cell.objects.bulk_create(cells, batch_size=1000)  # Adjust batch_size as needed
        self.stdout.write(self.style.SUCCESS(f'Large fixture loaded from: {fixture_path}'))
