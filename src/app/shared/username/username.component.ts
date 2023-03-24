import { Component, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';
import { Global } from '@shared/global';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnInit {
  faInfoCircle = faInfoCircle;
  global = Global;

  constructor(public controlContainer: ControlContainer) { }

  ngOnInit(): void {
  }

  get username(): AbstractControl {
    return this.controlContainer.control.get("username");
  }

}
