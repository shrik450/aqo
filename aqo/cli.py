import argparse
import readline  # noqa: F401

from cmd import Cmd

from aqo.config import Config
from aqo.db import Database


class AQOShell(Cmd):
    prompt = "aqo>>> "
    intro = "Welcome to the AQO shell. Type help or ? to list commands.\n"

    def __init__(self, config_file_path: str):
        super().__init__()
        self.config = Config(config_file_path)
        self.intro = (
            f"Welcome to the AQO shell. Type help or ? to list commands.\n"
            f"Config points to databse '{self.config.db_name}' on {self.config.db_type} at {self.config.db_host}:{self.config.db_port}.\n"
        )

    def default(self, args):
        if args == "EOF":
            return self.do_quit(args)

        cursor = self.database.cursor()
        cursor.execute(args)
        results = list(cursor.fetchall())
        cursor.close()
        print(f"{len(results)} rows returned.")
        for row in results:
            print(row)

    def do_help(self, args):
        """List available commands with "help" or detailed help with "help cmd"."""
        print("Use this shell to interact with your database, and to run queries.")
        print("Just enter a SQL query to get started.")
        super().do_help(args)

    def do_quit(self, _):
        """Quit the shell."""
        return True

    def cmdloop(self, _=None):
        """
        Overrides the default cmdloop to catch KeyboardInterrupts.

        This ensures that ^C behaviour is similar to other shells, including the
        default Python shell.
        """

        print(self.intro)
        self.database = Database(self.config)
        print("Connected to database.")
        while True:
            try:
                super(AQOShell, self).cmdloop(intro="")
                break
            except KeyboardInterrupt:
                print("^C")


def main():
    parser = argparse.ArgumentParser(description="AQO Shell")
    parser.add_argument("config_file_path", type=str, help="path to the config file")
    args = parser.parse_args()

    shell = AQOShell(args.config_file_path)
    shell.cmdloop()
