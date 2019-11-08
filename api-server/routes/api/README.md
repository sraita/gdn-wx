## 查询字符串(API过滤参数)
```js
/**
 * /api/posts?cid=1002123&page=1&limit=10&sortby=title&order=asc
 * cid: 指定筛选条件
 * page: 第几页
 * limit: 每页的记录数
 * sortby: 返回结果按照哪个属性排序
 * order: 排序顺序
 * fields=id,title : 限制API返回哪些字段
 * /

```

## API Response
名称 | 描述
|------|------| 
status | 状态码. 标识请求成功与否,[success:成功; error: 失败]
code | 错误码. 给出明确错误码，更好的应对业务异常；请求成功该值为 0
message | 错误消息. 与错误码相对应，更具体的描述异常信息
data | 返回结果. 通常为了应对不同返回值类型，将其声明为泛型类型
pagination | 分页信息. 用于列表查询
extras | 附加字段. API 接口出错时， 下一步操作需要依赖的数据
_links | 相关连接. 告诉API使用者下一步可以进行哪些操作, 通常使用API别名时给出此字段

```js
// success Response - 单个文档
res = {
  status: 'success', // 状态码，标识请求成功与否，[success:成功；'error':失败]
  code: '', // 错误码，给出明确错误码，更好的应对业务异常；请求成功该值为 ''
  message:'',
  data:{
    _id: '_id',
    title: 'Demo Document'
  }
}

// success Response - 多个文档
res = {
  status: 'success',
  code: '',
  message: '',
  data:[
    {
      _id: '_id',
      title: 'Demo Document'
    },
    {
      _id: '_id',
      title: 'Demo Document'
    }
  ],
  pagination:{
    total: 100,
    page:1,
    limit: 2,
    sortby:'',
    order:''
  }
}

// error Response 
res = {
  status:'error',
  code: 'need_bind_account',
  message:'该微信号尚未绑定账户',
  errors:[
    {

    }
  ],
  extras: {
    openId: ''
  }
}
```
### 认证出错参考(401 Unauthorized)
错误名称 | 描述
|------|------|
`user_not_found` | 用户不存在
`incorrect_password` | 密码错误
`user_was_locked` | 账号被锁定
`token_expired` | token 过期
`token_verify_field` | token 校验失败
`need_bind_account` | 需要绑定账号

### 访问受限(403 Forbidden)
错误名称 | 描述
|------|------|
`maximum_number` | 超过最大尝试次数

### 请求出错参考(422 Unprocessable Entity)
错误名称 | 描述
|------|------|
`missing`	| 这意味着资源不存在。
`missing_field` |	这意味着尚未设置资源上的必填字段。
`invalid` |	这意味着字段格式无效。该资源的文档应该能够为您提供更多具体信息。
`already_exists` |	这意味着另一个资源具有与此字段相同的值。在必须具有某些唯一键（例如标签名称）的资源中可能会发生这种情况。


## API 状态码
参数 | 名称 | 说明
|------|------|------|
200 | OK | 请求成功
201 | CREATED | 创建或修改数据成功
204 | NO CONTENT | 删除数据成功
400 | INVALID REQUEST | 用户发出的请求有误
401 | Unauthorized | 表示用户没有权限（令牌、用户名、密码错误）
403 | Forbidden | 表示用户得到授权（与401错误相对），但是访问是被禁止的
404 | NOT FOUND | 用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
422 | Unprocesable entity | 当创建一个对象时，发生一个验证错误
500 | INTERNAL SERVER ERROR | 服务器发生错误，用户将无法判断发出的请求是否成功。



