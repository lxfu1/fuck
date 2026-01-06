import type { MonitoringMetrics } from '@insight-studio/shared';
import * as os from 'os';

export class MonitoringService {
  private startTime = Date.now();
  private requestCount = 0;
  private totalResponseTime = 0;
  private errorCount = 0;

  async getMetrics(): Promise<MonitoringMetrics> {
    const uptime = Date.now() - this.startTime;
    const avgResponseTime = this.requestCount > 0 
      ? this.totalResponseTime / this.requestCount 
      : 0;
    const errorRate = this.requestCount > 0 
      ? (this.errorCount / this.requestCount) * 100 
      : 0;
    const requestsPerSecond = this.requestCount / (uptime / 1000);

    return {
      server: {
        cpu: this.getCPUUsage(),
        memory: this.getMemoryUsage(),
        uptime: uptime / 1000,
      },
      api: {
        totalRequests: this.requestCount,
        averageResponseTime: avgResponseTime,
        errorRate,
        requestsPerSecond,
      },
      charts: {
        totalGenerated: this.requestCount,
        averageRenderTime: 250,
        successRate: 100 - errorRate,
      },
      timestamp: new Date(),
    };
  }

  async checkHealth(): Promise<{ status: string; details: Record<string, unknown> }> {
    const memory = this.getMemoryUsage();
    const cpu = this.getCPUUsage();

    return {
      status: 'healthy',
      details: {
        uptime: (Date.now() - this.startTime) / 1000,
        memory: `${memory.toFixed(2)}%`,
        cpu: `${cpu.toFixed(2)}%`,
        timestamp: new Date().toISOString(),
      },
    };
  }

  recordRequest(responseTime: number, isError = false) {
    this.requestCount++;
    this.totalResponseTime += responseTime;
    if (isError) this.errorCount++;
  }

  private getCPUUsage(): number {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    }

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~(100 * idle / total);

    return usage;
  }

  private getMemoryUsage(): number {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    return (usedMemory / totalMemory) * 100;
  }
}
