from __future__ import annotations

import os
from typing import Iterable

from litellm import completion

from aqo.config import Config


class LLM:
    system_prompt = """
    You are a database administrator. You are working with a new, junior
    engineer who comes to you about a query on a database that is running
    slowly. They ask you for advice on how to speed it up.

    The schema of the database is:

    ```sql
    {database_schema}
    ```sql

    Present your advice to the junior in JSON format, with the following keys:

    query_advice: Advice on how to optimize the query.
    schema_advice: Advice on how to optimize the schema, if possible, to improve performance of this query.
    query_optimized: The optimized query.
    schema_optimized: A DDL statement that can be used to optimize the schema, if possible, to improve performance of this query.
    explanation: An explanation of why the query or schema is slow, and why the advice you gave will help.

    Your response MUST be exactly in the format specified above, with no additional
    content.


    If no further optimizations are possible, you MUST return `null` on the
    relevant keys. Make sure you are confident about the advice you are
    presenting, and deeply consider all relevant factors before making your
    suggestion. If you are not confident about your advice, you can return
    `null` on the relevant keys with an explanation of why you are not confident.

    Remember, your focus is to teach the junior along with fixing the query.
    Only give advice that is relevant to the query and the EXPLAIN output.
    """

    user_prompt = """
    The following query is running slowly:

    ```sql
    {slow_query}
    ```sql

    When you run an EXPLAIN on the query, you see the following:

    ```sql
    {explain_output}
    ```sql
    """

    def __init__(self, config: Config) -> None:
        self.config = config
        self._setup_llm()

    def _setup_llm(self) -> None:
        if self.config.ai_provider == "openai":
            os.environ["OPENAI_API_KEY"] = self.config.ai_api_key
        elif self.config.ai_provider == "anthropic":
            os.environ["ANTHROPIC_API_KEY"] = self.config.ai_api_key

    def optimize(
        self, database_schema: str, slow_query: str, explain_output: str
    ) -> dict:
        system_prompt = self.system_prompt.format(database_schema=database_schema)
        user_prompt = self.user_prompt.format(
            slow_query=slow_query, explain_output=explain_output
        )

        messages = [
            {"content": system_prompt, "role": "system"},
            {"content": user_prompt, "role": "user"},
        ]
        return completion(
            self._litellm_model(),
            messages=messages,
            api_base=self.config.ai_api_base,
        )

    def _litellm_model(self) -> str:
        if self.config.ai_provider == "openai":
            return self.config.ai_model_name
        elif self.config.ai_provider == "anthropic":
            return self.config.ai_model_name
        else:
            return f"{self.config.ai_provider}/{self.config.ai_model_name}"
