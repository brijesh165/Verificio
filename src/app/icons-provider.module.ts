import { NgModule } from '@angular/core';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

import {
    MenuFoldOutline,
    MenuUnfoldOutline,
    FormOutline,
    DashboardOutline,
    BankOutline,
    UserOutline,
    CheckSquareOutline,
    FileZipOutline,
    SearchOutline,
    SettingOutline,
    DownOutline,
    BellOutline,
    ArrowLeftOutline,
    EditOutline,
    BookOutline,
} from '@ant-design/icons-angular/icons';

const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline, BankOutline,
    UserOutline,
    CheckSquareOutline,
    FileZipOutline,
    SearchOutline,
    SettingOutline,
    DownOutline, BellOutline,
    ArrowLeftOutline, EditOutline, BookOutline,];

@NgModule({
    imports: [NzIconModule],
    exports: [NzIconModule],
    providers: [
        { provide: NZ_ICONS, useValue: icons }
    ]
})
export class IconsProviderModule {
}