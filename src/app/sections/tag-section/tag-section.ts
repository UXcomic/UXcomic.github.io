import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { Tag } from '../../models/tag'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-tag-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-section.html',
  styleUrl: './tag-section.sass',
})
export class TagSection implements OnInit, OnChanges, OnDestroy {
  @Input() tags?: Tag[]

  protected categoryParam?: string
  protected tagParam?: string
  protected selected?: Tag

  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private paramMapSubscription: Subscription | undefined

  constructor() {}

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap.subscribe((params) => {
      this.categoryParam = params.get('category') || 'null'
      this.tagParam = params.get('tag') || 'null'

      this.selected = this.tags?.find((t) => t.slug === this.tagParam)
    })

    this.tags = this.tags?.sort((a, b) => a.order - b.order)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tags'] && this.tags && this.tagParam) {
      this.selected = this.tags.find((t) => t.slug === this.tagParam)
    }
  }

  ngOnDestroy(): void {
    if (this.paramMapSubscription) this.paramMapSubscription.unsubscribe()
  }

  goToTag(tag: Tag) {
    if (!tag) return

    this.router.navigateByUrl(`/blog/${this.categoryParam}/${tag.slug}`)
  }
}
