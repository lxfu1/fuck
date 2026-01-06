import type {
  Dashboard,
  CreateDashboardRequest,
  UpdateDashboardRequest,
  DashboardShare,
} from '@insight-studio/shared';
import { generateId } from '@insight-studio/shared';

export class DashboardService {
  private dashboards: Map<string, Dashboard> = new Map();

  async createDashboard(request: CreateDashboardRequest): Promise<Dashboard> {
    const dashboard: Dashboard = {
      id: generateId('dashboard'),
      name: request.name,
      description: request.description,
      items: [],
      layout: {
        cols: 12,
        rowHeight: 100,
      },
      settings: {
        allowExport: true,
        allowShare: true,
      },
      createdBy: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.dashboards.set(dashboard.id, dashboard);
    return dashboard;
  }

  async getDashboard(id: string): Promise<Dashboard | null> {
    return this.dashboards.get(id) || null;
  }

  async listDashboards(): Promise<Dashboard[]> {
    return Array.from(this.dashboards.values());
  }

  async updateDashboard(
    id: string,
    request: UpdateDashboardRequest
  ): Promise<Dashboard> {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) {
      throw new Error('Dashboard not found');
    }

    const updated: Dashboard = {
      ...dashboard,
      ...request,
      updatedAt: new Date(),
    };

    this.dashboards.set(id, updated);
    return updated;
  }

  async deleteDashboard(id: string): Promise<void> {
    this.dashboards.delete(id);
  }

  async shareDashboard(
    id: string,
    config: { type: 'public' | 'private' | 'password'; password?: string }
  ): Promise<DashboardShare> {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) {
      throw new Error('Dashboard not found');
    }

    const share: DashboardShare = {
      id: generateId('share'),
      dashboardId: id,
      type: config.type,
      password: config.password,
      allowDownload: true,
      allowComment: true,
      shareUrl: `https://insight-studio.ai/shared/${generateId('share')}`,
      viewCount: 0,
      createdAt: new Date(),
    };

    return share;
  }

  async exportDashboard(id: string, format: string): Promise<{ url: string }> {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) {
      throw new Error('Dashboard not found');
    }

    return {
      url: `/exports/dashboards/${id}.${format}`,
    };
  }
}
