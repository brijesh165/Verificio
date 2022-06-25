export class Reports {

    _id: String = "";
    name: String = "";
    totalIncidents: String = "";
    isActive: String = "";
    createdAt: String = "";

    static fromMap(data: any) {
        return Object.assign(new this, data);
    }
}