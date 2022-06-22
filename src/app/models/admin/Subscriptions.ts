export class Subscription {

    _id: String = "";
    planName: String = "";
    amount: String = "";
    subscribers: String = "";
    status: String[] = [];

    static fromMap(data: any) {
        return Object.assign(new this, data);
    }
}