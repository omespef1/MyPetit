import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-owner-pets',
  templateUrl: './owner-pets.component.html',
  styleUrls: ['./owner-pets.component.scss']
})
export class OwnerPetsComponent implements OnInit {

  @Input() ownerId: number;
  
  constructor() { }

  ngOnInit(): void {
  }

}
