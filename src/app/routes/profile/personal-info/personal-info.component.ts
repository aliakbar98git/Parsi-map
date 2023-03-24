import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user/shared';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {
  showRealPerson: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if ((this.userService.currentUser.userType === 1 && this.userService.currentUser.personType === 1) ||
        this.userService.currentUser.userType === 2 ||
        this.userService.currentUser.userType === 3) {
      this.showRealPerson = true;
    }
  }

}
