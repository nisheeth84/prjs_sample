package com.viettel.coms.dto;

public class ConstructionTaskGranttDepenDTO {
    private int ID;
    private int PredecessorID;
    private int SuccessorID;
    private int Type;

    public ConstructionTaskGranttDepenDTO(int iD, int predecessorID, int successorID, int type) {
        super();
        ID = iD;
        PredecessorID = predecessorID;
        SuccessorID = successorID;
        Type = type;
    }

}
