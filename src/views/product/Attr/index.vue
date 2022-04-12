<!-- Attr -->
<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCatgoryId="getCatgoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性
        </el-button>
        <!-- 表格 展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 修改或添加属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button>取消</el-button>
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column width="width" prop="prop" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                size="mini"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block">
                {{ row.valueName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column width="width" prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`这是确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash 中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",

      // 接收平台属性数据
      attrList: [],
      // 控制table展示
      isShowTable: true,
      // 收集修改或新增的属性
      attrInfo: {
        attrName: "", //属性名
        // 属性值
        attrValueList: [
          /* 点击添加之后才有
          {
            attrId: 0, //属性id
            valueName: "", //属性值
          },
          */
        ],
        categoryId: 0, //category3Id
        categoryLevel: 3, //level 3
      },
    };
  },
  methods: {
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
        this.getAttrList();
      }
    },
    // 获取平台属性
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值
    addAttrValue() {
      // 向attrInfo.attrValueList里添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //属性id
        valueName: "", //属性值
        // 给每一个属性值添加一个flag 用于input和span切换
        flag: true,
      });
      // 自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 失去焦点 变为查看模式
    toLook(row) {
      // row是用户添加的最新的属性值
      // 1、输入不能为空
      if (row.valueName.trim() == "") {
        this.$message("请你输入正常的属性值");
        return;
      }
      // 2、属性值不能重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        // 将自身排除
        if (row != item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) {
        this.$message("不能重复");
        return;
      }

      row.flag = false;
    },
    // 添加属性
    addAttr() {
      // 切换table
      this.isShowTable = false;
      // 清空attrInfo
      // 收集三级分类id
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 修改某个属性
    updateAttr(row) {
      // 切换table
      this.isShowTable = false;
      // 将row带到修改页面
      // 由于数据结构复杂 因此要用深拷贝
      this.attrInfo = cloneDeep(row);
      // 修改每一个属性时 相应的属性值加上flag标记
      this.attrInfo.attrValueList.forEach((item) => {
        // 用$set可以添加响应式数据
        this.$set(item, "flag", false);
      });
    },
    // 点击span转到input
    toEdit(row, index) {
      row.flag = true;
      // 获取input节点自动聚焦
      // 点击span的时候，页面重绘input，不可能立刻得到input的index
      // 利用$nextTick，当节点渲染完毕会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 气泡确认框 （删除属性值）
    // 当前删除不发请求 等到保存时再发
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存 修改属性
    async addOrUpdateAttr() {
      // 整理参数：1、空值不提交   2、数据中不应该有flag
      // filter会返回一个新的函数
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤掉不是空的
          if (item.valueName != "") {
            // 在删除flag
            delete item.flag;
            return true;
          }
        }
      );
      // 发请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        // 切换table页面
        this.isShowTable = true;
        // 提示成功
        this.$message({ type: "success", message: "保存成功" });
        // 再次获取
        this.getAttrList();
      } catch (error) {
        this.$message("保存失败");
      }
    },
  },
};
</script>
<style scoped>
</style>