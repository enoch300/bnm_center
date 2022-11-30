<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <v-chart
      :height="250"
      :data="data"
      :force-fit="true"
      :padding="['auto', 'auto', '40', '50']"
      :scale="scale"
    >
      <v-tooltip />
      <v-axis />
      <v-legend position="top"/>
      <v-smooth-area position="date*value" :color="['name', ['#1890FF', '#2FC25B', '#223273']]" />
    </v-chart>
  </div>
</template>

<script>
const scale = [
  {
    dataKey: 'value',
    alias: '带宽'
  }
]
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
  },
  created () {

  }
}
</script>
