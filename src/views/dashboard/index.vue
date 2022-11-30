<template>
  <div>
    <!-- 顶部汇总 -->
    <a-row :gutter="24">
      <!-- 总储存带宽 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('dashboard.analysis.total-sales')" total="2000G">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">{{ $t('dashboard.analysis.week') }}</span>
              60%
            </trend>
            <trend flag="down">
              <span slot="term">{{ $t('dashboard.analysis.day') }}</span>
              11%
            </trend>
          </div>
          <template slot="footer">
            {{ $t('dashboard.analysis.day-sales') }}
            <span>52G</span>
          </template>
        </chart-card>
      </a-col>
      <!-- 带宽趋势 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('dashboard.analysis.visits')" total="500G">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :data="minAreaData"/>
          </div>
          <template slot="footer">
            {{ $t('dashboard.analysis.day-visits') }}
            <span> {{ '500G' | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>
      <!-- 总设备数 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('dashboard.analysis.payments')" :total="800 | NumberFormat">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar />
          </div>
          <template slot="footer">{{ $t('dashboard.analysis.conversion-rate') }} <span>60%</span></template>
        </chart-card>
      </a-col>
      <!-- 设备利用率 -->
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="$t('dashboard.analysis.operational-effect')" total="78%">
          <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">{{ $t('dashboard.analysis.week') }}</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">{{ $t('dashboard.analysis.day') }}</span>
              80%
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row>
    <!--中间排行  -->
    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <!-- 时间筛选 -->
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a @click="dateIndex = 0" :class="[dateIndex === 0 ? 'date-active' : '']">{{ $t('dashboard.analysis.all-day') }}</a>
              <a @click="dateIndex = 1" :class="[dateIndex === 1 ? 'date-active' : '']">{{ $t('dashboard.analysis.all-week') }}</a>
              <a @click="dateIndex = 2" :class="[dateIndex === 2 ? 'date-active' : '']">{{ $t('dashboard.analysis.all-month') }}</a>
              <!-- <a @click="changeDate(3)" :class="[dateIndex === 3 ? 'date-active' : '']">{{ $t('dashboard.analysis.all-year') }}</a> -->
            </div>
            <!-- <a-range-picker :style="{width: '256px'}" /> -->
          </div>
          <!-- 客户带宽排行 -->
          <a-tab-pane loading="true" :tab="$t('dashboard.analysis.sales-ranking')" key="1">
            <a-row>
              <a-col :xl="15" :lg="12" :md="12" :sm="24" :xs="24">
                <content-bar :data="barData[dateIndex]" :title="$t('dashboard.analysis.sales-ranking')"/>
              </a-col>
              <a-col :xl="9" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list :title="$t('dashboard.analysis.sales-ranking')" :list="rankList[dateIndex]"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <!-- 客户带宽趋势 -->
          <a-tab-pane :tab="$t('dashboard.analysis.visits-trend')" key="2">
            <a-row>
              <a-col :xl="15" :lg="12" :md="12" :sm="24" :xs="24">
                <content-area :data="areaData[dateIndex]" :title="$t('dashboard.analysis.visits-trend')"/>
              </a-col>
              <a-col :xl="9" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list :title="$t('dashboard.analysis.visits-ranking')" :list="rankList2[dateIndex]"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <!-- 底部图表 -->
    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <!-- 区域带宽排行 -->
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :loading="loading" :bordered="false" :title="$t('dashboard.analysis.online-top-search')" :style="{ height: '100%' }">
            <!-- 操作 -->
            <a-dropdown :trigger="['click']" placement="bottomLeft" slot="extra">
              <a class="ant-dropdown-link" href="#">
                <a-icon type="ellipsis" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;">{{ $t('dashboard.analysis.all-day') }}</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">{{ $t('dashboard.analysis.all-week') }}</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">{{ $t('dashboard.analysis.all-month') }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <!-- 搜索数据小区域图表 -->
            <a-row :gutter="68">
              <!-- 搜索用户数 -->
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                <number-info :total="12321" :sub-total="17.1">
                  <span slot="subtitle">
                    <span>{{ $t('dashboard.analysis.search-users') }}</span>
                    <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }" />
                    </a-tooltip>
                  </span>
                </number-info>
                <!-- miniChart -->
                <div>
                  <mini-smooth-area :style="{ height: '45px' }" :dataSource="searchUserData" :scale="searchUserScale" />
                </div>
              </a-col>
              <!-- 人均搜索次数 -->
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                <number-info :total="2500" :sub-total="26.2" status="down">
                  <span slot="subtitle">
                    <span>{{ $t('dashboard.analysis.per-capita-search') }}</span>
                    <a-tooltip :title="$t('dashboard.analysis.introduce')" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }" />
                    </a-tooltip>
                  </span>
                </number-info>
                <!-- miniChart -->
                <div>
                  <mini-smooth-area :style="{ height: '45px' }" :dataSource="searchUserData" :scale="searchUserScale" />
                </div>
              </a-col>
            </a-row>
            <!-- 排行表 -->
            <div class="ant-table-wrapper">
              <a-table
                row-key="index"
                size="small"
                :columns="searchTableColumns"
                :dataSource="searchData"
                :pagination="{ pageSize: 5 }"
              >
                <span slot="range" slot-scope="text, record">
                  <trend :flag="record.status === 0 ? 'up' : 'down'">
                    {{ text }}%
                  </trend>
                </span>
              </a-table>
            </div>
          </a-card>
        </a-col>
        <!-- 客户带宽占比 -->
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" :title="$t('dashboard.analysis.the-proportion-of-sales')" :style="{ height: '100%' }">
            <div slot="extra" style="height: inherit;">
              <span class="dashboard-analysis-iconGroup">
                <a-dropdown :trigger="['click']" placement="bottomLeft">
                  <a-icon type="ellipsis" class="ant-dropdown-link" />
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a @click="pieIndex = 0" :class="[pieIndex === 0 ? 'piedate-active' : '']">{{ $t('dashboard.analysis.all-day') }}</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click="pieIndex = 1" :class="[pieIndex === 1 ? 'piedate-active' : '']">{{ $t('dashboard.analysis.all-week') }}</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click="pieIndex = 2" :class="[pieIndex === 2 ? 'piedate-active' : '']">{{ $t('dashboard.analysis.all-month') }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
              <div class="analysis-salesTypeRadio">
                <a-radio-group :default-value="0">
                  <a-radio-button :value="0">{{ $t('dashboard.analysis.channel.all') }}</a-radio-button>
                  <!-- <a-radio-button :value="1">{{ $t('dashboard.analysis.channel.online') }}</a-radio-button>
                  <a-radio-button :value="2">{{ $t('dashboard.analysis.channel.stores') }}</a-radio-button> -->
                </a-radio-group>
              </div>
            </div>
            <!-- 饼状图 -->
            <content-pie :data="pieData[pieIndex]" :title="$t('dashboard.analysis.sales-trend')"/>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
  MiniArea,
  MiniBar,
  MiniProgress,
  MiniSmoothArea,
  ChartCard,
  Trend,
  NumberInfo,
  RankList
} from '@/components'
import { getRandomBetween } from '@/utils/util'
// import { getBillingCount } from '@/api/dashboard'
import { ContentBar, ContentArea, ContentPie } from './modules'
import { baseMixin } from '@/store/app-mixin'

// 底部图表数据
const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment().add(i, 'days').format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}
const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '用户数',
    min: 0,
    max: 10
  }]
const ispMap = ['移动', '联通', '电信']
const areaMap = ['华东', '华南', '华北', '西南', '东北', '西北']
const searchData = []
for (let i = 0; i < 18; i += 1) {
  const areaInd = parseInt(i / 3)
  const ispInd = i % 3
  searchData.push({
    keyword: `${areaMap[areaInd]}-${ispMap[ispInd]}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  })
}
searchData.sort((a, b) => {
    return b.count - a.count
})
searchData.forEach((item, index) => {
  item.index = index + 1
})

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Trend,
    NumberInfo,
    MiniSmoothArea,
    ContentBar,
    ContentArea,
    ContentPie
  },
  data () {
    return {
      loading: true,
      // 总带宽趋势
      minAreaData: [],
      // 搜索用户数
      searchUserData,
      searchUserScale,
      searchData,
      // 客户带宽排行
      dateIndex: 1,
      barData: [],
      rankList: [],
      // 客户带宽趋势排行
      areaData: [],
      rankList2: [],
      // 饼图
      pieIndex: 1,
      pieData: []
    }
  },
  computed: {
    searchTableColumns () {
      return [
        {
          dataIndex: 'index',
          title: this.$t('dashboard.analysis.table.rank'),
          width: 90
        },
        {
          dataIndex: 'keyword',
          title: this.$t('dashboard.analysis.table.search-keyword')
        },
        {
          dataIndex: 'count',
          title: this.$t('dashboard.analysis.table.users')
        },
        {
          dataIndex: 'range',
          title: this.$t('dashboard.analysis.table.weekly-range'),
          align: 'right',
          sorter: (a, b) => a.range - b.range,
          scopedSlots: { customRender: 'range' }
        }
      ]
    }
  },
  created () {
    this.getAllArea()
    this.getbarData(1)
    this.getAreaData(1)
    this.getPieData()
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  watch: {
    dateIndex (val) {
      if (!this.barData[val]) {
        this.getbarData(val)
      }
      if (!this.areaData[val]) {
        this.getAreaData(val)
      }
    }
  },
  methods: {
    onChange (e) {
      console.log(`checked = ${e.target.value}`)
    },
    getAllArea () {
      const list = []
      for (let i = 0; i < 7; i++) {
        list.push({
          date: moment().subtract((6 - i), 'days').format('YYYY-MM-DD'),
          value: getRandomBetween(500, 800)
        })
      }
      this.minAreaData = list
      // getBillingCount().then(res => {
      //   if (res.code === 0) {
      //     if (res.data.length === 0) {
      //       const list = []
      //       for (let i = 0; i < 7; i++) {
      //         list.push({
      //           date: moment().subtract((6 - i), 'days').format('YYYY-MM-DD'),
      //           value: getRandomBetween(300, 800)
      //         })
      //       }
      //       this.minAreaData = list
      //     } else {
      //       this.formatData(res.data)
      //     }
      //   }
      // })
    },
    formatData (data) {
      const list = []
      const dateArr = []
      data.forEach(item => {
        const date = item.t.split(' ')[0]
        const dateIndex = dateArr.indexOf(date)
        if (dateIndex === -1) {
          dateArr.push(date)
          list.push({
            date: date,
            value: item.sendByteAvg
          })
        } else {
          if (item.sendByteAvg > list[dateIndex].value) {
            list[dateIndex].value = item.sendByteAvg
          }
        }
      })
      this.minAreaData = list
    },
    // 带宽排行
    getbarData (type) {
      const step = [1, 7, 30, 365]
      const min = [50, 35, 23, 19, 8]
      const max = [75, 50, 35, 23, 19]
      const name = ['头条', '抖音', '快手', '百度', '腾讯']
      const barData = []
      for (let index = 0; index < 5; index++) {
        barData.push({
          name: name[index],
          total: getRandomBetween(min[index] * step[type], max[index] * step[type])
        })
      }
      const rankList = []
      barData.forEach(item => {
        rankList.push({
          name: item.name,
          total: item.total + 'G'
        })
      })
      this.barData[type] = barData
      this.rankList[type] = rankList
    },
    // 带宽趋势排行
    getAreaData (type) {
      const startHour = moment().format('H')
      const startWeek = moment().startOf('week').subtract('week', 1).format('YYYY-MM-DD')
      const startMonth = moment().startOf('month').subtract('month', 1).format('YYYY-MM-DD')
      const startYear = moment().startOf('year').subtract('year', 1).format('YYYY-MM-DD')
      const dateArr = [startHour, startWeek, startMonth, startYear]
      const step = [parseInt(startHour) + 1, 7, 30, 365]
      const areaData = []
      for (let i = 0; i < step[type]; i++) {
        let date = ''
        if (type === 0) {
          date = moment().subtract('hour', dateArr[type] - i).format('HH') + ':00'
        } else {
          date = moment(dateArr[type]).add(i, 'days').format('YYYY-MM-DD')
        }
        areaData.push({
          name: '头条',
          date: date,
          value: getRandomBetween(350, 500)
        })
        areaData.push({
          name: '抖音',
          date: date,
          value: getRandomBetween(200, 350)
        })
        areaData.push({
          name: '快手',
          date: date,
          value: getRandomBetween(50, 200)
        })
      }
      const rankList2 = []
      const nameMap = []
      areaData.forEach(item => {
        const ind = nameMap.indexOf(item.name)
        if (ind === -1) {
          rankList2.push({
            name: item.name,
            total: item.value
          })
          nameMap.push(item.name)
        } else {
          if (item.value > rankList2[ind].total) {
            rankList2[ind].total = item.value
          }
        }
      })
      this.areaData[type] = areaData
      this.rankList2[type] = rankList2
    },
    // 带宽占比
    getPieData () {
      this.pieData = [
        [
          { item: '头条', count: 35 },
          { item: '抖音', count: 25 },
          { item: '快手', count: 15 },
          { item: '百度', count: 13 },
          { item: '腾讯', count: 12 }
        ],
        [
          { item: '头条', count: 32 },
          { item: '抖音', count: 27 },
          { item: '快手', count: 16 },
          { item: '百度', count: 14 },
          { item: '腾讯', count: 11 }
        ],
        [
          { item: '头条', count: 38 },
          { item: '抖音', count: 22 },
          { item: '快手', count: 18 },
          { item: '百度', count: 12 },
          { item: '腾讯', count: 10 }
        ]
      ]
    }
  }
}
</script>

<style lang="less" scoped>
  .date-active {
    color: #223273
  }
  .piedate-active{
    color: #1890FF;
  }
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    :deep(.ant-card-head) {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>
