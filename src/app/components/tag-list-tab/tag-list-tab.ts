import { Component, Input, OnInit } from '@angular/core'
import { MatTabsModule } from '@angular/material/tabs'
import { Tag } from '../../models/tag'

@Component({
  selector: 'app-tag-list-tab',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './tag-list-tab.html',
  styleUrl: './tag-list-tab.sass',
})
export class TagListTab implements OnInit {
  @Input() tags?: Tag[]

  constructor() {}

  ngOnInit(): void {}
}
