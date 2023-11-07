import argparse
import readline  # noqa: F401

from cmd import Cmd
from tabulate import tabulate

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

        try:
            results, headers, rowcount, query_time = self.database.query(args)
            max_results = 50
            results_as_list = []

            for row in results:
                results_as_list.append(list(row))
                if len(results_as_list) >= max_results:
                    break
            results = results_as_list

            print(f"{rowcount} rows returned in {query_time} seconds.")
            if rowcount > max_results:
                print(f"Showing first {max_results} results.")
            print(tabulate(results, headers=headers, tablefmt="rounded_outline"))
        except Exception as e:
            print("Error: Query failed to run. Details of error: ")
            print(e)

    def do_help(self, args):
        """List available commands with "help" or detailed help with "help cmd"."""

        if len(args) == 0:
            print("Use this shell to interact with your database, and to run queries.")
            print("Just enter a SQL query to get started.")

        super().do_help(args)

    def do_schema(self, _):
        """Show the database schema."""
        print(self.database.schema)

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
    parser = argparse.ArgumentParser(description="AQO: AI Query Optimizer")
    parser.add_argument("config_file_path", type=str, help="path to the config file")
    args = parser.parse_args()

    shell = AQOShell(args.config_file_path)
    shell.cmdloop()
