<template>
  <div class="dashboard-editor-container">
    <panel-group v-if="today" @handleSetLineChartData="handleSetLineChartData" :detail="today" />

    <el-row v-if="xAxis" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" :x-axis="xAxis" height="500px" />
    </el-row>

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>-->
  </div>
</template>

<script>
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import RaddarChart from "./dashboard/RaddarChart";
import PieChart from "./dashboard/PieChart";
import BarChart from "./dashboard/BarChart";

import { homeData } from "@/api/index";

export default {
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      initData: {
        gameMoney: [],
        commodityBean: [],
        rechargeMoney: []
      },
      lineChartData: [],
      today: null,
      xAxis: null
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = this.initData[type];
    },
    getData() {
      homeData().then(res => {
        console.log(res);
        this.formatList(res.data.seven);
        this.today = res.data.today[0];
      });
    },
    formatList(data) {
      this.xAxis = [];
      data.forEach(item => {
        this.lineChartData.push(item.gameMoney);
        this.initData.gameMoney.push(item.gameMoney);
        this.initData.commodityBean.push(item.commodityBean);
        this.initData.rechargeMoney.push(item.rechargeMoney);
        this.xAxis.push(item.curr_day);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  min-height: calc(100vh - 84px);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
