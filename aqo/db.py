from __future__ import annotations
from functools import cached_property
import subprocess
import time

import mysql.connector
import psycopg2

from aqo.config import Config

from typing import TYPE_CHECKING, Iterable, Tuple

if TYPE_CHECKING:
    from _typeshed.dbapi import DBAPIConnection, DBAPICursor


class Database:
    """
    A wrapper around a database connection, which provides some convenience
    methods for interacting with the database. The methods in this class can be
    used irrespective of the database type.
    """

    def __init__(self, config: Config):
        self.config = config
        self.conn = self._create_connection()

    def _create_connection(self) -> DBAPIConnection:
        db_type = self.config.db_type
        if db_type == "mysql":
            conn = mysql.connector.connect(
                host=self.config.db_host,
                port=self.config.db_port,
                user=self.config.db_username,
                password=self.config.db_password,
                database=self.config.db_name,
            )
            conn.cursor().execute("SET profiling = 1;")
            return conn  # type: ignore

        elif db_type == "postgres":
            return psycopg2.connect(
                host=self.config.db_host,
                port=self.config.db_port,
                user=self.config.db_username,
                password=self.config.db_password,
                dbname=self.config.db_name,
            )  # type: ignore
        else:
            raise ValueError(f"Unsupported database type: {db_type}")

    def cursor(self) -> DBAPICursor:
        return self.conn.cursor()

    def query(self, query: str) -> Tuple[Iterable, list[str], int, float]:
        """
        Run a query on the DB and return the results, column names, number of
        rows affected and the time taken.
        """

        cursor = self.cursor()
        start_time = time.monotonic()
        cursor.execute(query)
        end_time = time.monotonic()
        if cursor.description is not None:
            headers = [column[0] for column in cursor.description]
            results = cursor.fetchall()
            cursor.close()

            return results, headers, cursor.rowcount, end_time - start_time
        else:
            cursor.close()
            return [], [], 0, end_time - start_time

    def explain_query(self, query: str) -> str:
        """
        Run an EXPLAIN query on the DB and return the output.
        """

        cursor = self.cursor()
        cursor.execute(f"EXPLAIN ANALYZE {query}")
        explain_output = cursor.fetchall()
        cursor.close()

        return "\n".join([row[0] for row in explain_output])

    @cached_property
    def schema(self) -> str:
        """
        Return the schema of the database as a string. Each dat
        """

        host = self.config.db_host
        port = self.config.db_port
        password = self.config.db_password
        user = self.config.db_username
        db_name = self.config.db_name

        if self.config.db_type == "mysql":
            command = f"mysqldump -h {host} -u {user} -p{password} --no-data {db_name}"
        else:
            command = f"PGPASSWORD={password} pg_dump --host={host} --port={port} --username={user} --schema-only {db_name}"

        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        stdout, stderr = process.communicate()

        if process.returncode != 0:
            raise Exception(f"Error in mysqldump: {stderr.decode()}")

        return stdout.decode()

    def commit(self):
        self.conn.commit()

    def close(self):
        self.conn.close()
