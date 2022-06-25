export class Users {

    _id: String = "";
    firstName: String = "";
    lastName: String = "";
    email: String = "";
    role: String = "";
    archived: String = "";
    permissions: String[] = [];

    hasCompanyPermission(permission: String) {
        if (this.role == 'super-admin') {
            return 'super-admin';
        } else if (this.role == 'company-owner') {
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