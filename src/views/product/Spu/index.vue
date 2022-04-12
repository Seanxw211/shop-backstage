<!-- Spu -->
<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCatgoryId="getCatgoryId" :show="scene != 0" />
    </el-card>
    <el-card>
      <!-- 底部有三部分切换 -->
      <!-- 展示spu列表的结构  (scene=0)-->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSpu"
          :disabled="!category3Id"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku"
                @click="handler(row)"
              ></hint-button>
              <el-popconfirm title="确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器  -->
        <el-pagination
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total"
          style="text-align: center"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <!-- 添加或修改spu (scene=1)-->
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <!-- 添加sku (scene=2)-->
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScene="changeScenes"
      ></SkuForm>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的SKU列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; heigh: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 控制table展示
      show: true,
      // 初始化
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      // 切换显示
      scene: 0,
      // 控制sku列表对话框显示与隐藏
      dialogTableVisible: false,
      // 显示sku列表
      spu: {},
      skuList: [],
      // 加载效果
      loading: true,
    };
  },
  methods: {
    // 三级联动自定义事件，可以把子组件id传给父组件
    getCatgoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 有了三级分类之后 就可以发请求了
        this.getSpuList();
      }
    },
    // 获取spu列表
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 每页展示的数据数量
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加spu按钮
    addSpu() {
      this.scene = 1;
      // 通知子组件SpuForm发请求--两个
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改spu按钮
    updateSpu(row) {
      this.scene = 1;
      // 获取子组件spuform 通过ref
      this.$refs.spu.initSpuData(row);
    },
    // spuForm通知父组件切换场景
    // flag区分是修改还是添加
    changeScene({ scene, flag }) {
      // 切换场景
      this.scene = scene;
      // 再次获取数据
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除spu
    async deleteSpu(row) {
      // reqDeleteSpu
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加sku
    addSku(row) {
      // 切换场景
      this.scene = 2;
      // 父组件调用子组件方法，让子组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // skuForm通知父组件切换场景
    changeScenes({ scene, flag }) {
      this.scene = scene;
      // 再次获取数据
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 查看sku列表 按钮
    async handler(row) {
      this.dialogTableVisible = true;
      this.spu = row;
      let result = await this.$API.spu.reqSkuList(row.id);
      if (result.code == 200) {
        this.skuList = result.data;
        // loading隐藏
        this.loading = false;
      }
    },
    // 关闭对话框
    close(done) {
      this.skuList = [];
      this.loading = true;
      done();
    },
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>
<style scoped>
</style>