import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/entities/user.service';
import { CommonModule } from '@angular/common';
import { BookingResponseInterface } from '../../../shared/models/BookingInterface';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
(window as any).saveAs = saveAs;

@Component({
  selector: 'app-user-bookings',
  imports: [CommonModule],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.css',
})
export class UserBookingsComponent implements OnInit {
  private userService = inject(UserService);
  currentBookings: BookingResponseInterface[] = [];

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.currentBookings = user.bookings;
      }
    })
  
  }
  
  exportToExcel() {
    if (!this.currentBookings || this.currentBookings.length === 0) {
      return;
    }
  
    // Préparer les données formatées
    const formattedData = this.currentBookings.map((b) => ({
      "Date réservation": new Date(b.createdAt).toLocaleDateString("fr-FR"),
      "Statut": b.status,
      "Borne": b.chargingStation.nameStation,
      "Puissance (kW)": b.chargingStation.power,
      "Type de prise": b.chargingStation.plugType,
      "Début": new Date(b.startDate).toLocaleString("fr-FR"),
      "Fin": new Date(b.endDate).toLocaleString("fr-FR"),
      "Montant (€)": Number(b.totalAmount.toFixed(2))
    }));
  
    // Générer la feuille Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
    // Ajustement automatique de la largeur des colonnes
    const columnWidths = Object.keys(formattedData[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...formattedData.map((row) => (row as any)[key]?.toString().length || 10)
      ) + 2
    }));
    worksheet['!cols'] = columnWidths;
  
    // Créer le classeur
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Réservations");
  
    // Export
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
  
    const fileName = `mes_reservations_${new Date().toISOString().slice(0,10)}.xlsx`;
    saveAs(new Blob([excelBuffer]), fileName);
  }
  

}
