import { Request, Response } from 'express';
import { getAllSampleDatasets, getSampleDataset, SampleDatasetKey } from '../data/sample-datasets';

export class DataController {
  listSamples = async (req: Request, res: Response) => {
    try {
      const samples = getAllSampleDatasets();
      
      res.json({
        success: true,
        data: samples,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };

  getSample = async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const sample = getSampleDataset(key as SampleDatasetKey);
      
      if (!sample) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'SAMPLE_NOT_FOUND',
            message: 'Sample dataset not found',
          },
        });
      }
      
      res.json({
        success: true,
        data: sample,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  };
}
