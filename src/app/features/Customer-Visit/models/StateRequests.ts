export interface ScheduleRequest  {
  userId: string,
   scheduledDate: Date, 
     technicianId: string
}
export interface  CompleteRequest  {actualCost:number, notes:string, userId: string}
export interface CancelRequest  {reason:string, userId: string}