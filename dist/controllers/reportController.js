"use strict";
// import { Request, Response } from 'express';
// import reportService from '../services/reportService';
// import { ReportStatus } from '@prisma/client';
// class ReportController {
//   // ... existing methods ...
//   async assignReportToOfficer(req: Request, res: Response) {
//     try {
//       const { reportId } = req.params;
//       const { officerId } = req.body;
//       const report = await reportService.assignReportToOfficer(
//         Number(reportId),
//         Number(officerId)
//       );
//       res.json(report);
//     } catch (error) {
//       res.status(500).json({ message: 'Error assigning report to officer', error });
//     }
//   }
//   async updateReportStatus(req: Request, res: Response) {
//     try {
//       const { reportId } = req.params;
//       const { status } = req.body;
//       const report = await reportService.updateReportStatus(
//         Number(reportId),
//         status
//       );
//       res.json(report);
//     } catch (error) {
//       res.status(500).json({ message: 'Error updating report status', error });
//     }
//   }
//   async getReportStatistics(req: Request, res: Response) {
//     try {
//       const statistics = await reportService.getReportStatistics();
//       res.json(statistics);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching report statistics', error });
//     }
//   }
// }
// export default new ReportController(); 
