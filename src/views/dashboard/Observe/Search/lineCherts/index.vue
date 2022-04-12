<template>
  <div>
    <div class="header">
      <span class="search-head">搜索用户数</span>
      <svg
        t="1649526008124"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2203"
        width="20"
        height="20"
      >
        <path
          d="M512 85.333333C276.48 85.333333 85.333333 276.48 85.333333 512S276.48 938.666667 512 938.666667 938.666667 747.52 938.666667 512 747.52 85.333333 512 85.333333z m0 796.444445c-203.662222 0-369.777778-166.115556-369.777778-369.777778S308.337778 142.222222 512 142.222222 881.777778 308.337778 881.777778 512 715.662222 881.777778 512 881.777778z"
          p-id="2204"
          fill="#707070"
        ></path>
        <path
          d="M549.546667 641.706667l-29.582223 15.928889c2.275556-12.515556 14.791111-62.577778 35.271112-152.462223 2.275556-9.102222 4.551111-36.408889-15.928889-47.786666-6.826667-3.413333-14.791111-3.413333-22.755556 0-9.102222 3.413333-17.066667 7.964444-23.893333 12.515555-4.551111 3.413333-25.031111 18.204444-60.302222 44.373334-6.826667 5.688889-9.102222 14.791111-4.551112 22.755555s13.653333 10.24 20.48 5.688889l34.133334-20.48-35.271111 150.186667c-3.413333 13.653333 1.137778 22.755556 7.964444 30.72 5.688889 6.826667 14.791111 11.377778 23.893333 11.377777 4.551111 0 7.964444-1.137778 11.377778-2.275555 6.826667-3.413333 31.857778-17.066667 76.231111-43.235556 7.964444-4.551111 11.377778-14.791111 5.688889-22.755555-3.413333-5.688889-13.653333-9.102222-22.755555-4.551111z"
          p-id="2205"
          fill="#707070"
        ></path>
        <path
          d="M523.377778 364.088889m-45.511111 0a45.511111 45.511111 0 1 0 91.022222 0 45.511111 45.511111 0 1 0-91.022222 0Z"
          p-id="2206"
          fill="#707070"
        ></path>
      </svg>
    </div>
    <div class="main">
      <span class="main-title">17234</span>
      <span class="main-contant">17.1</span>
      <svg
        t="1649527324445"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="8055"
        width="16"
        height="16"
      >
        <path
          d="M583.93 296.842l234.8 318.515a73.059 73.059 0 0 1-14.99 102.048l-2.62 1.806a78.116 78.116 0 0 1-44.612 13.908h-469.6a75.588 75.588 0 0 1-76.762-74.414 72.878 72.878 0 0 1 14.269-43.348l234.8-318.515a78.568 78.568 0 0 1 106.834-16.888 77.574 77.574 0 0 1 17.881 16.888z"
          p-id="8056"
          fill="#d81e06"
        ></path>
      </svg>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "",
  data() {
    return {};
  },
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置数据
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      //系列
      series: [
        {
          type: "line",
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
          smooth: true,
          //拐点的样式的设置
          itemStyle: {
            opacity: 0,
          },
          //线条的样式
          lineStyle: {
            color: "blue",
          },
          //填充颜色设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "blue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
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
.header {
  display: flex;
  text-align: center;
  color: gray;
}
.search-head {
  margin-right: 20px;
}
.main {
  margin: 10px 0;
}
.main-title {
  margin-right: 30px;
}
.main-contant {
  margin-right: 10px;
}
.charts {
  width: 100%;
  height: 50px;
}
</style>