export class Subscription {

    _id: String = "";
    name: String = "";
    prices: any = "";
    totalSubscribers: String = "";
    isActive: String[] = [];

    static fromMap(data: any) {
        return Object.assign(new this, data);
    }
}