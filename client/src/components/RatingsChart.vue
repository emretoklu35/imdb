<!-- Dosya Yolu: client/src/components/RatingsChart.vue (YENİ DOSYA) -->
<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  distribution: { score: number; count: string }[]
}>()

const chartData = computed(() => {
  const labels = Array.from({ length: 10 }, (_, i) => (10 - i).toString()) // ['10', '9', ..., '1']
  const data = new Array(10).fill(0)

  props.distribution.forEach((item) => {
    // item.score 1'den 10'a kadar. İndeks 0'dan 9'a kadar.
    const index = 10 - item.score
    data[index] = parseInt(item.count, 10)
  })

  return {
    labels,
    datasets: [
      {
        label: 'Number of Ratings',
        backgroundColor: '#f5c518', // IMDb sarısı
        borderColor: 'rgba(245, 197, 24, 0.4)',
        borderWidth: 1,
        data,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const, // Yatay çubuk grafik için
  scales: {
    x: {
      ticks: { color: '#ccc' },
      grid: { color: '#444' },
    },
    y: {
      ticks: { color: '#ccc' },
      grid: { color: 'transparent' },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return `${context.raw} votes`
        },
      },
    },
  },
}
</script>
