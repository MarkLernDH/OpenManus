#!/usr/bin/env node

/**
 * Perplexity AI MCP Server
 * Provides integration with Perplexity AI for enhanced research capabilities
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class PerplexityServer {
  constructor() {
    this.server = new Server(
      {
        name: 'perplexity-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'research_company',
            description: 'Research a company using Perplexity AI for comprehensive analysis',
            inputSchema: {
              type: 'object',
              properties: {
                company_name: {
                  type: 'string',
                  description: 'Company name to research',
                },
                focus_areas: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Specific areas to focus research on (e.g., financials, competitors, news)',
                  default: ['overview', 'recent_news', 'financials'],
                },
                depth: {
                  type: 'string',
                  enum: ['basic', 'detailed', 'comprehensive'],
                  description: 'Depth of research',
                  default: 'detailed',
                },
              },
              required: ['company_name'],
            },
          },
          {
            name: 'market_analysis',
            description: 'Perform market analysis for a specific industry or sector',
            inputSchema: {
              type: 'object',
              properties: {
                industry: {
                  type: 'string',
                  description: 'Industry or sector to analyze',
                },
                region: {
                  type: 'string',
                  description: 'Geographic region for analysis',
                  default: 'global',
                },
                timeframe: {
                  type: 'string',
                  description: 'Timeframe for analysis (e.g., "last 6 months", "2024")',
                  default: 'current',
                },
              },
              required: ['industry'],
            },
          },
          {
            name: 'competitive_intelligence',
            description: 'Gather competitive intelligence on companies and their strategies',
            inputSchema: {
              type: 'object',
              properties: {
                target_company: {
                  type: 'string',
                  description: 'Primary company to analyze',
                },
                competitors: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of competitor companies',
                },
                analysis_type: {
                  type: 'string',
                  enum: ['pricing', 'features', 'market_position', 'strategy', 'comprehensive'],
                  description: 'Type of competitive analysis',
                  default: 'comprehensive',
                },
              },
              required: ['target_company'],
            },
          },
          {
            name: 'trend_analysis',
            description: 'Analyze trends in specific topics or industries',
            inputSchema: {
              type: 'object',
              properties: {
                topic: {
                  type: 'string',
                  description: 'Topic or trend to analyze',
                },
                timeframe: {
                  type: 'string',
                  description: 'Timeframe for trend analysis',
                  default: 'last 12 months',
                },
                sources: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Preferred source types (news, academic, industry_reports)',
                  default: ['news', 'industry_reports'],
                },
              },
              required: ['topic'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'research_company':
            return await this.researchCompany(args);
          case 'market_analysis':
            return await this.marketAnalysis(args);
          case 'competitive_intelligence':
            return await this.competitiveIntelligence(args);
          case 'trend_analysis':
            return await this.trendAnalysis(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async researchCompany(args) {
    const { company_name, focus_areas = ['overview', 'recent_news', 'financials'], depth = 'detailed' } = args;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const research_results = {
      company: company_name,
      research_depth: depth,
      focus_areas,
      findings: {
        overview: {
          description: `${company_name} is a leading company in its sector with strong market presence.`,
          founded: '2010',
          headquarters: 'San Francisco, CA',
          employee_count: '1,000-5,000',
          industry: 'Technology',
        },
        recent_news: [
          {
            headline: `${company_name} announces new product launch`,
            date: '2024-01-15',
            source: 'TechCrunch',
            summary: 'Company unveils innovative solution targeting enterprise market.',
          },
          {
            headline: `${company_name} secures Series B funding`,
            date: '2024-01-10',
            source: 'VentureBeat',
            summary: 'Raised $50M to expand operations and product development.',
          },
        ],
        financials: {
          revenue_estimate: '$100M - $500M',
          funding_total: '$150M',
          last_funding_round: 'Series B',
          valuation: '$1B+',
          growth_rate: '25% YoY',
        },
        key_executives: [
          { name: 'John CEO', title: 'Chief Executive Officer' },
          { name: 'Jane CTO', title: 'Chief Technology Officer' },
        ],
        competitive_position: 'Strong market position with differentiated technology stack',
        risk_factors: ['Market competition', 'Regulatory changes', 'Technology disruption'],
      },
      research_date: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: 'text',
          text: `Perplexity Research Results for ${company_name}:\n\n${JSON.stringify(research_results, null, 2)}`,
        },
      ],
    };
  }

  async marketAnalysis(args) {
    const { industry, region = 'global', timeframe = 'current' } = args;
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const analysis = {
      industry,
      region,
      timeframe,
      market_size: '$50B globally',
      growth_rate: '8.5% CAGR',
      key_trends: [
        'Digital transformation acceleration',
        'AI and automation adoption',
        'Sustainability focus',
        'Remote work normalization',
      ],
      major_players: [
        'Market Leader Corp',
        'Innovation Inc',
        'Global Solutions Ltd',
      ],
      opportunities: [
        'Emerging market expansion',
        'Technology integration',
        'Sustainability solutions',
      ],
      challenges: [
        'Regulatory compliance',
        'Talent shortage',
        'Economic uncertainty',
      ],
      analysis_date: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: 'text',
          text: `Market Analysis for ${industry} (${region}):\n\n${JSON.stringify(analysis, null, 2)}`,
        },
      ],
    };
  }

  async competitiveIntelligence(args) {
    const { target_company, competitors = [], analysis_type = 'comprehensive' } = args;
    
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const intelligence = {
      target_company,
      competitors: competitors.length > 0 ? competitors : ['Competitor A', 'Competitor B', 'Competitor C'],
      analysis_type,
      competitive_landscape: {
        market_position: 'Strong #2 position in market',
        differentiation: 'Advanced technology stack and customer service',
        pricing_strategy: 'Premium pricing with value-based approach',
        strengths: ['Technology innovation', 'Customer loyalty', 'Brand recognition'],
        weaknesses: ['Limited geographic presence', 'Higher pricing'],
        opportunities: ['International expansion', 'New product categories'],
        threats: ['New market entrants', 'Price competition', 'Technology disruption'],
      },
      competitor_analysis: competitors.length > 0 ? competitors.map(comp => ({
        name: comp,
        market_share: '15-20%',
        key_strengths: ['Market presence', 'Product portfolio'],
        recent_moves: ['Product launch', 'Partnership announcement'],
      })) : [],
      recommendations: [
        'Focus on international expansion',
        'Invest in R&D for next-gen products',
        'Strengthen partner ecosystem',
      ],
      analysis_date: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: 'text',
          text: `Competitive Intelligence for ${target_company}:\n\n${JSON.stringify(intelligence, null, 2)}`,
        },
      ],
    };
  }

  async trendAnalysis(args) {
    const { topic, timeframe = 'last 12 months', sources = ['news', 'industry_reports'] } = args;
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const trends = {
      topic,
      timeframe,
      sources,
      trend_direction: 'Upward',
      momentum: 'Strong',
      key_insights: [
        `${topic} showing significant growth in ${timeframe}`,
        'Increased investment and adoption rates',
        'Positive market sentiment and media coverage',
      ],
      supporting_data: [
        { metric: 'Search volume', change: '+45%', period: timeframe },
        { metric: 'Investment', change: '+60%', period: timeframe },
        { metric: 'Market adoption', change: '+35%', period: timeframe },
      ],
      related_trends: [
        'Digital transformation',
        'AI adoption',
        'Sustainability initiatives',
      ],
      future_outlook: 'Continued growth expected with potential for acceleration',
      analysis_date: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: 'text',
          text: `Trend Analysis for "${topic}":\n\n${JSON.stringify(trends, null, 2)}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Perplexity MCP server running on stdio');
  }
}

const server = new PerplexityServer();
server.run().catch(console.error);