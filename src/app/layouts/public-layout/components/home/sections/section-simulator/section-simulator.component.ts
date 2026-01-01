import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './section-simulator.component.html',
  styleUrl: './section-simulator.component.css',
})
export class SectionSimulatorComponent {

  // Prix moyen estimé du marché 
  readonly PRICE_PER_HOUR = 3.5;

  // Frais appliqués
  readonly FEES = 0.025; 

  // Valeur du slider (0 → 20 increments = 10 heures)
  sliderValue = 0;

  // Données affichées
  displayedTime = '0h00';
  dailyRevenue = '0,00';
  weeklyRevenue = '0,00';
  monthlyRevenue = '0,00';

  constructor() {
    this.updateSimulation();
  }

  updateSimulation() {
    // Convertit la valeur du slider (0–20) en heures → step = 0.5h
    const hours = this.sliderValue * 0.5;

    // Affichage formaté 0h00
    const h = Math.floor(hours);
    const m = hours % 1 === 0 ? '00' : '30';
    this.displayedTime = `${h}h${m}`;

    // Calcul brut
    const earned = hours * this.PRICE_PER_HOUR;

    // Application des frais
    const finalAmount = earned * (1 - this.FEES);

    // Revenus 
    const perDay = finalAmount;
    const perWeek = finalAmount * 7;
    const perMonth = finalAmount * 30;

    // Formatage FR
    this.dailyRevenue = perDay.toFixed(2).replace('.', ',');
    this.weeklyRevenue = perWeek.toFixed(2).replace('.', ',');
    this.monthlyRevenue = perMonth.toFixed(2).replace('.', ',');
  }
}
