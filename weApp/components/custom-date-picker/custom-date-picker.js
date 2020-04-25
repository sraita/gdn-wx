// 定义初始日期为当前日期
const date = new Date()
const nowYear = date.getFullYear()
const nowMonth = date.getMonth()
const nowDay = date.getDate()
let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
// 根据年月获取当月的总天数
let getDays = function (year, month) {
  if (month === 1) {
    return ((year % 4 === 0) && ((year % 100) !== 0)) || (year % 400 === 0) ? 29 : 28
  } else {
    return daysInMonth[month]
  }
}
// 根据年月日设置当前月有多少天 并更新年月日数组
let setDate = function (year, month, day, _this) {
  let daysNum = getDays(year, month)
  day = day > daysNum ? 1 : day
  let years = []
  let months = [0,1,2,3,4,5,6,7,8,9,10,11]
  let days = []
  let yearIndex = 0
  let monthIndex = 0
  let dayIndex = 0
  // 重新设置年份列表
  for (let i = nowYear - 10; i <= nowYear + 30; i++) {
    years.push(i)
  }
  years.map((v, idx) => {
    if (v === year) {
      yearIndex = idx
    }
  })
  // 重新设置月份列表
  months.map((v, idx) => {
    if (v === month) {
      monthIndex = idx
    }
  })
  // 重新设置日期列表
  for (let i = 1; i <= daysNum; i++) {
    var k = i;
    days.push(k)
  }
  days.map((v, idx) => {
    if (v === day) {
      dayIndex = idx
    }
  })

  _this.setData({
    //时间列表参数
    years: years,
    months: months,
    days: days,
    //选中的日期
    year: year,
    month: month,
    day: day,
    valueIndexs: [yearIndex, monthIndex, dayIndex],
  })
}

let addZero = function (val) {
  if (val < 10) {
    val = '0'+val;
  }
  return val;
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Array,
      value: [nowYear,nowMonth,nowDay]
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    years: [],
    months: [],
    days: [],
    //选中的日期
    year: nowYear,
    month: nowMonth,
    day: nowDay,
    valueIndexs: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    bindChange: function (e) {
      let val = e.detail.value
      let year = this.data.years[val[0]],
          month = this.data.months[val[1]],
          day = this.data.days[val[2]];

      setDate(year, month, day, this)
      this.triggerEvent('change', {
        value: [year, month, day, `${year}-${addZero(month + 1)}-${addZero(day)}`] 
      }, {});
    }
    
  },
  lifetimes:{
    ready: function() {
      if (this.data.value) {
        setDate(this.data.value[0], this.data.value[1], this.data.value[2], this)
      }
      setDate(this.data.year, this.data.month, this.data.day, this);
    }
  }
})
