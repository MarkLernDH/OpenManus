from typing import Dict, List, Optional

from pydantic import Field, model_validator

from app.agent.toolcall import ToolCallAgent
from app.config import config
from app.logger import logger
from app.prompt.business_intelligence import NEXT_STEP_PROMPT, SYSTEM_PROMPT
from app.tool import Terminate, ToolCollection
from app.tool.mcp import MCPClients, MCPClientTool
from app.tool.web_search import WebSearch
from app.tool.browser_use_tool import BrowserUseTool
from app.tool.str_replace_editor import StrReplaceEditor


class BusinessIntelligenceAgent(ToolCallAgent):
    """
    A specialized business intelligence agent focused on lead generation,
    prospect research, and CRM integration using MCP tools.
    """

    name: str = "BusinessIntelligence"
    description: str = "A specialized agent for business intelligence, lead generation, prospect research, and CRM operations"

    system_prompt: str = SYSTEM_PROMPT.format(directory=config.workspace_root)
    next_step_prompt: str = NEXT_STEP_PROMPT

    max_observe: int = 8000
    max_steps: int = 15

    # MCP clients for business tool integrations
    mcp_clients: MCPClients = Field(default_factory=MCPClients)

    # Core business intelligence tools
    available_tools: ToolCollection = Field(
        default_factory=lambda: ToolCollection(
            WebSearch(),
            BrowserUseTool(),
            StrReplaceEditor(),
            Terminate(),
        )
    )

    special_tool_names: list[str] = Field(default_factory=lambda: [Terminate().name])

    # Track connected business systems
    connected_systems: Dict[str, str] = Field(default_factory=dict)
    _initialized: bool = False

    @model_validator(mode="after")
    def initialize_agent(self) -> "BusinessIntelligenceAgent":
        """Initialize the business intelligence agent."""
        return self

    @classmethod
    async def create(cls, **kwargs) -> "BusinessIntelligenceAgent":
        """Factory method to create and properly initialize a BusinessIntelligenceAgent."""
        instance = cls(**kwargs)
        await instance.initialize_business_systems()
        instance._initialized = True
        return instance

    async def initialize_business_systems(self) -> None:
        """Initialize connections to business intelligence MCP servers."""
        business_systems = {
            "n8n_workflows": "http://localhost:5678/webhook/mcp",
            "hubspot_integration": ["npx", "@hubspot/mcp-server"],
            "zoominfo_connector": ["node", "./mcp-servers/zoominfo-server.js"],
            "perplexity_search": ["node", "./mcp-servers/perplexity-server.js"],
            "supabase_db": ["npx", "@supabase/mcp-server"]
        }

        for system_id, connection_info in business_systems.items():
            try:
                if isinstance(connection_info, str):
                    # SSE connection
                    await self.connect_business_system(connection_info, system_id, use_sse=True)
                    logger.info(f"Connected to {system_id} via SSE at {connection_info}")
                elif isinstance(connection_info, list):
                    # Stdio connection
                    command = connection_info[0]
                    args = connection_info[1:] if len(connection_info) > 1 else []
                    await self.connect_business_system(command, system_id, use_stdio=True, stdio_args=args)
                    logger.info(f"Connected to {system_id} via stdio: {command} {' '.join(args)}")
            except Exception as e:
                logger.error(f"Failed to connect to business system {system_id}: {e}")

    async def connect_business_system(
        self,
        connection_info: str,
        system_id: str = "",
        use_sse: bool = False,
        use_stdio: bool = False,
        stdio_args: List[str] = None,
    ) -> None:
        """Connect to a business intelligence system via MCP."""
        if use_sse:
            await self.mcp_clients.connect_sse(connection_info, system_id)
            self.connected_systems[system_id] = connection_info
        elif use_stdio:
            await self.mcp_clients.connect_stdio(
                connection_info, stdio_args or [], system_id
            )
            self.connected_systems[system_id] = connection_info

        # Update available tools with new business system tools
        new_tools = [
            tool for tool in self.mcp_clients.tools if tool.server_id == system_id
        ]
        self.available_tools.add_tools(*new_tools)

    async def disconnect_business_system(self, system_id: str = "") -> None:
        """Disconnect from a business intelligence system."""
        await self.mcp_clients.disconnect(system_id)
        if system_id:
            self.connected_systems.pop(system_id, None)
        else:
            self.connected_systems.clear()

        # Rebuild available tools without the disconnected system's tools
        base_tools = [
            tool
            for tool in self.available_tools.tools
            if not isinstance(tool, MCPClientTool)
        ]
        self.available_tools = ToolCollection(*base_tools)
        self.available_tools.add_tools(*self.mcp_clients.tools)

    async def cleanup(self):
        """Clean up business intelligence agent resources."""
        if self._initialized:
            await self.disconnect_business_system()
            self._initialized = False

    async def think(self) -> bool:
        """Process current state and decide next actions for business intelligence tasks."""
        if not self._initialized:
            await self.initialize_business_systems()
            self._initialized = True

        return await super().think()

    async def run(self, request: Optional[str] = None) -> str:
        """Run the business intelligence agent with cleanup when done."""
        try:
            return await super().run(request)
        finally:
            await self.cleanup()