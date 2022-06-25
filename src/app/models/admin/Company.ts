export class Company {
    _id: string = "";
    name: string = "";
    email: string = "";
    subscribedPlan: string = "";
    status: string = "";

    static fromMap(data: any) {
        return Object.assign(new this, data);
    }
}