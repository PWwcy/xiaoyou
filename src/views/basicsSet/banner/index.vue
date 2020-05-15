<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="城市" prop="cityId">
        <v-distpicker
          class="city-select"
          size="small"
          :province="regionQuery.province"
          :city="regionQuery.city"
          :area="regionQuery.area"
          @province="onChangeProvince($event, 'regionQuery')"
          @city="onChangeCity($event, 'regionQuery')"
          @area="onChangeArea($event, 'regionQuery')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basicsSet:banner:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basicsSet:banner:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basicsSet:banner:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="bannerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <!-- <el-table-column label="城市id" align="center" prop="cityId" /> -->
      <el-table-column label="省" align="center" prop="province" />
      <el-table-column label="市" align="center" prop="city" />
      <el-table-column label="区/县" align="center" prop="area" />
      <el-table-column label="图片地址" align="center" prop="picture">
        <template slot-scope="scope">
          <img
            :src="scope.row.picture"
            width="40"
            height="40"
            class="head_pic"
            @click="showImg(scope.row.picture)"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basicsSet:banner:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basicsSet:banner:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改banner对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="类型 " prop="typeId">
          <el-radio-group v-model="form.typeId">
            <el-radio :label="0">活动</el-radio>
            <!--            <el-radio :label="1">html</el-radio>-->
            <el-radio :label="2">会员</el-radio>
            <el-radio :label="3">商品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型对应内容id" prop="contentId">
          <el-input v-model="form.contentId" placeholder="请输入类型对应内容id" />
        </el-form-item>
        <el-form-item label="城市">
          <!-- <el-input v-model="form.cityId" placeholder="请输入城市id" /> -->
          <v-distpicker
            class="city-select"
            size="small"
            :province="regionForm.province"
            :city="regionForm.city"
            :area="regionForm.area"
            @province="onChangeProvince($event, 'regionForm')"
            @city="onChangeCity($event, 'regionForm')"
            @area="onChangeArea($event, 'regionForm')"
          ></v-distpicker>
        </el-form-item>
        <el-form-item label="图片地址" prop="picture">
          <el-upload
            class="upload-demo"
            :action="uploadFileUrl"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="imgUpload"
            accept="image/*"
            :limit="1"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :file-list="uploadFileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500KB</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[bigImg]" />
  </div>
</template>

<script>
import {
  listBanner,
  getBanner,
  delBanner,
  addBanner,
  updateBanner,
  exportBanner
} from "@/api/basicsSet/banner";
import VDistpicker from "v-distpicker";

import upload from "@/utils/mixin/upload";
import region from "@/utils/mixin/region";
export default {
  components: {
    VDistpicker
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // banner表格数据
      bannerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeId: undefined,
        contentId: undefined,
        cityId: undefined,
        picture: undefined,
        province: undefined,
        city: undefined,
        area: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        picture: [{ required: true, message: "请选择图片", trigger: "change" }]
      },
      fileList: [],
      showViewer: false,
      bigImg: ""
    };
  },
  created() {
    this.getList();
  },
  mixins: [upload, region],
  methods: {
    /** 查询banner列表 */
    getList() {
      this.loading = true;
      this.initForm("queryParams");
      listBanner(this.queryParams).then(response => {
        this.bannerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    showImg(data) {
      this.bigImg = data;
      this.showViewer = true;
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },
    imgUpload(file) {
      return this.beforeUpload(file, 500 * 1024);
    },
    addSelected(data) {
      console.log(data);
      this.form.province = data.province.value;
      this.form.city = data.city.value;
      this.form.cityId = data.city.code;
      this.form.area = data.area.value;
    },
    // 图片选择
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleSuccess(response, file, fileList) {
      this.form.picture = response.data.picture;
      this.$refs["form"].clearValidate();
      this.msgSuccess("上传成功");
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove() {
      this.form.picture = undefined;
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        typeId: undefined,
        contentId: undefined,
        cityId: undefined,
        picture: undefined,
        sort: undefined,
        province: undefined,
        city: undefined,
        area: undefined
      };
      this.initFileList();
      this.resetRegion("form");
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加banner";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBanner(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.addFileList(this.form.picture);
        this.title = "修改banner";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.initForm("form");
          if (this.form.id != undefined) {
            updateBanner(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.reset();
                this.resetRegion("form");
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addBanner(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.reset();
                this.open = false;
                this.resetRegion("form");
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除banner编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delBanner(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有banner数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportBanner(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
