# vue-paging
<h6>带跳转页码及每页多少条的vue分页</h6>

### 样式如下
<a href="https://wendychaung.github.io/vue-paging/" target="_blank"></a>

### 使用方法
*  引入 vue.js
*  引入 vuePage.js
*  引用 public.css
*  引入以下代码:

```
<div class="page clearfix">
       <vue-nav :total_count="total_count" :cur="cur" :all="all" :page_size="page_size" v-on:btnclick="listens" ></vue-nav>
 </div>
```

其中 cur为当前页数，all为总页数，page_size为每页显示的条数
