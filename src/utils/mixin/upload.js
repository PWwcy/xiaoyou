export default {
  data() {
    return {
      uploadFileList: []
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

    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.uploadFileList = fileList
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
      this.uploadFileList = fileList
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
      console.log(file);
    },
  }
}