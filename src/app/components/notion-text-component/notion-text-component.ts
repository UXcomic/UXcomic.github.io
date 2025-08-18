import { Component, Input, OnInit } from '@angular/core'
import { isAbsoluteURL } from '../../utils/route-helper'
import { isUUID } from '../../utils/string-helper'

@Component({
  selector: 'app-notion-text-component',
  standalone: true,
  imports: [],
  templateUrl: './notion-text-component.html',
  styleUrl: './notion-text-component.sass',
})
export class NotionTextComponent implements OnInit {
  @Input() data?: any

  ngOnInit(): void {
    this.initLinkText()
  }

  private initLinkText() {
    if (!this.data?.href || isAbsoluteURL(this.data.href)) return

    const path = this.data.href.split('/').filter((value: string) => !!value)
    if (path.length === 1 && isUUID(path)) this.data.href = '/post/' + path[0]
  }
}
