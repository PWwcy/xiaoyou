<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="反馈人名称" prop="userName"  label-width="100px">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入反馈人名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="未处理" value="0" />
          <el-option label="已处理" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['service:feedback:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="feedbackList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="反馈图片" align="center" prop="picture" >
        <template slot-scope="scope">
          <img :src="scope.row.picture" class="td-img" @click="showImg(scope.row.picture)">
        </template>
      </el-table-column>
      <el-table-column label="反馈内容" align="center" prop="content" />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="联系方式" align="center" prop="contactMode" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span>{{formatStatus(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈人名称" align="center" prop="userName" />
      <el-table-column label="反馈时间" align="center" prop="createTime"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['service:feedback:edit']"
          >确认</el-button>
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

    <!-- 添加或修改反馈对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="反馈图片" prop="picture">
          <el-input v-model="form.picture" placeholder="请输入反馈图片" />
        </el-form-item>
        <el-form-item label="反馈内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入反馈内容" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>

        <el-form-item label="反馈人名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入反馈人名称" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contactMode">
          <el-input v-model="form.contactMode" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="状态 0：未处理、1：已处理">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="[bigImg]" />
  </div>
</template>

<script>
import { listFeedback, getFeedback, delFeedback, addFeedback, updateFeedback, exportFeedback } from "@/api/service/feedback";

export default {
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
      // 反馈表格数据
      feedbackList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        picture: undefined,
        content: undefined,
        userId: undefined,
        contactMode: undefined,
        status: undefined,
        userName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },

      showViewer:false,
      bigImg:''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询反馈列表 */
    getList() {
      this.loading = true;
      listFeedback(this.queryParams).then(response => {
        this.feedbackList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    showImg(data){
      this.bigImg = data;
      this.showViewer = true;
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
    },
    formatStatus(val) {
      return val==0 ? '未处理' : val == 1 ? '已处理' : ''
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
        picture: undefined,
        content: undefined,
        userId: undefined,
        createTime: undefined,
        contactMode: undefined,
        status: "0",
        userName: undefined
      };
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加反馈";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id || this.ids
      updateFeedback(id).then(response => {
        // this.form = response.data;
      /*  this.open = true;
        this.title = "修改反馈";*/
        if (response.code === 200) {
          this.msgSuccess("确认成功");
          this.open = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateFeedback(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addFeedback(this.form).then(response => {
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
      this.$confirm('是否确认删除反馈编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFeedback(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有反馈数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFeedback(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
