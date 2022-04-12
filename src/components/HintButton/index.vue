<template>
  <a :title="title" style="margin: 10px">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
import { title } from "@/settings";
export default {
  name: "HintButton",
  props: ["title"],
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>