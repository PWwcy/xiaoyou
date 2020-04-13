<template>
  <div class="app-container">
    <!--  label-width="68px" -->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="地区">
        <v-distpicker
          class="city-select"
          size="small"
          :province="queryParams.province"
          :city="queryParams.city"
          :area="queryParams.area"
          @selected="onSelected"
        ></v-distpicker>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态 " prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择账号状态 " clearable size="small">
          <el-option label="正常" value="0" />
          <el-option label="禁用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型 " prop="status">
        <el-select v-model="queryParams.type" placeholder="用户类型 " clearable size="small">
          <el-option label="普通用户" value="0" />
          <el-option label="会员会员" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item class="last-time" label="最后登录时间" prop="lastLoginTime" style="width: 300px">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.lastLoginTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择最后一次登录时间"
        ></el-date-picker>
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
          v-hasPermi="['api:user:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['api:user:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['api:user:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['api:user:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户id" align="center" prop="id" />
      <el-table-column label="昵称" align="center" prop="nickname" />
      <el-table-column label="用户头像" align="center" prop="avatarUrl">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" alt class="td-img" @click="showImg(scope.row.avatarUrl)" />
        </template>
      </el-table-column>
      <el-table-column label="省份" align="center" prop="province" />
      <el-table-column label="城市" align="center" prop="city" />
      <el-table-column label="消费总金额" align="center" prop="totalMoney" />
      <el-table-column label="消费游豆数量" align="center" prop="totalBean" />
      <el-table-column label="剩余游豆数量" align="center" prop="gameBean" />
      <el-table-column label="消费次数" align="center" prop="totalNum" />
      <el-table-column label="用户积分" align="center" prop="totalIntegral" />
      <el-table-column label="电话号码" align="center" prop="phone" />
      <el-table-column label="用户性别" align="center" prop="sex">
        <template slot-scope="scope">
          <span>{{userSex(scope.row.type)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="用户类型 " align="center" prop="type">
        <template slot-scope="scope">
          <span>{{userType(scope.row.type)}}</span>
        </template>
      </el-table-column>

      <el-table-column label="最后登录时间" align="center" prop="lastLoginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastLoginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/user/consumption/data/' + scope.row.id" class="link-type">
            <el-button size="mini" type="text" icon="el-icon-tickets">消费详细</el-button>
          </router-link>
          <router-link :to="'/user/integral/data/' + scope.row.id" class="link-type">
            <el-button size="mini" type="text" icon="el-icon-tickets">积分详细</el-button>
          </router-link>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="handleDelete(scope.row)"
            v-hasPermi="['api:user:remove']"
          >积分详细</el-button>-->
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

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="openId" prop="openid">
          <el-input v-model="form.openid" placeholder="请输入openId" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="用户头像" prop="avatarUrl">
          <!-- <el-input v-model="form.avatarUrl" placeholder="请输入用户头像" /> -->
          <el-upload
            class="upload-demo"
            action="http://47.97.180.206:8081/api/file"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            accept="image/*"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :file-list="fileList"
          >
            <!-- :limit="1" -->
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="游豆数量" prop="gameBean">
          <el-input-number
            controls-position="right"
            v-model="form.gameBean"
            placeholder="请输入游豆数量"
            :min="0"
          />
          <span class="my-unit-span">{{beanUnit}}</span>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number
            :min="0"
            controls-position="right"
            v-model="form.age"
            placeholder="请输入年龄"
          />
        </el-form-item>
        <el-form-item label="地区">
          <v-distpicker
            class="city-select"
            size="small"
            :province="form.province"
            :city="form.city"
            :area="form.area"
            @selected="addSelected"
          ></v-distpicker>
        </el-form-item>
        <el-form-item label="用户性别">
          <!-- <el-select v-model="form.sex" placeholder="请选择用户性别">
            <el-option label="请选择字典生成" value />
          </el-select>-->
          <el-radio-group v-model="form.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号状态 " prop="status">
          <el-radio-group v-model="form.status">
            <!-- <el-radio label="1">请选择字典生成</el-radio> -->
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="最后一次登录时间" prop="lastLoginTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.lastLoginTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择最后一次登录时间"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item label="用户类型 " prop="type">
          <el-radio-group v-model="form.type">
            <!-- <el-option label="请选择字典生成" value /> -->
            <el-radio :label="0">普通用户</el-radio>
            <el-radio :label="1">会员用户</el-radio>
          </el-radio-group>
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
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  exportUser,
  changeUserStatus
} from "@/api/userAdmin/userAdmin";

import Editor from "@/components/Editor";
import VDistpicker from "v-distpicker";

export default {
  components: {
    Editor,
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
      // 用户表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        openid: undefined,
        nickname: undefined,
        avatarUrl: undefined,
        phone: undefined,
        sex: undefined,
        age: undefined,
        status: undefined,
        gameBean: undefined,
        lastLoginTime: undefined,
        type: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        userId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        openid: [
          { required: true, message: "openId不能为空", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "昵称不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择账号状态", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择用户类型", trigger: "blur" }]
      },
      fileList: [],
      showViewer: false,
      bigImg: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then(response => {
        this.userList = response.rows;
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleSuccess(response, file, fileList) {
      this.form.avatarUrl = response.data.picture;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    userType(val) {
      return val == 0 ? "普通" : val == 1 ? "会员" : "";
    },
    userSex(val) {
      return val == 0 ? "男" : val == 1 ? "女" : "";
    },

    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "禁用";
      this.$confirm('确认要"' + text + '""' + row.nickname + '"吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return changeUserStatus(row.id, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    onSelected(data) {
      this.queryParams.province = data.province.value;
      this.queryParams.city = data.city.value;
      this.queryParams.area = data.area.value;
    },
    addSelected(data) {
      this.form.province = data.province.value;
      this.form.city = data.city.value;
      this.form.area = data.area.value;
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
        openid: undefined,
        nickname: undefined,
        avatarUrl: undefined,
        phone: undefined,
        sex: undefined,
        age: undefined,
        status: "0",
        gameBean: undefined,
        createTime: undefined,
        lastLoginTime: undefined,
        type: 0
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
      this.title = "添加用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getUser(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addUser(this.form).then(response => {
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
      this.$confirm('是否确认删除用户编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delUser(ids);
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
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportUser(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
