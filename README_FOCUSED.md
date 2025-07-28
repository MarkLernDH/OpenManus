# OpenManus - Focused Business Intelligence Agent

This is a specialized configuration of OpenManus focused on business intelligence tasks including lead generation, prospect research, and CRM integration.

## Key Features

- **Web Research & Scraping**: Advanced web search and content extraction
- **HubSpot Integration**: CRM operations and lead management
- **ZoomInfo Connector**: Contact and company data enrichment
- **Perplexity AI**: Enhanced research and competitive intelligence
- **Supabase Database**: Custom data storage and retrieval
- **n8n Workflows**: Business process automation

## Quick Start

### 1. Configuration

Copy the focused configuration:
```bash
cp config/config.focused.toml config/config.toml
cp config/mcp.focused.json config/mcp.json
```

### 2. Install MCP Server Dependencies

```bash
cd mcp-servers
npm install
```

### 3. Set up API Keys

Edit `config/config.toml` and add your API keys:
- Anthropic API key for Claude
- HubSpot API key (if using HubSpot integration)
- ZoomInfo API key (if using ZoomInfo integration)
- Perplexity API key (if using Perplexity integration)
- Supabase credentials (if using Supabase integration)

### 4. Run the Focused Agent

For single tasks:
```bash
python main_focused.py
```

For workflow-based tasks:
```bash
python run_focused_flow.py
```

## Available Business Intelligence Tools

### Web Research
- Advanced web search with business focus
- Content scraping and extraction
- Competitive intelligence gathering

### CRM Integration (HubSpot)
- Create and update contacts
- Manage deals and opportunities
- Track engagement and activities

### Contact Enrichment (ZoomInfo)
- Find contact information
- Company data enrichment
- Prospect identification

### Enhanced Research (Perplexity)
- Market analysis
- Competitive intelligence
- Trend analysis
- Company research

### Data Management (Supabase)
- Store research results
- Manage prospect databases
- Custom data operations

### Process Automation (n8n)
- Trigger automated workflows
- Connect multiple systems
- Streamline business processes

## Example Use Cases

1. **Lead Generation**: "Find 20 potential customers in the SaaS industry with 100-500 employees"
2. **Prospect Research**: "Research Acme Corp and identify key decision makers in their IT department"
3. **Competitive Analysis**: "Analyze our top 3 competitors and their recent product launches"
4. **Market Intelligence**: "What are the latest trends in the cybersecurity market?"
5. **CRM Updates**: "Enrich all contacts in HubSpot that are missing job titles"

## Configuration Options

The focused agent can be customized through:
- `config/config.focused.toml`: Main configuration
- `config/mcp.focused.json`: MCP server connections
- Environment variables for API keys

## MCP Server Setup

### ZoomInfo Server
```bash
node mcp-servers/zoominfo-server.js
```

### Perplexity Server
```bash
node mcp-servers/perplexity-server.js
```

### n8n Integration
Ensure n8n is running with webhook endpoint at `http://localhost:5678/webhook/mcp`

## Security Notes

- All API keys should be stored securely
- Use environment variables for sensitive data
- Ensure compliance with data protection regulations
- Implement proper access controls for CRM systems

## Troubleshooting

1. **MCP Connection Issues**: Check server URLs and credentials
2. **API Rate Limits**: Implement appropriate delays between requests
3. **Data Quality**: Validate and clean data before CRM updates
4. **Workflow Failures**: Check n8n workflow configurations

For more detailed documentation, see the main OpenManus README.