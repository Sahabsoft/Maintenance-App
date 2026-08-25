    //   public Guid CustomerVisitId { get; set; }

    //   public CustomerVisitState OldStatus { get; set; }

    //   public CustomerVisitState NewStatus { get; set; }

    //   public string? Notes { get; set; }

    export interface CustomerVisitStateLog {
        customerVisitId: string;
        oldStatus: number;
        newStatus: number;
        notes?: string | null;
        createdAt: Date;
        dateOfState: Date| null;
    }
    