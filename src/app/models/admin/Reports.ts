export class Reports {

    _id: String = "";
    name: String = "";
    count: String = "";
    categoryId: String = "";
    dateCreated: String = "";

    static fromMap(data: any) {
        return Object.assign(new this, data);
    }
}