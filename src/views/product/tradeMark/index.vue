<!-- 品牌管理 -->
<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="shouDialog"
    >
      添加
    </el-button>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名词" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <!-- 作用域插槽 -->
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改
          </el-button>
          <el-button
            type="denger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- 
        layout:展示的内容 ->:表示靠最右
        :page-count 每页按钮数量 多余会折叠
     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :total="total"
      :page-count="7"
      layout="prev, pager, next, jumper,-> ,sizes, total"
    >
    </el-pagination>
    <!-- 对话框 -->
    <!-- 添加表单验证 -->
    <el-dialog
      :title="this.tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 表单 -->
      <!-- :model 收集表单数据到tmForm -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名词" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 不是表单元素不能v-model收集 
              action:图片上传地址 /dev-api 让服务器代理转发
              :on-success：可以检测图片是否上传成功 成功执行一次
              :before-upload：上传之前执行一次
              -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  name: "tradeMark",
  data() {
    return {
      // 分页器第几页
      page: 1,
      //当前页展示数据数量
      limit: 3,
      // 列表展示数据
      list: [],
      //总共数据条数
      total: 0,
      //对话框显示与隐藏
      dialogFormVisible: false,
      // 商品LOGO
      imageUrl: "",
      // 收集品牌信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 上传商品LOGO
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // 直接收集到tmForm  方便带给服务器
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 修改品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      // row可以得到选中品牌的信息
      // console.log(row);
      // 将点击的品牌已右的信息展示
      // 需要浅拷贝  否则修改时会直接修改row 点‘取消’也会row被修改
      this.tmForm = { ...row };
    },
    // 添加或更新品牌 （确定按钮）
    addOrUpdate() {
      // 确认表单符合规则
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          // 发请求
          let result = await this.$API.tradeMark.reqAddOrUpdateTrademark(
            this.tmForm
          );
          if (result.code == 200) {
            this.$message({
              //提示信息的类型
              type: "success",
              // 信息内容
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 如果添加品牌留在第一页 如果修改品牌留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit！");
          return false;
        }
      });
    },
    // 点击弹窗对话框
    shouDialog() {
      this.dialogFormVisible = true;
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 获取品牌列表数据
    async getPageList(pager = 1) {
      this.page = pager;

      // 解构参数
      const { page, limit } = this;
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 分页器
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //删除品牌
    deleteTradeMark(row) {
      //弹框
      this.$confirm(`你确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //当用户点击确定按钮的时候会出发
          //向服务器发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          //如果删除成功
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //再次获取品牌列表数据
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch(() => {
          //当用户点击取消按钮的时候会触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>