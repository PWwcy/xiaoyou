<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="所属商家" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入所属商家"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="下单人" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入下单人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入订单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="商品名称" prop="commodityName">
        <el-input
          v-model="queryParams.commodityName"
          placeholder="请输入商品名称"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['order:commodity:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['order:commodity:export']"
        >导出</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="commodityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="兑换时间" align="center" prop="id" />
      <el-table-column label="订单编号" width="240" align="center" prop="orderNumber" />
      <el-table-column label="所属商家" align="center" prop="storeName" />
      <el-table-column label="商品名称" align="center" prop="commodityName" />
      <el-table-column label="消费游豆" align="center" prop="consumptionBean" />
      <el-table-column label="下单人id" width="100" align="center" prop="userId" />
      <el-table-column label="下单人名称" align="center" prop="userName" />
      <el-table-column label="购买时间" align="center" prop="buyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.buyTime) }}</span>
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

    <!-- 添加或修改商品订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单编号" prop="orderNumber">
          <el-input v-model="form.orderNumber" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="所属商家" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入所属商家" />
        </el-form-item>
        <el-form-item label="消费游豆" prop="consumptionBean">
          <el-input-number
            v-model="form.consumptionBean"
            placeholder="请输入消费游豆"
            controls-position="right"
            :min="0"
          />
          <span class="my-unit-span">{{beanUnit}}</span>
        </el-form-item>
        <el-form-item label="下单人id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入下单人id" />
        </el-form-item>
        <el-form-item label="购买时间" prop="buyTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.buyTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择购买时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否使用" prop="isuse">
          <!-- <el-input v-model="form.isuse" placeholder="请输入是否使用 0 是 1 否" /> -->
          <el-radio-group v-model="form.isuse">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <!-- <el-radio label="1">请选择字典生成</el-radio> -->
            <el-radio :label="0">已使用</el-radio>
            <el-radio :label="1">未使用</el-radio>
            <el-radio :label="2">已过期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品id" prop="commodityId">
          <el-input v-model="form.commodityId" placeholder="请输入商品id" />
        </el-form-item>
        <el-form-item label="兑换时间" prop="exchangeTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.exchangeTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择兑换时间"
          ></el-date-picker>
        </el-form-item>
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
  listCommodity,
  getCommodity,
  delCommodity,
  addCommodity,
  updateCommodity,
  exportCommodity
} from "@/api/order/commodity";

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
      // 商品订单表格数据
      commodityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNumber: undefined,
        storeName: undefined,
        consumptionBean: undefined,
        userId: undefined,
        buyTime: undefined,
        isuse: undefined,
        status: undefined,
        commodityId: undefined,
        exchangeTime: undefined,
        commodityName: undefined,
        userName: undefined
      },
      // 表单参数
      form: {
        status: -1
      },
      // 表单校验
      rules: {
        orderNumber: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询商品订单列表 */
    getList() {
      this.loading = true;
      listCommodity(this.queryParams).then(response => {
        this.commodityList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        orderNumber: undefined,
        storeName: undefined,
        consumptionBean: undefined,
        userId: undefined,
        buyTime: undefined,
        isuse: 0,
        status: 0,
        commodityId: undefined,
        exchangeTime: undefined
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
      this.title = "添加商品订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCommodity(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商品订单";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateCommodity(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCommodity(this.form).then(response => {
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
        '是否确认删除商品订单编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delCommodity(ids);
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
      this.$confirm("是否确认导出所有商品订单数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportCommodity(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
