import { Component, inject } from '@angular/core'
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router'
import BlogRoutes from '../../public/data/blogRoutes.json'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App {
  protected title = 'uxcomic-v2'

  private router = inject(Router)
  private route = inject(ActivatedRoute)

  constructor() {
    this.route.firstChild?.params.subscribe((params) => {
      if (!params['category'] || !params['tag']) {
        this.router.navigateByUrl(`/blog/${BlogRoutes[0].category}/${BlogRoutes[0].tag}`)
      }
    })
  }
}
