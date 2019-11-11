// components/am-pm-picker/index.js
function getMonthDay(year, month) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;
  let dayCount = 31;
  if (month == 2) {
    dayCount = flag ? 29 : 28;
  }
  else if ([4, 6, 9, 11].includes(month)) {
    dayCount = 30;
  }
  return dayCount;
}

function getYears() {
  const date = new Date();
  let years = [];
  for (let i = 1990; i <= date.getFullYear() + 10; i++) {
    years.push(i)
  }
  return years;
}

function getDays(year,month) {
  let days = [
    1,2,3,4,5,6,7,8,9,10,
    11,12,13,14,15,16,17,18,19,20,
    21,22,23,24,25,26,27,28,29,30,31
  ];
  let monthDayCount = getMonthDay(year, month);
  return days.slice(0,monthDayCount);
}

function init(that) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  let years = getYears();
  let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let days = getDays(date.getFullYear(), date.getMonth());
  let ampms = ['上午', '下午', '全天'];
  let dateRange = [years, months, days, ampms]
  let selectDate = [
    years.indexOf(year),
    months.indexOf(month)+1,
    days.indexOf(day),
    0
  ];
  that.setData({
    value: [year, month, day, 0], // 初始化选中值 indexs
    dateRange: dateRange,
    selectDate: selectDate
  })
}
function columnUpdate (that) {
  let {dateRange, selectDate} = that.data;

  const year = dateRange[0][selectDate[0]];
  const month = dateRange[1][selectDate[1]];
  dateRange[2] = getDays(year, month);
  that.setData({
    dateRange: dateRange
  });
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectDate:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    value:[0,0,0,0],
    years:[],
    months:[1,2,3,4,5,6,7,8,9,10,11,12],
    days:[],
    ampms:['上午','下午','全天'],
    dateRange:[]
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      init(this);
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    dateColumnChange: function (event) {
      let { column, value } = event.detail;
      let { selectDate } = this.data;
   
      switch (column) {
        case 0:
          selectDate[0] = value;
          break;
        case 1:
          selectDate[1] = value;
          break;
        case 2:
          selectDate[2] = value;
          break;
        case 3:
          selectDate[3] = value;
        default:
          break;
      }
      columnUpdate(this);
    },
    datePickerChange: function (event) {
      let {dateRange, selectDate} = this.data;
      let value = [
        dateRange[0][selectDate[0]],
        dateRange[1][selectDate[1]] - 1,
        dateRange[2][selectDate[2]],
        dateRange[3][selectDate[3]],
      ];
      var myEventDetail = {
        value: value
      } // detail对象，提供给事件监听函数
      this.triggerEvent('change', myEventDetail, {})
    }
  }
});
