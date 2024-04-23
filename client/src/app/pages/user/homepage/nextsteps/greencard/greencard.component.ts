import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ModalService } from 'wacom';
@Component({
	selector: 'greencard',
	templateUrl: './greencard.component.html',
	styleUrls: ['./greencard.component.scss']
})
export class GreencardComponent{
	public section = 1;
	constructor(public us: UserService, public modal: ModalService) {}
}
