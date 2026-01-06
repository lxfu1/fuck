/**
 * Data parser utilities for various formats
 */

export class DataParser {
  static parseCSV(csvContent: string): unknown[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data: unknown[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: Record<string, unknown> = {};

      headers.forEach((header, index) => {
        const value = values[index];
        row[header] = this.parseValue(value);
      });

      data.push(row);
    }

    return data;
  }

  static parseJSON(jsonContent: string): unknown {
    try {
      return JSON.parse(jsonContent);
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static parseValue(value: string): string | number | boolean | null {
    if (value === '' || value === 'null') return null;
    if (value === 'true') return true;
    if (value === 'false') return false;

    const num = Number(value);
    if (!isNaN(num) && value !== '') return num;

    return value;
  }

  static detectDataStructure(data: unknown[]): {
    hasTimeSeriesData: boolean;
    hasCategoricalData: boolean;
    hasNumericData: boolean;
    hasGeographicData: boolean;
    columns: Array<{
      name: string;
      type: 'string' | 'number' | 'boolean' | 'date' | 'unknown';
      uniqueValues: number;
    }>;
  } {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        hasTimeSeriesData: false,
        hasCategoricalData: false,
        hasNumericData: false,
        hasGeographicData: false,
        columns: [],
      };
    }

    const firstRow = data[0] as Record<string, unknown>;
    const columns = Object.keys(firstRow).map(name => {
      const values = data.map(row => (row as Record<string, unknown>)[name]);
      const uniqueValues = new Set(values).size;
      
      const sampleValue = values.find(v => v !== null && v !== undefined);
      let type: 'string' | 'number' | 'boolean' | 'date' | 'unknown' = 'unknown';

      if (typeof sampleValue === 'number') {
        type = 'number';
      } else if (typeof sampleValue === 'boolean') {
        type = 'boolean';
      } else if (typeof sampleValue === 'string') {
        if (this.isDate(sampleValue)) {
          type = 'date';
        } else {
          type = 'string';
        }
      }

      return { name, type, uniqueValues };
    });

    const hasTimeSeriesData = columns.some(c => c.type === 'date');
    const hasCategoricalData = columns.some(c => c.type === 'string' && c.uniqueValues < data.length * 0.5);
    const hasNumericData = columns.some(c => c.type === 'number');
    const hasGeographicData = columns.some(c => 
      c.type === 'string' && this.isGeographicColumn(c.name)
    );

    return {
      hasTimeSeriesData,
      hasCategoricalData,
      hasNumericData,
      hasGeographicData,
      columns,
    };
  }

  private static isDate(value: string): boolean {
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{2}\/\d{2}\/\d{4}$/,
      /^\d{4}\/\d{2}\/\d{2}$/,
      /^\d{2}-\d{2}-\d{4}$/,
    ];

    return datePatterns.some(pattern => pattern.test(value));
  }

  private static isGeographicColumn(columnName: string): boolean {
    const geoKeywords = [
      'country', 'city', 'region', 'state', 'province',
      'location', 'place', 'address', 'latitude', 'longitude',
      'lat', 'lng', 'lon', 'geo',
    ];

    const lowerName = columnName.toLowerCase();
    return geoKeywords.some(keyword => lowerName.includes(keyword));
  }

  static suggestChartType(dataStructure: ReturnType<typeof DataParser.detectDataStructure>): string[] {
    const suggestions: string[] = [];

    if (dataStructure.hasTimeSeriesData && dataStructure.hasNumericData) {
      suggestions.push('line', 'area', 'column');
    }

    if (dataStructure.hasCategoricalData && dataStructure.hasNumericData) {
      suggestions.push('bar', 'column', 'pie', 'donut');
    }

    if (dataStructure.hasGeographicData) {
      suggestions.push('choropleth-map', 'point-map');
    }

    const numericColumns = dataStructure.columns.filter(c => c.type === 'number');
    if (numericColumns.length >= 2) {
      suggestions.push('scatter', 'bubble');
    }

    if (suggestions.length === 0) {
      suggestions.push('table', 'column');
    }

    return suggestions;
  }

  static validateData(data: unknown): { valid: boolean; error?: string } {
    if (!data) {
      return { valid: false, error: 'Data is required' };
    }

    if (!Array.isArray(data)) {
      return { valid: false, error: 'Data must be an array' };
    }

    if (data.length === 0) {
      return { valid: false, error: 'Data cannot be empty' };
    }

    if (typeof data[0] !== 'object' || data[0] === null) {
      return { valid: false, error: 'Data items must be objects' };
    }

    return { valid: true };
  }
}
