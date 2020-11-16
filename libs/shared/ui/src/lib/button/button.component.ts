import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() color: 'primary' | 'accent' | 'warn' | 'danger' | 'success' =
    'primary';
  @Input() disabled: boolean;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() buttonVariant: 'raised' | 'button' | 'fab' | 'mini-fab' | 'icon' =
    'raised';
  @Input() size: 'm' | 'l' = 'm';

  @Output() buttonClicked = new EventEmitter<Event>();

  constructor() {}

  ngOnInit() {}
}
