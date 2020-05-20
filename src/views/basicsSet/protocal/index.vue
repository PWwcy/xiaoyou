<template>
  <div class="yh-body">
    <el-form class="el-form" ref="form" :model="form" label-position="top" :rules="rules">
      <!-- <el-row>
      <el-col>-->
      <el-form-item label="用户协议">
        <Editor v-model="form.useProtocol" :height="300" />
      </el-form-item>
      <!-- </el-col>
      </el-row>-->
    </el-form>
    <div class="dialog-footer" style="padding-top:20px;margin-top: 100px">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </div>
</template>


<script>
import {
  listProtocal,
  getProtocal,
  delProtocal,
  addProtocal,
  updateProtocal,
  exportProtocal
} from "@/api/basicsSet/protocal";
import Editor from "@/components/Editor";
export default {
  components: {
    Editor
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
      // 使用协议表格数据
      protocalList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        useProtocol: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        useProtocol: [
          { required: true, message: "使用协议不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询使用协议列表 */
    getList() {
      this.loading = true;
      listProtocal(this.queryParams).then(response => {
        this.form = response.rows[0];
        // this.total = response.total;
        // this.loading = false;
      });
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
        useProtocol: undefined
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加使用协议";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getProtocal(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改使用协议";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateProtocal(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("保存成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addProtocal(this.form).then(response => {
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
      this.$confirm(
        '是否确认删除使用协议编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delProtocal(ids);
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
      this.$confirm("是否确认导出所有使用协议数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportProtocal(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style lang="scss" scoped>
.yh-body {
  padding: 5%;
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    button {
      width: 120px;
    }
  }
}
</style>
