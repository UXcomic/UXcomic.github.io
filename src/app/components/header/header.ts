import { Component, Input, OnInit } from '@angular/core'
import { Category } from '../../models/category'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.sass',
})
export class Header implements OnInit {
  @Input() category?: Category

  ngOnInit(): void {}
}
