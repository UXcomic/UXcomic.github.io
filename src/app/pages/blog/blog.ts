import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import BlogRoutes from '../../../../public/data/blogRoutes.json';

const DEFAULT_ROUTE = `/blog/${BlogRoutes[0].category}/${BlogRoutes[0].tag}`;

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.html',
  styleUrl: './blog.sass',
})
export class Blog implements OnInit, OnDestroy {
  protected category: string | null = '';
  protected tag: string | null = '';

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private paramMapSubscription: Subscription | undefined;

  constructor() {
    this.paramMapSubscription = this.route.paramMap.subscribe((params) => {
      const categoryParam = params.get('category');
      const tagParam = params.get('tag');

      if (!categoryParam || !tagParam) {
        this.router.navigateByUrl(DEFAULT_ROUTE);
        return;
      }

      this.category = params.get('category');
      this.tag = params.get('tag');
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.paramMapSubscription) this.paramMapSubscription.unsubscribe();
  }
}
