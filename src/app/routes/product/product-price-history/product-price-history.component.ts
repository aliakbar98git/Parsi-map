import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { IPriceHistory, IPriceHistoryList } from './../shared/product.model';

@Component({
  selector: 'app-product-price-history',
  templateUrl: './product-price-history.component.html',
  styleUrls: ['./product-price-history.component.scss']
})
export class ProductPriceHistoryComponent implements OnInit {
  @Input() productPrices: IPriceHistory;
  @Input() productName: string;

  labels: string[] = [];
  series: number[] = [];
  priceHistoryChart: any;

  constructor() { }

  ngOnInit(): void {

    this.productPrices.productPriceHistoryList.forEach((item: IPriceHistoryList) => {
      this.labels.push(item.persianDate);
      this.series.push(item.price);
    });

    this.priceHistoryChart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'قیمت کالا',
          data: this.series,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          lineTension: 0.05,
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontFamily: 'iranyekanFanum , tahoma',
              callback: function (value, index, values) {
                return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' تومان';
              }
            }
          }],
          xAxes: [{
            offset: true,
            ticks: {
              fontFamily: 'iranyekanFanum , tahoma',
              callback: function (value, index, values) {
                return value;
              }

            }
          }]
        },
        tooltips: {
          titleFontFamily: 'iranyekanFanum , tahoma',
          titleFontStyle: 'normal',
          titleAlign: 'center',
          bodyFontFamily: 'iranyekanFanum , tahoma',
          bodyFontStyle: 'normal',
          bodyAlign: 'center',
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          rtl: true,
          callbacks: {
            title: function (toolTipItem, data) {
              return toolTipItem[0].label;
            },
            label: function (toolTipItem, data) {
              return toolTipItem.yLabel.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' تومان';
            }
          }
        }
      }
    });
  }
}
