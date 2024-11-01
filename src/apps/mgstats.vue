<script setup>
import { get, useDropZone } from '@vueuse/core'
import { onMounted, ref, useTemplateRef } from 'vue'
import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

class statPoint {
  constructor() {
    this.sourceFile = ''
    this.destinationFile = ''
    this.processorType = ''
    this.contentType = ''
    this.sourceFileSize = 0
    this.destinationFileSize = 0
    this.buildSeconds = 0
  }
}

var chart1 = null
var chart2 = null
var chart3 = null
var chart4 = null

const dropZoneRef = useTemplateRef('dropZoneRef')
const tableData = ref([])



function makeAvgSizeChart(divid, chartRef) {
  if (chartRef !== null) {
    chartRef.destroy()
  }

  let filter = tableData.value.slice(1)

  let contentLabels = Array.from(new Set(filter.map(x => x.contentType))).sort()
  let processorLabels = Array.from(new Set(filter.map(x => x.processorType))).sort()

  let sizeSourceAvg = []
  let sizeDestAvg = []
  let count = []

  contentLabels.forEach(x => {

    var avgSource = 0;
    var avgDest = 0;
    var count = 0;

    var filtered = filter.filter(y => y.contentType === x)

    count = filtered.length

    filtered.forEach(y => {
      avgSource += y.sourceFileSize
      avgDest += y.destinationFileSize
    })

    avgSource = avgSource / count
    avgDest = avgDest / count

    sizeSourceAvg.push(avgSource / 1024)
    sizeDestAvg.push(avgDest / 1024)
  })


  chartRef = new Chart(divid, {
    type: 'bar',

    data: {
      labels: contentLabels,
      datasets: [{
        backgroundColor: 'rgb(140,236,84)',
        label: 'Source',
        data: sizeSourceAvg,
        borderWidth: 1
      },
        {
          label: 'Destination',
          backgroundColor: 'rgb(84,213,236)',

          data: sizeDestAvg,
          borderWidth: 1
        }

      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Average Size (kb) By Content Type',
          padding: {
            top: 10,
            bottom: 30
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  return chartRef
}

function makeCountChart(divid, chartRef) {
  if (chartRef !== null) {
    chartRef.destroy()
  }

  let filter = tableData.value.slice(1)

  let contentLabels = Array.from(new Set(filter.map(x => x.contentType))).sort()
  let processorLabels = Array.from(new Set(filter.map(x => x.processorType))).sort()

  let sizeSourceAvg = []
  let sizeDestAvg = []
  let counts = []

  contentLabels.forEach(x => {

    var avgSource = 0;
    var avgDest = 0;
    var count = 0;

    var filtered = filter.filter(y => y.contentType === x)

    count = filtered.length

    filtered.forEach(y => {
      avgSource += y.sourceFileSize
      avgDest += y.destinationFileSize
    })

    avgSource = avgSource / count
    avgDest = avgDest / count

    sizeSourceAvg.push(avgSource)
    sizeDestAvg.push(avgDest)
    counts.push(count)
  })


  chartRef = new Chart(divid, {
    type: 'bar',

    data: {
      labels: contentLabels,
      title: 'Average File Size',
      datasets: [{
        backgroundColor: 'rgb(236,216,84)',
        label: 'Source',
        data: counts,
        borderWidth: 1
      }

      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Count By Content Type',
          padding: {
            top: 10,
            bottom: 30
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  return chartRef
}

function makeProcessCountChart(divid, chartRef) {
  if (chartRef !== null) {
    chartRef.destroy()
  }

  let filter = tableData.value.slice(1)

  let processorLabels = Array.from(new Set(filter.map(x => x.processorType))).sort()

  let sizeSourceAvg = []
  let sizeDestAvg = []
  let counts = []

  processorLabels.forEach(x => {

    var avgSource = 0;
    var avgDest = 0;
    var count = 0;

    var filtered = filter.filter(y => y.processorType === x)

    count = filtered.length

    filtered.forEach(y => {
      avgSource += y.sourceFileSize
      avgDest += y.destinationFileSize
    })

    avgSource = avgSource / count
    avgDest = avgDest / count

    sizeSourceAvg.push(avgSource / 1024)
    sizeDestAvg.push(avgDest / 1024)
    counts.push(count)
  })


  chartRef = new Chart(divid, {
    type: 'bar',

    data: {
      labels: processorLabels,
      title: 'Average File Size',
      datasets: [{
        backgroundColor: 'rgb(112,84,236)',
        label: 'Source',
        data: counts,
        borderWidth: 1
      }

      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Count By Processor',
          padding: {
            top: 10,
            bottom: 30
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  return chartRef
}

function makeAvgTimeChart(divid, chartRef) {
  if (chartRef !== null) {
    chartRef.destroy()
  }

  let filter = tableData.value.slice(1)

  let contentLabels = Array.from(new Set(filter.map(x => x.contentType))).sort()
  let processorLabels = Array.from(new Set(filter.map(x => x.processorType))).sort()

  let averageTimes = []
  let counts = []

  processorLabels.forEach(x => {

    var avgTime = 0;
var count = 0;

    var filtered = filter.filter(y => y.processorType === x)

    count = filtered.length

    filtered.forEach(y => {
      avgTime += y.buildSeconds
    })

    avgTime = avgTime / count

    averageTimes.push(avgTime)
  })


  chartRef = new Chart(divid, {
    type: 'bar',

    data: {
      labels: processorLabels,
      title: 'Average Processor Times',
      datasets: [{
        backgroundColor: 'rgb(175,84,236)',
        label: 'Processor',
        data: averageTimes,
        borderWidth: 1
      }

      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Average Time By Processor',
          padding: {
            top: 10,
            bottom: 30
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  return chartRef
}

function remakeTables() {
  var ctx = document.getElementById('chart1')
  chart1 = makeAvgSizeChart(ctx, chart1)

   ctx = document.getElementById('chart2')
  chart2  = makeCountChart(ctx, chart2)

   ctx = document.getElementById('chart3')
  chart3 = makeAvgTimeChart(ctx, chart3)

   ctx = document.getElementById('chart4')
  chart4 = makeProcessCountChart(ctx, chart4)
}







function onDrop(files) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target.result
    const lines = text.split('\n')

    tableData.value = []

    lines.forEach(line => {
       var row = line.split(',')
      if (row[0]) {
        var statpoint = new statPoint()
        statpoint.sourceFile = row[0].replaceAll('"', '')
        statpoint.destinationFile = row[1].replaceAll('"', '')
        statpoint.processorType = row[2].replaceAll('"', '')
        statpoint.contentType = row[3].replaceAll('"', '')
        statpoint.sourceFileSize =  parseFloat( row[4])
        statpoint.destinationFileSize =  parseFloat( row[5])
        statpoint.buildSeconds =  parseFloat( row[6])
        tableData.value.push(statpoint)
      }
    });

    remakeTables()

  }
  reader.readAsText(files[0])
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: onDrop,
  allowMultiple: false
  // specify the types of data to be received.

})
</script>

<template>

  <div ref="dropZoneRef" class="dropZone">
    Drop .mgstats file here
  </div>






  <div class="grid">
    <div class="div1">&nbsp; <canvas id="chart1"></canvas> </div>
    <div class="div1">&nbsp; <canvas id="chart2"></canvas> </div>
  </div>
  <div class="grid">
    <div class="div1">&nbsp; <canvas id="chart3"></canvas> </div>
    <div class="div1">&nbsp; <canvas id="chart4"></canvas> </div>
  </div>


  <div style="height: 50px; display: block;"></div>
  <h3>File Data</h3>
  <table style="font-size: smaller;">
    <tr v-for="row in tableData">
      <td v-for="cell in row">{{ cell }}</td>
    </tr>
  </table>



</template>

<style>
.dropZone {
  /* From https://css.glass */
  background: linear-gradient(to bottom right, rgba(205, 99, 24, 0.65), rgba(224, 104, 18, 0.77), rgba(224, 104, 18, 0.33));
  border-radius: 8px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(224, 104, 18, 0.3);
  display: flex;
  height: 100px;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: bold;
  font-size: larger;
  letter-spacing: 0.06em;
}
</style>