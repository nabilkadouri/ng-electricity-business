import { Component } from '@angular/core';
import { MyChargingStationsComponent } from './my-charging-stations/my-charging-stations.component';
import { ChargingStationRentalHistoryComponent } from './charging-station-rental-history/charging-station-rental-history.component';

@Component({
  selector: 'app-user-charging-stations',
  imports: [MyChargingStationsComponent, ChargingStationRentalHistoryComponent],
  templateUrl: './user-charging-stations.component.html',
  styleUrl: './user-charging-stations.component.css'
})
export class UserChargingStationsComponent {

}
