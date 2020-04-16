<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="活动标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入活动标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动描述" prop="describe">
        <el-input
          v-model="queryParams.describe"
          placeholder="请输入活动描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动内容" prop="content">
        <el-input
          v-model="queryParams.content"
          placeholder="请输入活动内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="外部链接" prop="link">
        <el-input
          v-model="queryParams.link"
          placeholder="请输入外部链接"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
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
          v-hasPermi="['activity:activity:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['activity:activity:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['activity:activity:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['activity:activity:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="activityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="活动id" align="center" prop="id" />
      <el-table-column label="活动标题" align="center" prop="title" />
      <el-table-column label="活动描述" align="center" prop="describe" />
      <el-table-column label="活动内容" align="center" prop="content" />
      <el-table-column label="是否免费" align="center" prop="isFree">
        <template slot-scope="scope">
          <span>{{formatStatus(scope.row.isFree)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所需游豆" align="center" prop="bean" />

      <el-table-column label="外部链接" align="center" prop="link">
        <template slot-scope="scope">
          <a
            class="other-link"
            :title="scope.row.link"
            :href="scope.row.link"
            target="_blank"
          >{{scope.row.link}}</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['activity:activity:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['activity:activity:remove']"
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

    <!-- 添加或修改活动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="活动描述" prop="describe">
          <el-input v-model="form.describe" placeholder="请输入活动描述" />
        </el-form-item>
        <el-form-item label="活动内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入活动内容" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="form.isFree" @change="oddsChange">
            <el-radio v-model="form.isFree" :label="0">免费</el-radio>
            <el-radio v-model="form.isFree" :label="1">收费</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="报名游豆" prop="link" v-show="isShow">
          <el-input v-model="form.bean" placeholder="请输入报名游豆" />
        </el-form-item>
        <el-form-item label="外部链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入外部链接" />
        </el-form-item>
        <el-form-item label="活动图片" prop="pictureList">
          <!--<el-upload-->
          <!--class="upload-demo"-->
          <!--:action="uploadFileUrl"-->
          <!--:on-preview="handlePreview"-->
          <!--:on-remove="handleRemove"-->
          <!--:before-remove="beforeRemove"-->
          <!--multiple-->
          <!--accept="image/*"-->
          <!--:limit="3"-->
          <!--:on-exceed="handleExceed"-->
          <!--:on-success="handleSuccess"-->
          <!--:file-list="fileList"-->
          <!--&gt;-->

          <el-upload
            :action="uploadFileUrl"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            multiple
            :on-success="handleSuccess"
            :file-list="uploadFileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!--<el-button size="small" type="primary">点击上传</el-button>-->
          <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->

          <!--</el-upload>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>-->
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="imgArr" />
  </div>
</template>

<script>
import {
  listActivity,
  getActivity,
  delActivity,
  addActivity,
  updateActivity,
  exportActivity
} from "@/api/activity/activity";

import mixins from "@/utils/mixin/upload";

export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
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
      // 活动表格数据
      activityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        describe: undefined,
        content: undefined,
        link: undefined
      },
      // 表单参数
      form: {
        pictureList: []
      },
      // 表单校验
      rules: {
        title: [
          { required: true, message: "活动标题不能为空", trigger: "blur" }
        ]
      },
      isShow: false,
      fileList: []
    };
  },
  created() {
    this.getList();
  },
  mixins: [mixins],
  methods: {
    /** 查询活动列表 */
    getList() {
      this.loading = true;
      listActivity(this.queryParams).then(response => {
        this.activityList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    oddsChange: function(val) {
      if (val == 0) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },

    handlePictureCardPreview1(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
        title: undefined,
        describe: undefined,
        content: undefined,
        link: undefined,
        pictureList: undefined,
        isFree: 0,
        bean: 0
      };
      this.resetForm("form");
    },
    formatStatus(val) {
      return val == 0 ? "免费" : val == 1 ? "收费" : "";
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
      this.title = "添加活动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getActivity(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改活动";
        if (response.data.isFree == 0) {
          this.isShow = false;
          this.form.bean = 0;
        } else {
          this.isShow = true;
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.form.pictureList = this.urlArrs;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateActivity(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addActivity(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
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
      this.$confirm('是否确认删除活动编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delActivity(ids);
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
      this.$confirm("是否确认导出所有活动数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportActivity(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style scoped>
.other-link {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
