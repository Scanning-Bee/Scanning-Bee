from django.core.management.commands.migrate import Command as MigrateCommand
from django.core.management import call_command

import os


class Command(MigrateCommand):
    def handle(self, *args, **options):
        # First, run the original migrate command
        super().handle(*args, **options)

        # Define your fixtures list
        fixtures = os.listdir("./scanning_bee_app/fixtures")
        fixtures.sort()

        # Then, load each fixture
        for fixture in fixtures:
            self.stdout.write(self.style.SUCCESS(f'Loading fixture: {fixture}'))
            call_command('loaddata', fixture)

        self.stdout.write(self.style.SUCCESS('All fixtures have been loaded.'))
