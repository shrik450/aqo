import tomllib


class Config:
    def __init__(self, config_path):
        with open(config_path, "rb") as config_file:
            config_data = tomllib.load(config_file)

        self.database = config_data.get("database", {})
        self.ai_model = config_data.get("ai_model", {})
        self._validate_database_config()
        self._validate_ai_model_config()

    def _validate_database_config(self):
        if self.database is None:
            raise ValueError("Database configuration is missing.")

        required_fields = ["type", "host", "port", "name", "username", "password"]
        for field in required_fields:
            if field not in self.database:
                raise ValueError(f"Database configuration is missing '{field}' field.")
        if self.database["type"] not in ["mysql", "postgres"]:
            raise ValueError("Database type must be 'mysql' or 'postgres'.")
        try:
            port = int(self.database["port"])
            if port <= 0 or port > 65535:
                raise ValueError("Port number must be between 1 and 65535.")
        except ValueError:
            raise ValueError("Database 'port' must be an integer.")

        if not isinstance(self.database["host"], str) or not self.database["host"]:
            raise ValueError("Database 'host' must be a non-empty string.")

    def _validate_ai_model_config(self):
        if self.ai_model is None:
            raise ValueError("AI model configuration is missing.")

        required_fields = ["provider", "model_name"]
        for field in required_fields:
            if field not in self.ai_model:
                raise ValueError(f"AI model configuration is missing '{field}' field.")

        external_api_providers = ["openai", "anthropic"]
        local_api_providers = ["ollama"]
        if (
            self.ai_model["provider"]
            not in external_api_providers + local_api_providers
        ):
            raise ValueError(
                "AI model provider must be one of 'openai', 'anthropic', or 'ollama'."
            )

        if self.ai_model["provider"] in external_api_providers:
            if "api_key" not in self.ai_model:
                raise ValueError(
                    "API key must be provided when using an external API provider."
                )

            if "api_base" in self.ai_model and "api_version" in self.ai_model:
                if (
                    not isinstance(self.ai_model["api_base"], str)
                    or not self.ai_model["api_base"]
                ):
                    raise ValueError(
                        "API base must be a non-empty string when provided."
                    )
                if (
                    not isinstance(self.ai_model["api_version"], str)
                    or not self.ai_model["api_version"]
                ):
                    raise ValueError(
                        "API version must be a non-empty string when provided."
                    )
        if self.ai_model["provider"] in local_api_providers:
            if "api_base" not in self.ai_model:
                raise ValueError(
                    "API base must be provided when using a local API provider."
                )

    @property
    def db_type(self):
        return self.database.get("type")

    @property
    def db_host(self):
        return self.database.get("host")

    @property
    def db_port(self):
        return self.database.get("port")

    @property
    def db_name(self):
        return self.database.get("name")

    @property
    def db_username(self):
        return self.database.get("username")

    @property
    def db_password(self):
        return self.database.get("password")

    @property
    def ai_provider(self):
        return self.ai_model.get("provider")

    @property
    def ai_model_name(self):
        return self.ai_model.get("model_name")

    @property
    def ai_api_key(self):
        return self.ai_model.get("api_key")

    @property
    def ai_api_base(self):
        return self.ai_model.get("api_base", None)

    @property
    def ai_api_version(self):
        return self.ai_model.get("api_version", None)
