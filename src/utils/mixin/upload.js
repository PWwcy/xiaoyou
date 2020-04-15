export default {
  data() {
    return {
      uploadFileList: [],
      urlArr: [],
    }
  },
  computed: {
    urlArrs() {
      return this.urlArr.length > 0 ? this.urlArr : undefined;
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
    initFileList() {
      this.uploadFileList = [];
      this.urlArr = [];
    },
    // 修改信息  图片回显
    echoImg(data) {
      if (data) {
        let obj = {};
        if (typeof data === "string") {
          obj.url = data;
          this.urlArr.push(data);
          this.uploadFileList.push(obj);
          obj = {};
        } else {
          data.forEach(item => {
            obj.url = item;
            this.urlArr.push(item);
            this.uploadFileList.push(obj);
            obj = {};
          });
        }
      }
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      // this.uploadFileList = fileList
      this.urlArr = [];
      if (fileList.length > 0) {
        fileList.forEach(item => {
          console.log(item);

          this.urlArr.push(item)
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
      this.urlArr.push(response.data.picture)
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
      // console.log(file);
      this.bigImg = file.url;
      this.showViewer = true;
    },
  }
}