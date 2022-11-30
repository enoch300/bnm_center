<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <v-chart
      height="250"
      :data="data"
      :forceFit="true"
      :padding="['auto', 'auto', '40', '50']"
      :scale="scale"
    >
      <v-tooltip />
      <v-axis />
      <v-bar position="name*total"/>
    </v-chart>
  </div>
</template>

<script>
const scale = [{
  dataKey: 'total',
  tickCount: 5,
  alias: '带宽'
}]
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      scale
    }
  }
}
</script>
