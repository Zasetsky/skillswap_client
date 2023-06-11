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
      required: true
    }
  },

  data() {
    return {
      chart: null,
      selectedSkill: null
    };
  },

  mounted() {
    this.unwatchUser = this.$watch('user', (newVal) => {
      if (newVal && newVal.skillsToTeach) {
        this.renderChart();
      }
    }, { immediate: true });
    this.unwatchSelectedSkill = this.$store.watch(
      state => state.review.selectedSkill,
      newSkill => {
        this.selectedSkill = newSkill;
        this.updatePoints();
      }
    );
    window.addEventListener('resize', this.renderChart);
  },

  beforeDestroy() {
    if (this.unwatchUser) {
      this.unwatchUser();
    }
    if (this.unwatchSelectedSkill) {
      this.unwatchSelectedSkill();
    }
    window.removeEventListener('resize', this.renderChart);
    this.destroyChart();
  },

  methods: {
    updatePoints() {
      if (!this.chart) return;

      const { skillsToTeach } = this.user;

      const skillLabels = skillsToTeach.map(skill => skill.skill);

      const pointRadii = skillLabels.map(label => label === this.selectedSkill ? 7 : 3);
      const pointHoverRadii = skillLabels.map(label => label === this.selectedSkill ? 5 : 5);
      const pointBorderColors = skillLabels.map(label => label === this.selectedSkill ? 'rgba(0, 123, 255, 1)' : '#fff');

      this.chart.data.datasets[0].pointRadius = pointRadii;
      this.chart.data.datasets[0].pointHoverRadius = pointHoverRadii;
      this.chart.data.datasets[0].pointBorderColor = pointBorderColors;

      this.chart.update();
    },

    renderChart() {
      if (!this.user) return;

      const ctx = this.$refs.radarChart.getContext('2d');
      this.destroyChart();

      const { skillsToTeach } = this.user;
      
      const skillLabels = skillsToTeach.map(skill => skill.skill);
      const skillRatings = skillsToTeach.map(skill => skill.rating);

      const pointBackgroundColors = [
        'rgba(255, 99, 132, 1)',  // Bright red
        'rgba(153, 102, 255, 1)',  // Purple
        'rgba(255, 205, 86, 1)',  // Yellow
        'rgba(75, 192, 192, 1)',  // Teal
        'rgba(54, 162, 235, 1)',  // Blue
        'rgba(255, 159, 64, 1)',  // Orange
        'rgba(231, 76, 60, 1)',  // Dark Red
        'rgba(46, 204, 113, 1)',  // Emerald
        'rgba(52, 152, 219, 1)'  // Dark Blue
      ];

      const backgroundColor = 'rgba(0, 123, 255, 0.2)';
      const borderColor = 'rgba(0, 123, 255, 1)';

      const pointRadii = skillLabels.map(label => label === this.selectedSkill ? 5 : 3);
      const pointHoverRadii = skillLabels.map(label => label === this.selectedSkill ? 7 : 5);

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
            pointRadius: pointRadii,
            pointHoverRadius: pointHoverRadii
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
          },

          onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
          },

          onClick: (event, elements) => {
            if (elements.length > 0) {
              const chartElement = elements[0];
              const clickedSkill = this.chart.data.labels[chartElement.index];

              const currentSelectedSkill = this.$store.state.review.selectedSkill;
              const newSelectedSkill = currentSelectedSkill === clickedSkill ? null : clickedSkill;
              this.$store.commit('review/SET_SELECTED_SKILL', newSelectedSkill);
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
