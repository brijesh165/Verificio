export class Users {

    _id: String = "";
    firstName: String = "";
    lastName: String = "";
    email: String = "";
    role: String = "";
    userId: String = "";

    static fromMap(data: any) {
        return Object.assign(new this, data);
    }
}