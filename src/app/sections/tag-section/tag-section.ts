import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core'
import { Tag } from '../../models/tag'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-tag-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-section.html',
  styleUrl: './tag-section.sass',
})
export class TagSection implements OnInit, OnDestroy {
  @Input() tags?: Tag[]

  protected categoryParam?: string
  protected tagParam?: string
  protected selected?: Tag

  private route = inject(ActivatedRoute)
  private paramMapSubscription: Subscription | undefined

  constructor() {
    this.paramMapSubscription = this.route.paramMap.subscribe((params) => {
      this.categoryParam = params.get('category') || 'null'
      this.tagParam = params.get('tag') || 'null'
    })
  }

  ngOnInit(): void {
    this.selected = this.tags?.find((t) => t.slug === this.tagParam)
  }

  ngOnDestroy(): void {
    if (this.paramMapSubscription) this.paramMapSubscription.unsubscribe()
  }
}
