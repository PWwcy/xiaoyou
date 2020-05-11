<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="供应商名称" prop="enterpriseName">
        <el-input
          v-model="queryParams.enterpriseName"
          placeholder="请输入供应商名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="contacts">
        <el-input
          v-model="queryParams.contacts"
          placeholder="请输入联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否使用自己支付" label-width="130px" prop="isownpayment">
        <el-select
          v-model="queryParams.isownpayment"
          placeholder="请输入是否使用自己支付"
          clearable
          size="small"
        >
          <el-option label="是" value="0" />
          <el-option label="否" value="1" />
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['deviceStore:deviceStore:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['deviceStore:deviceStore:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['deviceStore:deviceStore:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['deviceStore:deviceStore:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="deviceStoreList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="供应商ID" align="center" prop="id" />
      <el-table-column label="供应商名称" align="center" prop="enterpriseName" />
      <el-table-column label="联系人" align="center" prop="contacts" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="是否使用自己支付" align="center" prop="isownpayment">
        <template slot-scope="scope">
          <span>{{isSelf(scope.row.isownpayment)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付配置id" align="center" prop="paymentSetupId" />
      <!-- <el-table-column label="状态" align="center" :prop="deviceStoreStatus(status)" /> -->
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ deviceStoreStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="可用余额" align="center" prop="availableBalance" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <!-- <el-table-column label="是否删除 0 是 1 否" align="center" prop="isDel" /> -->
      <el-table-column label="是否删除" align="center" prop="isDel">
        <template slot-scope="scope">
          <span>{{ formatStatus(scope.row.isDel) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收入" align="center" prop="income" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['deviceStore:deviceStore:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['deviceStore:deviceStore:remove']"
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

    <!-- 添加或修改设备商对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="124px">
        <el-form-item label="设备商名称" prop="enterpriseName">
          <el-input v-model="form.enterpriseName" placeholder="请输入设备商名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态 " clearable size="small">
            <el-option label="正常" value="0" />
            <el-option label="停止" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否使用自己支付" prop="isownpayment">
          <el-radio-group v-model="form.isownpayment" @change="isShow">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="收款账号" prop="makeuser" v-if="form.isownpayment === 0">
          <el-input v-model="form.makeuser  " placeholder="请输入收款账号" />
        </el-form-item>-->

        <el-form-item label="商户号" prop="mchId" v-show="show">
          <el-input v-model="form.mchId" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="API密钥" prop="apiKey" v-show="show">
          <el-input v-model="form.apiKey" placeholder="请输入API密钥" />
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="form.remarks"
            placeholder="请输入备注"
            type="textarea"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="支付配置id" prop="paymentSetupId">
          <el-input v-model="form.paymentSetupId" placeholder="请输入支付配置id" />
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listDeviceStore,
  getDeviceStore,
  delDeviceStore,
  addDeviceStore,
  updateDeviceStore,
  exportDeviceStore,
  updateStatus
} from "@/api/deviceStore/deviceStore";

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
      // 设备商表格数据
      deviceStoreList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        enterpriseName: undefined,
        contacts: undefined,
        phone: undefined,
        address: undefined,
        isownpayment: undefined,
        paymentSetupId: undefined,
        status: undefined,
        remarks: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        enterpriseName: {
          required: true,
          message: "设备商名称不能为空",
          trigger: "blur"
        },
        phone: {
          required: true,
          message: "联系电话不能为空",
          trigger: "blur"
        }
        // makeuser: {
        //   required: true,
        //   message: "收款账号不能为空",
        //   trigger: "blur"
        // }
      },
      // 是否显示
      show: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    deviceStoreStatus(val) {
      return val == 0 ? "正常" : val == 1 ? "停止" : "";
    },
    isSelf(val) {
      return val == 0 ? "是" : val == 1 ? "否" : "";
    },

    isShow: function(val) {
      if (val == 0) {
        this.show = true;
      } else {
        this.show = false;
      }
    },
    /** 查询设备商列表 */
    getList() {
      this.loading = true;
      listDeviceStore(this.queryParams).then(response => {
        this.deviceStoreList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    formatStatus(val) {
      return val == 0 ? "是" : val == 1 ? "否" : "";
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
        enterpriseName: undefined,
        contacts: undefined,
        phone: undefined,
        address: undefined,
        isownpayment: 0,
        paymentSetupId: undefined,
        status: undefined,
        remarks: undefined
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
      this.title = "添加设备商";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      if (row.isownpayment == 0) {
        this.show = true;
      } else {
        this.show = false;
      }

      getDeviceStore(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备商";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDeviceStore(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDeviceStore(this.form).then(response => {
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
      this.$confirm('是否确认删除设备商编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return updateStatus(ids);
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
      this.$confirm("是否确认导出所有设备商数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportDeviceStore(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
