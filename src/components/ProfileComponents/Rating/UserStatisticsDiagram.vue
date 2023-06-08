<template>
  <div class="chart-container">
    <canvas ref="radarChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.renderChart();
    window.addEventListener('resize', this.renderChart);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.renderChart);
    this.destroyChart();
  },
  methods: {
    renderChart() {
      if (!this.user) return;

      const ctx = this.$refs.radarChart.getContext('2d');
      this.destroyChart();

      const { skillsToTeach } = this.user;
      
      const skillLabels = skillsToTeach.map(skill => skill.skill);
      const skillRatings = skillsToTeach.map(skill => skill.rating);

      const pointBackgroundColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ];

      const backgroundColor = 'rgba(0, 123, 255, 0.2)';
      const borderColor = 'rgba(0, 123, 255, 1)';

      this.chart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: skillLabels,
          datasets: [{
            data: skillRatings,
            backgroundColor,
            borderColor,
            borderWidth: 1,
            pointBackgroundColor: skillRatings.map((_, index) => pointBackgroundColors[index % pointBackgroundColors.length]),
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: borderColor,
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: false
            }
          },
          scales: {
            r: {
              min: 0,
              max: 5,
              ticks: {
                display: false
              },
              pointLabels: {
                precision: 2
              }
            }
          }
        }
      });
    },
    destroyChart() {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: fit-content;
  margin: 0;
  padding: 0;
}
</style>
