<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="data" :padding="[36, 5, 18, 5]" :scale="scale">
        <v-tooltip />
        <v-bar position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getRandomBetween } from '@/utils/util'
const data = []

for (let i = 0; i < 7; i++) {
  data.push({
    x: moment().subtract((6 - i), 'days').format('MM-DD'),
    y: getRandomBetween(600, 800)
  })
}
const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y
  })
]

const scale = [{
  dataKey: 'y',
  alias: '设备数'
}]

export default {
  name: 'MiniBar',
  data () {
    return {
      data,
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
