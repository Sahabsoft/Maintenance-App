
            // OldStatus = x.OldStatus,
            // NewStatus = x.NewStatus,
            // Notes = x.Notes,
            export interface  MaintenanceLogResponse {
                id: string;
 oldStatus: number;
 newStatus: number;
 notes?: string; 
files?: MaintenanceLogFileResponse[];
}
export interface MaintenanceLogFileResponse {
id: string;
fileName: string;
filePath: string;
contentType: string;
size: number;

}