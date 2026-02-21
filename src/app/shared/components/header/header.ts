import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-header',
  imports: [ToolbarModule, ButtonModule, AvatarModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
