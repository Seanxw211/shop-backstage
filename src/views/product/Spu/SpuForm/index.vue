<!-- 添加或修改spu  -->
<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in unSelectSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 展示spu的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="160">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!--  @keyup.enter.native="handleInputConfirm" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!--  @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="120">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //存储spu信息
      spu: {
        category3Id: "",
        description: "",
        spuName: "",
        tmId: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          // baseSaleAttrId: 0,
          // id: 0,
          // saleAttrName: "",
          // spuId: 0,
          // spuSaleAttrValueList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   isChecked: "",
          //   saleAttrName: "",
          //   saleAttrValueName: "",
          //   spuId: 0,
          // },
          // ],
          // },
        ],
      },
      // 存储品牌信息
      trademarkList: [],
      // 存储spu图片
      spuImageList: [],
      // 存储销售属性列表
      saleAttrList: [],
      // 收集未选择的id
      attrIdAndAttrName: "",
    };
  },
  methods: {
    //   初始化spu数据
    async initSpuData(spu) {
      // 获取spu信息
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //   获取品牌信息
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      if (trademarkResult.code == 200) {
        this.trademarkList = trademarkResult.data;
      }
      // 获取spu图片
      let imageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (imageResult.code == 200) {
        //  处理数据
        let listArr = imageResult.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      // 获取销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 照片墙移除
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      // 收集照片墙数据
      this.spuImageList = fileList;
    },
    // 照片墙上传成功
    handleSuccess(response, file, fileList) {
      // console.log(response, file, fileList);
      this.spuImageList = fileList;
    },
    // 照片墙预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 添加销售属性
    addSaleAttr() {
      // 收集需要的销售属性信息
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      // 向spu对象spuSaleAttrList里添加
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndAttrName = "";
    },
    //添加按钮  row.inputValue
    addSaleAttrValue(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    // el-inpt失去焦点
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      // 判断
      if (inputValue.trim() == "") {
        this.$message("不能为空");
        return;
      }
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (!result) {
        this.$message("不能为重复");
        return;
      }
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      // 将输入的数据新增到销售属性值里
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
    },
    // 保存按钮  reqAddOrUpdateSpuInfo
    async addOrUpdateSpu() {
      // 整理参数
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      // 发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        // 切换到场景0页面
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "保存",
        });
      }
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 点击添加要发的请求
    async addSpuData(category3Id) {
      // 收集sence0传过来的 category3Id
      this.spu.category3Id = category3Id;
      //   获取品牌信息
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      if (trademarkResult.code == 200) {
        this.trademarkList = trademarkResult.data;
      }
      // 获取销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //取消
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" });
      // 清理数据
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    // 计算还未选择的销售属性
    unSelectSaleAttr() {
      // 平台的销售属性 saleAttrList
      // 当前的销售属性 spu.spuSaleAttrList
      let result = this.saleAttrList.filter((item) => {
        //every数组的方法，会返回一个布尔值【真，假的】
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style >
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>