<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="data" :padding="[36, 0, 18, 0]" :scale="scale">
        <v-tooltip />
        <v-smooth-area position="date*value" />
      </v-chart>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
// const data = []
// const beginDay = new Date().getTime()

// for (let i = 0; i < 10; i++) {
//   data.push({
//     x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
//     y: Math.round(Math.random() * 10)
//   })
// }

const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y
  })
]

const scale = [{
  dataKey: 'value',
  alias: '带宽'
}]

export default {
  name: 'MiniArea',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      tooltip,
      scale,
      height: 100
    }
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
