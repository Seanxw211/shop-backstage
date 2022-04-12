<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValue">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValue">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          border
          style="width: 100%"
          :data="spuImageList"
          @selection-change="handleSelectionChang"
        >
          <el-table-column prop="prop" type="selection" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" style="width: 100; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  name: "",
  data() {
    return {
      // 存储父组件给的spu
      spu: {},
      // 存储图片信息
      spuImageList: [],
      // 销售属性
      spuSaleAttrList: [],
      // 商品属性信息
      attrInfoList: [],
      // 收集sku数据
      skuInfo: {
        // 1、父组件给的
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 2、通过双向绑定收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        // 3、书写代码获取
        skuDefaultImg: "",
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      // 收集图片
      imageList: [],
    };
  },
  methods: {
    // 获取skuForm数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件数据
      this.spu = spu;
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      // 获取图片 reqSpuImageList
      let imgResult = await this.$API.sku.reqSpuImageList(spu.id);
      if (imgResult.code == 200) {
        let list = imgResult.data;
        // 拿到数据之后给每个图片数据加一个isDefault属性
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      // 销售属性  reqSpuSaleAttrList
      let saleResult = await this.$API.sku.reqSpuSaleAttrList(spu.id);
      if (saleResult.code == 200) {
        this.spuSaleAttrList = saleResult.data;
      }
      // 商品属性信息  reqAttrInfoList
      let attrResult = await this.$API.sku.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (attrResult.code == 200) {
        this.attrInfoList = attrResult.data;
      }
    },
    // table复选框按钮
    handleSelectionChang(params) {
      this.imageList = params;
    },
    // 设置默认图片
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 保存
    async save() {
      // 整理数据
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      // 平台属性
      let arr = [];
      attrInfoList.forEach((item) => {
        if (item.attrIdAndValue) {
          const [attrId, valueId] = item.attrIdAndValue.split(":");
          let obj = { attrId, valueId };
          arr.push(obj);
        }
      });
      skuInfo.skuAttrValueList = arr;
      // 销售属性 attrIdAndValue
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValue) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValue.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      // 图片列表
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      // 带给服务器
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({ type: "success", message: "添加SKU成功" });
        this.$emit("changeScene", { scene: 0, flag: "" });
      }
    },
    // 取消
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" });
      // 清理数据
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>
<style scoped>
</style>