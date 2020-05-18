export default {
  data() {
    return {
      uploadFileList: [],
      urlArr: [],
      bigImg: null,
      showViewer: false,
      imgTypeArr: ['jpg', 'jpeg', 'png']

    }
  },
  computed: {
    urlArrs() {
      return this.urlArr.length > 0 ? this.urlArr : [];
    },
    imgArr() {
      if (this.bigImg && typeof this.bigImg === "string") {
        return [this.bigImg];
      } else if (this.bigImg) {
        return this.bigImg;
      }
    }
  },
  methods: {
    initFile() {
      if (this.uploadFileList.length > 0) {
        return this.uploadFileList.map(item => {
          return item.response.data.picture;
        })
      }
      return undefined;
    },
    addFileList(data) {
      if (typeof data === 'string') {
        data = data.split(',');
        data.forEach(item => {
          let obj = {
            url: item,
            name: item.split('-').pop(),
            uid: parseInt(Math.random() * 1000000)
          }
          this.uploadFileList.push(obj)
        })
      }
    },
    initFileList() {
      this.uploadFileList = [];
      this.urlArr = [];
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },
    //
    showImgs(data) {
      if (data.pictureList) {
        this.bigImg = data.pictureList.split(",");
        this.showViewer = true;
      } else if (typeof data === "string") {
        this.bigImg = data;
        this.showViewer = true;
      } else {
        this.bigImg = null;
      }
    },
    // 修改信息  图片回显
    echoImg(data) {
      if (data) {
        data = data.split(",");
        let obj = {};
        if (typeof data === "string") {
          obj.url = data;
          obj.uid = parseInt(Math.random() * 100000)
          this.urlArr.push(data);
          this.uploadFileList.push(obj);
          obj = {};
        } else {
          data.forEach(item => {
            obj.url = item;
            obj.uid = parseInt(Math.random() * 100000)
            this.urlArr.push(item);
            this.uploadFileList.push(obj);
            obj = {};
          });
        }
      }
    },
    // 上传之前
    beforeUploadM(file) {
      return this.beforeUpload(file, 500 * 1024)
    },
    beforeUpload(file, size) {
      if (!file) return;
      let name = file.name.split(".").pop();
      if (this.imgTypeArr.indexOf(name.toLowerCase()) == -1) {
        this.msgInfo("请上传 jpg/png 图片");
        return false;
      }
      if (file.size > size) {
        size = size / 1024;
        let unit = "KB";
        if (size > 1024) {
          size = size / 1024;
          unit = "MB";
        }
        this.msgInfo("文件大小不能超过" + size + unit);
        return false;
      }
      return true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      // this.uploadFileList = fileList
      this.urlArr = [];
      if (fileList.length > 0) {
        fileList.forEach(item => {
          this.urlArr.push(item.url)
        })
      }
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
      // this.uploadFileList = fileList
      // console.log(file)
      if (file.size > 500 * 1024) {
        this.$
      }
      this.urlArr.push(response.data.picture)
      this.msgSuccess('上传成功')
      // if (this.uploadFileList) {
      //   this.uploadFileList.push(response.data.picture);
      // } else {
      //   this.uploadFileList = [];
      //   this.uploadFileList.push(response.data.picture);
      // }
      // this.uploadFileList = response.data.picture;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handlePictureCardPreview(file) {
      if (file.url) {
        this.bigImg = file.url;
      } else {
        this.bigImg = file.response && file.response.data && file.response.data.picture;
      }
      if (this.bigImg) {
        this.showViewer = true;
      }
    },
  }
}
