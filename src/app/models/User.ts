import { environment } from "src/environments/environment";

export class User {

    _id: String = "";
    firstName: String = "";
    lastName: String = "";
    role: String = "";
    permissions: String[] = [];
    profilePicture: String = "";
    companyId:string = "";

    getProfilePictureUrl() {
        return environment.apiUrl + "/" + (this.profilePicture ? this.profilePicture : '');
    }

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