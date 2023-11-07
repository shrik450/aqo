import tomllib

class Config:
    def __init__(self, config_path):
        with open(config_path, 'rb') as config_file:
            config_data = tomllib.load(config_file)

        self.database = config_data.get('database', {})
        self._validate_database_config()

    def _validate_database_config(self):
        if self.database is None:
            raise ValueError("Database configuration is missing.")

        required_fields = ['type', 'host', 'port', 'name', 'username', 'password']
        for field in required_fields:
            if field not in self.database:
                raise ValueError(f"Database configuration is missing '{field}' field.")
        if self.database['type'] not in ['mysql', 'postgres']:
            raise ValueError("Database type must be 'mysql' or 'postgres'.")
        try:
            port = int(self.database['port'])
            if port <= 0 or port > 65535:
                raise ValueError("Port number must be between 1 and 65535.")
        except ValueError:
            raise ValueError("Database 'port' must be an integer.")

        if not isinstance(self.database['host'], str) or not self.database['host']:
            raise ValueError("Database 'host' must be a non-empty string.")

    @property
    def db_type(self):
        return self.database.get('type')

    @property
    def db_host(self):
        return self.database.get('host')

    @property
    def db_port(self):
        return self.database.get('port')

    @property
    def db_name(self):
        return self.database.get('name')

    @property
    def db_username(self):
        return self.database.get('username')

    @property
    def db_password(self):
        return self.database.get('password')
