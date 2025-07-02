import { Component, inject, Input, OnInit } from '@angular/core'
import { FlowbiteService } from '../../services/flowbite.service'
import { initFlowbite } from 'flowbite'

@Component({
  selector: 'app-drawer-top-component',
  standalone: true,
  imports: [],
  templateUrl: './drawer-top-component.html',
  styleUrl: './drawer-top-component.sass',
})
export class DrawerTopComponent implements OnInit {
  @Input() drawerId?: string
  @Input() title?: string

  private flowbiteService = inject(FlowbiteService)

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite()
    })
  }
}
