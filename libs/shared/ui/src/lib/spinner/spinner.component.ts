import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: false,
})
export class SpinnerComponent {
  public message = input('');
}
