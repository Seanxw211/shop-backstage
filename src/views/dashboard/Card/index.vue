<!-- 顶部card -->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥126560">
            <template slot="charts">
              <span>
                周同比&nbsp;&nbsp;56.67%&nbsp;
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
              </span>
              &nbsp;&nbsp;&nbsp;
              <span>
                日同比&nbsp;&nbsp;5.95%&nbsp;
                <svg
                  t="1649527457438"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="9014"
                  width="16"
                  height="16"
                >
                  <path
                    d="M458.854 701.962l-234.8-318.605a73.059 73.059 0 0 1 15.262-102.048l2.619-1.806a78.026 78.026 0 0 1 44.612-13.817h469.6a75.588 75.588 0 0 1 76.762 74.413 72.246 72.246 0 0 1-14.269 43.258l-234.8 318.605a78.477 78.477 0 0 1-107.195 17.25 77.213 77.213 0 0 1-17.791-17.25z"
                    p-id="9015"
                    fill="#0e932e"
                    data-spm-anchor-id="a313x.7781069.0.i5"
                    class="selected"
                  ></path>
                </svg>
              </span>
            </template>
            <template slot="footer">
              <span>日销售额 ￥12854</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="889684">
            <template slot="charts">
              <lineChart></lineChart>
            </template>
            <template slot="footer">
              <span>日访问量 51791</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="68451">
            <template slot="charts">
              <barChart></barChart>
            </template>
            <template slot="footer">
              <span>转化率 64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="76%">
            <template slot="charts">
              <progressChart></progressChart>
            </template>
            <template slot="footer">
              <span>
                周同比&nbsp;&nbsp;6.74%&nbsp;
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
              </span>
              &nbsp;&nbsp;&nbsp;
              <span>
                日同比&nbsp;&nbsp;3.55%&nbsp;
                <svg
                  t="1649527457438"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="9014"
                  width="16"
                  height="16"
                >
                  <path
                    d="M458.854 701.962l-234.8-318.605a73.059 73.059 0 0 1 15.262-102.048l2.619-1.806a78.026 78.026 0 0 1 44.612-13.817h469.6a75.588 75.588 0 0 1 76.762 74.413 72.246 72.246 0 0 1-14.269 43.258l-234.8 318.605a78.477 78.477 0 0 1-107.195 17.25 77.213 77.213 0 0 1-17.791-17.25z"
                    p-id="9015"
                    fill="#0e932e"
                    data-spm-anchor-id="a313x.7781069.0.i5"
                    class="selected"
                  ></path>
                </svg>
              </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import lineChart from "./lineChart";
import barChart from "./barChart";
import progressChart from "./progressChart";
export default {
  name: "",
  components: { Detail, lineChart, barChart, progressChart },
  data() {
    return {};
  },
};
</script>
<style scoped>
</style>