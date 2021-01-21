import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  needHelpTF = false;
  isLostTF = false;
  infoTF = false;
  startTF = true;
  yesTF = false;
  noTF = false;

  constructor() { }

  ngOnInit(): void {
  }

  needHelp() { 
    this.startTF = false;
    this.needHelpTF = true;
  }

  isLost() {
    this.startTF = false;
    this.isLostTF = true;
  }

  info() { 
    this.startTF = false;
    this.infoTF = true;
  }

  back() { 
    this.startTF = true;
    this.infoTF = false;
    this.isLostTF = false;
    this.needHelpTF = false;
    this.noTF = false;
    this.yesTF = false;
  }

  yes() { 
    this.yesTF = true;
    this.noTF = false;
  }

  no() { 
    this.yesTF = false;
    this.noTF = true;
  }
}
