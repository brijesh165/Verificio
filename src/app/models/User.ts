export class User {

    _id: String = "";
    firstName: String = "";
    lastName: String = "";
    role: String = "";
    permissions: String[] = [];

    hasCompanyPermission(permission: String) {
        if (this.role == 'company-owner') {
            return true;
        } else {
            if (this.permissions.includes(permission)) {
                return true;
            }
        }

        return false;
    }

    static fromMap(data: any) {
        return Object.assign(new this, data);
    }
}