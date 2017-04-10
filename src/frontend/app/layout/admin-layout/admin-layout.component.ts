import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  /**
   * The window height.
   */
  windowHeight = 480;

  public disabled = false;
  public status: { isopen: boolean } = { isopen: false };

  constructor() { }

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit() {
    this.setWindowSize();
  }

  /**
   * Set the window height
   * @method
   */
  @HostListener('window:resize')
  private setWindowSize() {
    this.windowHeight = window.innerHeight;
  }

  /**
   * Gets the application min height.
   * @readonly
   * @property {string}
   */
  public get appMinHeight() {
    return this.windowHeight + 'px';
  }

  /**
   * Gets the content min height.
   * @readonly
   * @property {string}
   */
  public get contentMinHeight() {
    const margins = 55 /* header */ + 51 /* footer */;
    return (this.windowHeight - margins) + 'px';
  }

}
