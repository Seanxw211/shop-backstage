<!-- 进程图 -->
<template>
  <div class="charts" ref="charts">123</div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "",
  mounted() {
    //初始化echarts实例
    let barCharts = echarts.init(this.$refs.charts);
    //配置数据
    barCharts.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [76],
          color: "yellowgreen",
          barWidth: 10,
          showBackground: true,
          //   label: {
          //     show: true,
          //   formatter: "|",
          //文本标签位置调试
          //   position: "right",
          //   },
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>
<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>