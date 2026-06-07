import { Component } from '@angular/core';
import { ClockInClockOut } from './components/clock-in-clock-out/clock-in-clock-out';

@Component({
  selector: 'app-home',
  imports: [ClockInClockOut],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
