#!/usr/bin/env node

/**
 * ZoomInfo MCP Server
 * Provides integration with ZoomInfo API for prospect research and contact data
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

class ZoomInfoServer {
  constructor() {
    this.server = new Server(
      {
        name: 'zoominfo-server',
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
            name: 'search_contacts',
            description: 'Search for contacts using ZoomInfo API',
            inputSchema: {
              type: 'object',
              properties: {
                company_name: {
                  type: 'string',
                  description: 'Company name to search for contacts',
                },
                job_title: {
                  type: 'string',
                  description: 'Job title filter',
                },
                location: {
                  type: 'string',
                  description: 'Location filter',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results',
                  default: 10,
                },
              },
              required: ['company_name'],
            },
          },
          {
            name: 'get_company_info',
            description: 'Get detailed company information from ZoomInfo',
            inputSchema: {
              type: 'object',
              properties: {
                company_name: {
                  type: 'string',
                  description: 'Company name to lookup',
                },
                domain: {
                  type: 'string',
                  description: 'Company domain (alternative to company name)',
                },
              },
              required: [],
            },
          },
          {
            name: 'enrich_contact',
            description: 'Enrich contact data with additional ZoomInfo information',
            inputSchema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'Contact email address',
                },
                first_name: {
                  type: 'string',
                  description: 'Contact first name',
                },
                last_name: {
                  type: 'string',
                  description: 'Contact last name',
                },
                company: {
                  type: 'string',
                  description: 'Contact company',
                },
              },
              required: ['email'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_contacts':
            return await this.searchContacts(args);
          case 'get_company_info':
            return await this.getCompanyInfo(args);
          case 'enrich_contact':
            return await this.enrichContact(args);
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

  async searchContacts(args) {
    // Mock implementation - replace with actual ZoomInfo API calls
    const { company_name, job_title, location, limit = 10 } = args;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockContacts = [
      {
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@' + company_name.toLowerCase().replace(/\s+/g, '') + '.com',
        job_title: job_title || 'Sales Manager',
        company: company_name,
        phone: '+1-555-0123',
        linkedin: 'https://linkedin.com/in/johnsmith',
        location: location || 'New York, NY',
      },
      {
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@' + company_name.toLowerCase().replace(/\s+/g, '') + '.com',
        job_title: job_title || 'Marketing Director',
        company: company_name,
        phone: '+1-555-0124',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        location: location || 'San Francisco, CA',
      },
    ].slice(0, limit);

    return {
      content: [
        {
          type: 'text',
          text: `Found ${mockContacts.length} contacts for ${company_name}:\n\n${JSON.stringify(mockContacts, null, 2)}`,
        },
      ],
    };
  }

  async getCompanyInfo(args) {
    const { company_name, domain } = args;
    const identifier = company_name || domain;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockCompanyInfo = {
      name: company_name || 'Example Corp',
      domain: domain || (company_name ? company_name.toLowerCase().replace(/\s+/g, '') + '.com' : 'example.com'),
      industry: 'Technology',
      employee_count: '1000-5000',
      revenue: '$100M - $500M',
      headquarters: 'San Francisco, CA',
      founded: '2010',
      description: 'Leading technology company specializing in innovative solutions',
      technologies: ['Salesforce', 'HubSpot', 'AWS', 'React'],
      social_media: {
        linkedin: 'https://linkedin.com/company/' + (company_name || 'example').toLowerCase().replace(/\s+/g, ''),
        twitter: '@' + (company_name || 'example').toLowerCase().replace(/\s+/g, ''),
      },
    };

    return {
      content: [
        {
          type: 'text',
          text: `Company Information for ${identifier}:\n\n${JSON.stringify(mockCompanyInfo, null, 2)}`,
        },
      ],
    };
  }

  async enrichContact(args) {
    const { email, first_name, last_name, company } = args;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const enrichedData = {
      email,
      first_name: first_name || 'Unknown',
      last_name: last_name || 'Unknown',
      company: company || 'Unknown Company',
      job_title: 'Senior Manager',
      department: 'Sales',
      seniority: 'Senior',
      phone: '+1-555-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      linkedin: `https://linkedin.com/in/${(first_name || 'unknown').toLowerCase()}${(last_name || 'unknown').toLowerCase()}`,
      location: 'United States',
      experience_years: Math.floor(Math.random() * 15) + 5,
      education: 'MBA, Business Administration',
      skills: ['Sales', 'Business Development', 'CRM', 'Lead Generation'],
      last_updated: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: 'text',
          text: `Enriched contact data for ${email}:\n\n${JSON.stringify(enrichedData, null, 2)}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('ZoomInfo MCP server running on stdio');
  }
}

const server = new ZoomInfoServer();
server.run().catch(console.error);