import { User } from "./User";

export class Report {
    _id: string = "";
    description: string = "";
    user: User;
    reportType: any;
    isApproved: boolean = false;
    approvedBy: string = "";

    static fromMap(data: any) {
        return Object.assign(new this, data);
    }

    getFormattedStatus() {
        if (this.approvedBy == null) {
            return 'Pending';
        } else if (this.isApproved == true) {
            return 'Approved';
        } else {
            return 'Rejected';
        }
    }
}