from __future__ import annotations

import mysql.connector
import psycopg2

from aqo.config import Config

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from _typeshed.dbapi import DBAPIConnection, DBAPICursor

class Database:
    conn: DBAPIConnection

    def __init__(self, config: Config):
        self.config = config
        self.conn = self._create_connection()

    def _create_connection(self) -> DBAPIConnection:
        db_type = self.config.db_type
        if db_type == 'mysql':
            return mysql.connector.connect(
                host=self.config.db_host,
                port=self.config.db_port,
                user=self.config.db_username,
                password=self.config.db_password,
                database=self.config.db_name
            ) # type: ignore
        elif db_type == 'postgres':
            return psycopg2.connect(
                host=self.config.db_host,
                port=self.config.db_port,
                user=self.config.db_username,
                password=self.config.db_password,
                dbname=self.config.db_name
            ) # type: ignore
        else:
            raise ValueError(f"Unsupported database type: {db_type}")

    def cursor(self) -> DBAPICursor:
        return self.conn.cursor()

    def commit(self):
        self.conn.commit()

    def close(self):
        self.conn.close()
