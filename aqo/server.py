# AQO as an API, primarily for use with the AQO React UI.

from fastapi import APIRouter, FastAPI
from pydantic import BaseModel
import uvicorn

from aqo.config import Config
from aqo.db import Database
from aqo.llm import LLM


class Query(BaseModel):
    query: str


class API:
    VERSION = "0.1.0"

    config: Config
    db: Database
    llm: LLM

    def __init__(self, config_path: str) -> None:
        self.config = Config(config_path)
        self.db = Database(self.config)
        self.llm = LLM(self.config)
        self.router = APIRouter()
        self._setup_routes()

    def _setup_routes(self) -> None:
        self.router.add_api_route("/status", self.status, methods=["GET"])
        self.router.add_api_route("/database", self.database_details, methods=["GET"])
        self.router.add_api_route("/schema", self.schema, methods=["GET"])
        self.router.add_api_route("/query", self.run_query, methods=["POST"])

    def status(self):
        """Healthcheck route for the UI."""
        return {"name": "AQO API", "version": self.VERSION}

    def database_details(self):
        """Fetch details of the database config."""
        return self.config.database

    def schema(self):
        """Fetch the schema of the connected database."""
        return {"schema": self.db.schema}

    def run_query(self, query: Query):
        """Run a query on the connected database."""
        return self.db.query_as_json(query.query)


def start_server(config_path: str) -> None:
    app = FastAPI()
    api = API(config_path)
    app.include_router(api.router)
    uvicorn.run(app, host="localhost", port=8000)
