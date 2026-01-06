import type { DashboardTemplate } from '@insight-studio/shared';
import { generateId } from '@insight-studio/shared';

export class TemplateService {
  private templates: Map<string, DashboardTemplate> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  async listTemplates(): Promise<DashboardTemplate[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: string): Promise<DashboardTemplate | null> {
    return this.templates.get(id) || null;
  }

  async createTemplate(data: Partial<DashboardTemplate>): Promise<DashboardTemplate> {
    const template: DashboardTemplate = {
      id: generateId('template'),
      name: data.name || 'Untitled Template',
      description: data.description || '',
      category: data.category || 'custom',
      dashboard: data.dashboard || {
        name: 'Template Dashboard',
        items: [],
        layout: { cols: 12, rowHeight: 100 },
        settings: { allowExport: true, allowShare: true },
      },
      tags: data.tags || [],
      usageCount: 0,
      isOfficial: false,
    };

    this.templates.set(template.id, template);
    return template;
  }

  private initializeDefaultTemplates() {
    const salesTemplate: DashboardTemplate = {
      id: generateId('template'),
      name: 'Sales Dashboard',
      description: 'Comprehensive sales analytics and KPI tracking',
      category: 'sales',
      dashboard: {
        name: 'Sales Analytics',
        description: 'Track sales performance and trends',
        items: [],
        layout: {
          cols: 12,
          rowHeight: 100,
        },
        settings: {
          allowExport: true,
          allowShare: true,
        },
      },
      tags: ['sales', 'revenue', 'kpi'],
      usageCount: 150,
      rating: 4.8,
      isOfficial: true,
    };

    const marketingTemplate: DashboardTemplate = {
      id: generateId('template'),
      name: 'Marketing Dashboard',
      description: 'Monitor marketing campaigns and conversion metrics',
      category: 'marketing',
      dashboard: {
        name: 'Marketing Analytics',
        description: 'Track marketing performance',
        items: [],
        layout: {
          cols: 12,
          rowHeight: 100,
        },
        settings: {
          allowExport: true,
          allowShare: true,
        },
      },
      tags: ['marketing', 'campaigns', 'conversion'],
      usageCount: 120,
      rating: 4.6,
      isOfficial: true,
    };

    const financeTemplate: DashboardTemplate = {
      id: generateId('template'),
      name: 'Finance Dashboard',
      description: 'Financial metrics and budget tracking',
      category: 'finance',
      dashboard: {
        name: 'Finance Analytics',
        description: 'Track financial performance',
        items: [],
        layout: {
          cols: 12,
          rowHeight: 100,
        },
        settings: {
          allowExport: true,
          allowShare: true,
        },
      },
      tags: ['finance', 'budget', 'revenue'],
      usageCount: 95,
      rating: 4.7,
      isOfficial: true,
    };

    this.templates.set(salesTemplate.id, salesTemplate);
    this.templates.set(marketingTemplate.id, marketingTemplate);
    this.templates.set(financeTemplate.id, financeTemplate);
  }
}
