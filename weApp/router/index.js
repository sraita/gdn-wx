import pages from './pages'
import Queue from '../structure/Queue'

export default class Router {
  constructor() {
    this.init();
  }

  init() {
    this.createRouterMap(pages);
    this.history = new Queue();
    this.current = this.routerMap.entries().next().value ? this.routerMap.entries().next().value[1] : null;
    if (!this.current) {
      throw Error(` Error [pages.js not config]`)
      return
    }
  }
  // 创建routerMap
  createRouterMap(arr = []) {
    let m = new Map();
    arr.forEach(item => {
      m.set(item.name, item)
    });
    this.routerMap = m;
  }

  generateUrl(path, query) {
    let url = path;
    if (query) {
      let queryArr = [];
      for (let key in query) {
        if (query.hasOwnProperty(key)) {
          queryArr.push(`${key}=${query[key]}`)
        }
      }
      url = `${url}?${queryArr.join('&')}`
    }
    return url;
  }

  push(name, params = {}, query = null) {
    let page = this.routerMap.get(name);
    let url = this.generateUrl(page.path, query);
    this.current = page;
    if (page.meta && page.meta.tabbar) {
      this.switchTab(url, params);
    } else {
      return new Promise((resolve, reject) => {
        wx.navigateTo({
          url,
          events: params,
          success(res) {
            resolve(res);
          },
          fail(err) {
            reject(err);
          }
        });
      });
    }
  }

  replace(name, params = {}, query = null) {
    let page = this.routerMap.get(name);
    let url = this.generateUrl(page.path, query);
    this.current = page;
    if (page.meta && page.meta.tabbar) {
      this.switchTab(url, params);
    } else {
      return new Promise((resolve, reject) => {
        wx.redirectTo({
          url,
          events: params,
          success(res) {
            resolve(res);
          },
          fail(err) {
            reject(err);
          }
        });
      });
    }
  }

  switchTab (url, params) {
    return new Promise((resolve, reject) => {
      wx.switchTab({
        url,
        events: params,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        }
      });
    });
  }

  back(delta = 1) {
    return new Promise((resolve, reject) => {
      wx.navigateBack({
        delta,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        }
      });
    });
  }

}
