export default {

  data() {

    return {
      sidebarWidth: 200,
      navHeight: 60,
      clientHeight: window.screen.availHeight, // 这里是给到了一个默认值 （这个很重要）
      clientWidth: window.screen.availWidth,
      tableHeight: window.screen.availHeight - 90, // 表格高度 
    }

  },
  watch: {
    // 监听屏幕高度改变表格高度
    clientHeight(val) {
      this.tableHeight = val - this.navHeight;
    }
  },

  mounted() {
    // 监听屏幕高度
    window.onresize = () => {
      console.log(11)
      return (() => {
        let width = window.screen.availWidth;
        let height = window.screen.availHeight
        this.clientHeight = height;
        this.clientWidth = width;
        this.tableHeight = height - this.navHeight;
      })();
    };
  }

}