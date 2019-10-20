export default {

  data() {

    return {
      sidebarWidth: 200,
      navHeight: 60,
      clientHeight: document.body.clientHeight, // 这里是给到了一个默认值 （这个很重要）
      clientWidth: document.body.clientWidth,
      tableHeight: null, // 表格高度 
    }

  },

  watch: {
    // 监听屏幕高度改变表格高度
    clientHeight(val) {
      // 初始化表格高度
      this.tableHeight = val - this.navHeight + "px";
    }
  },

  mounted() {
    // 监听屏幕高度
    window.onresize = () => {
      return (() => {
        window.clientHeight = document.body.clientHeight;
        window.clientWidth = document.body.clientWidth;
        this.clientHeight = window.clientHeight;
        this.clientWidth = window.clientWidth;
      })();
    };

  }

}